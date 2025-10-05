-- products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text,
  stock integer DEFAULT 0,
  price numeric(10,2),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
