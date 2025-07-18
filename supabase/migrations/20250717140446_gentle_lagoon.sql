/*
  # Create orders table for database storage

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_data` (jsonb) - Complete order information
      - `table_number` (integer, optional)
      - `customer_name` (text, optional)
      - `total_amount` (numeric)
      - `payment_status` (text)
      - `payment_methods` (jsonb)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, optional)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_data jsonb NOT NULL,
  table_number integer,
  customer_name text,
  total_amount numeric NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_methods jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON orders(table_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);