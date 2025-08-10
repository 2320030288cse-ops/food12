/*
  # Create comprehensive collections storage system

  1. New Tables
    - `menu_items` - Store all menu items with full details
    - `inventory_items` - Store inventory with stock tracking
    - `tables` - Store table information and status
    - `customers` - Store customer information
    - `orders` - Store order information
    - `order_items` - Store individual order items
    - `bills` - Store bill information
    - `bill_items` - Store individual bill items
    - `daily_collections` - Store daily revenue collections
    - `profiles` - Store user profiles linked to auth

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add proper indexes for performance

  3. Functions
    - Auto-generate bill numbers
    - Update timestamps automatically
*/

-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'cashier', 'kitchen')),
  avatar_url text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  cost_price numeric,
  image_url text,
  is_available boolean DEFAULT true,
  is_special boolean DEFAULT false,
  preparation_time integer DEFAULT 15,
  calories integer,
  allergens text[],
  dietary_info text[],
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  unit text NOT NULL,
  current_stock numeric NOT NULL DEFAULT 0,
  minimum_stock numeric NOT NULL DEFAULT 0,
  maximum_stock numeric,
  cost_per_unit numeric,
  supplier text,
  last_restocked timestamptz,
  expiry_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tables table
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer UNIQUE NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  position_x numeric,
  position_y numeric,
  shape text DEFAULT 'round' CHECK (shape IN ('round', 'square', 'rectangle')),
  qr_code text,
  current_order_id uuid,
  reserved_by text,
  reserved_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  email text,
  name text,
  date_of_birth date,
  preferences jsonb DEFAULT '{}',
  loyalty_points integer DEFAULT 0,
  total_visits integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  last_visit timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  table_id uuid REFERENCES restaurant_tables(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled')),
  order_type text DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
  subtotal numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  special_instructions text,
  estimated_time integer,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price > 0),
  total_price numeric NOT NULL CHECK (total_price > 0),
  special_instructions text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
  created_at timestamptz DEFAULT now()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number text UNIQUE NOT NULL,
  order_id uuid NOT NULL REFERENCES orders(id),
  customer_name text,
  customer_phone text,
  table_number integer,
  subtotal numeric NOT NULL,
  tax_amount numeric NOT NULL,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi', 'wallet', 'bank_transfer')),
  payment_status text DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  created_by uuid REFERENCES profiles(id),
  printed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create bill_items table
CREATE TABLE IF NOT EXISTS bill_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price > 0),
  total_price numeric NOT NULL CHECK (total_price > 0),
  created_at timestamptz DEFAULT now()
);

-- Create daily_collections table (enhanced)
CREATE TABLE IF NOT EXISTS daily_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_amount numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  payment_methods jsonb DEFAULT '{"cash": 0, "card": 0, "upi": 0, "wallet": 0}',
  bills_generated integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to generate bill numbers
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS text AS $$
DECLARE
  bill_date text;
  sequence_num integer;
  bill_number text;
BEGIN
  -- Get current date in YYYYMMDD format
  bill_date := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get next sequence number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(bill_number FROM 11) AS integer)), 0) + 1
  INTO sequence_num
  FROM bills
  WHERE bill_number LIKE 'GS' || bill_date || '%';
  
  -- Generate bill number: GS + YYYYMMDD + 001
  bill_number := 'GS' || bill_date || LPAD(sequence_num::text, 3, '0');
  
  RETURN bill_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  order_date text;
  sequence_num integer;
  order_number text;
BEGIN
  -- Get current date in YYYYMMDD format
  order_date := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get next sequence number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 11) AS integer)), 0) + 1
  INTO sequence_num
  FROM orders
  WHERE order_number LIKE 'ORD' || order_date || '%';
  
  -- Generate order number: ORD + YYYYMMDD + 001
  order_number := 'ORD' || order_date || LPAD(sequence_num::text, 3, '0');
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_tables_updated_at BEFORE UPDATE ON restaurant_tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_collections_updated_at BEFORE UPDATE ON daily_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_inventory_items_stock ON inventory_items(current_stock, minimum_stock);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_collections_date ON daily_collections(date DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to read profiles" ON profiles FOR SELECT TO authenticated USING (true);

-- Create RLS policies for menu_items
CREATE POLICY "Allow authenticated users to read menu items" ON menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert menu items" ON menu_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update menu items" ON menu_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete menu items" ON menu_items FOR DELETE TO authenticated USING (true);

-- Create RLS policies for inventory_items
CREATE POLICY "Allow authenticated users to read inventory" ON inventory_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert inventory" ON inventory_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update inventory" ON inventory_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete inventory" ON inventory_items FOR DELETE TO authenticated USING (true);

-- Create RLS policies for restaurant_tables
CREATE POLICY "Allow authenticated users to read tables" ON restaurant_tables FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert tables" ON restaurant_tables FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update tables" ON restaurant_tables FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete tables" ON restaurant_tables FOR DELETE TO authenticated USING (true);

-- Create RLS policies for customers
CREATE POLICY "Allow authenticated users to read customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update customers" ON customers FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for orders
CREATE POLICY "Allow authenticated users to read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update orders" ON orders FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for order_items
CREATE POLICY "Allow authenticated users to read order items" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert order items" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update order items" ON order_items FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for bills
CREATE POLICY "Allow authenticated users to read bills" ON bills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert bills" ON bills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update bills" ON bills FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for bill_items
CREATE POLICY "Allow authenticated users to read bill items" ON bill_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert bill items" ON bill_items FOR INSERT TO authenticated WITH CHECK (true);

-- Create RLS policies for daily_collections
CREATE POLICY "Allow authenticated users to read daily collections" ON daily_collections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert daily collections" ON daily_collections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update daily collections" ON daily_collections FOR UPDATE TO authenticated USING (true);

-- Insert sample data
INSERT INTO menu_items (name, description, category, price, is_available, is_special, preparation_time, allergens) VALUES
('Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces', 'Main Course', 320, true, false, 25, ARRAY['dairy']),
('Paneer Tikka', 'Grilled cottage cheese marinated in aromatic spices', 'Appetizer', 280, true, true, 15, ARRAY['dairy']),
('Chicken Biryani', 'Fragrant basmati rice layered with spiced chicken', 'Main Course', 350, true, true, 35, ARRAY[]),
('Dal Makhani', 'Rich and creamy black lentils slow-cooked with butter', 'Main Course', 220, true, false, 30, ARRAY['dairy']),
('Naan Bread', 'Soft and fluffy Indian bread baked in tandoor', 'Bread', 60, true, false, 10, ARRAY['gluten', 'dairy']),
('Gulab Jamun', 'Sweet milk dumplings soaked in sugar syrup', 'Dessert', 120, true, false, 5, ARRAY['dairy', 'nuts']),
('Masala Chai', 'Traditional Indian spiced tea with milk', 'Beverages', 40, true, false, 5, ARRAY['dairy']),
('Chicken Tikka', 'Grilled chicken pieces marinated in yogurt and spices', 'Appetizer', 300, true, false, 20, ARRAY['dairy'])
ON CONFLICT (name) DO NOTHING;

INSERT INTO restaurant_tables (table_number, capacity, status, shape) VALUES
(1, 4, 'available', 'round'),
(2, 2, 'available', 'square'),
(3, 6, 'available', 'rectangle'),
(4, 4, 'available', 'round'),
(5, 8, 'available', 'rectangle'),
(6, 2, 'available', 'square'),
(7, 4, 'available', 'round'),
(8, 6, 'available', 'rectangle')
ON CONFLICT (table_number) DO NOTHING;

INSERT INTO inventory_items (name, category, unit, current_stock, minimum_stock, maximum_stock, cost_per_unit, supplier) VALUES
('Basmati Rice', 'Grains', 'kg', 50, 10, 100, 120, 'Local Supplier'),
('Chicken', 'Meat', 'kg', 25, 5, 50, 280, 'Fresh Meat Co.'),
('Paneer', 'Dairy', 'kg', 15, 3, 30, 350, 'Dairy Farm'),
('Onions', 'Vegetables', 'kg', 40, 8, 80, 30, 'Vegetable Market'),
('Tomatoes', 'Vegetables', 'kg', 30, 6, 60, 40, 'Vegetable Market'),
('Cooking Oil', 'Oils', 'liters', 20, 4, 40, 150, 'Oil Distributor'),
('Spices Mix', 'Spices', 'kg', 10, 2, 20, 500, 'Spice Merchant'),
('Milk', 'Dairy', 'liters', 25, 5, 50, 60, 'Dairy Farm')
ON CONFLICT (name) DO NOTHING;

-- Insert today's daily collection record
INSERT INTO daily_collections (date, total_amount, total_orders, payment_methods) VALUES
(CURRENT_DATE, 0, 0, '{"cash": 0, "card": 0, "upi": 0, "wallet": 0}')
ON CONFLICT (date) DO NOTHING;