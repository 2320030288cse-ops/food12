/*
  # Create daily collections table

  1. New Tables
    - `daily_collections`
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `total_amount` (numeric)
      - `total_orders` (integer)
      - `payment_methods` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `daily_collections` table
    - Add policy for authenticated users to read and write data
*/

CREATE TABLE IF NOT EXISTS daily_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_amount numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  payment_methods jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read daily collections"
  ON daily_collections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert daily collections"
  ON daily_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update daily collections"
  ON daily_collections
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_daily_collections_date ON daily_collections(date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_daily_collections_updated_at
    BEFORE UPDATE ON daily_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();