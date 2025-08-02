/*
  # Add Authentication, Menu Items, and Billing System

  1. New Tables
    - `profiles` - User profiles linked to auth.users
    - `menu_items` - Persistent menu items storage
    - `bills` - Bill records for printing and history
    - `bill_items` - Individual items in each bill
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Link profiles to auth.users
  
  3. Functions
    - Auto-create profile on user signup
    - Bill numbering system
*/

-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'cashier', 'kitchen')),
  avatar_url text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  cost_price numeric CHECK (cost_price >= 0),
  image_url text,
  is_available boolean DEFAULT true,
  is_special boolean DEFAULT false,
  preparation_time integer DEFAULT 15,
  calories integer,
  allergens text[],
  dietary_info text[],
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Menu items policies
CREATE POLICY "Anyone can view available menu items"
  ON menu_items
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Authenticated users can view all menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert menu items"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff can update menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Only admins can delete menu items"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number text UNIQUE NOT NULL,
  order_id uuid,
  customer_name text,
  customer_phone text,
  table_number integer,
  subtotal numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_method text CHECK (payment_method IN ('cash', 'card', 'upi', 'wallet')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  notes text,
  printed_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Bills policies
CREATE POLICY "Authenticated users can view bills"
  ON bills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can create bills"
  ON bills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can update bills"
  ON bills
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Create bill_items table
CREATE TABLE IF NOT EXISTS bill_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid REFERENCES bills(id) ON DELETE CASCADE NOT NULL,
  menu_item_id uuid REFERENCES menu_items(id),
  item_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

-- Bill items policies
CREATE POLICY "Authenticated users can view bill items"
  ON bill_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert bill items"
  ON bill_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to generate bill numbers
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS text AS $$
DECLARE
  bill_count integer;
  bill_number text;
BEGIN
  SELECT COUNT(*) + 1 INTO bill_count FROM bills WHERE DATE(created_at) = CURRENT_DATE;
  bill_number := 'GS' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(bill_count::text, 4, '0');
  RETURN bill_number;
END;
$$ LANGUAGE plpgsql;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_bills_date ON bills(DATE(created_at));
CREATE INDEX IF NOT EXISTS idx_bills_number ON bills(bill_number);
CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();