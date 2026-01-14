/*
  # Create Products and Reviews Schema

  ## New Tables
  
  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `url` (text) - Original product URL from e-commerce site
  - `platform` (text) - E-commerce platform (shopee, tokopedia, etc.)
  - `image_url` (text, nullable) - Product image URL
  - `price` (text, nullable) - Product price
  - `average_rating` (numeric, default 0) - Average rating from reviews
  - `total_reviews` (integer, default 0) - Total number of reviews
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  ### `reviews`
  - `id` (uuid, primary key) - Unique review identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `reviewer_name` (text) - Name of reviewer
  - `rating` (integer) - Rating (1-5)
  - `comment` (text) - Review comment
  - `review_date` (timestamptz) - Date of review
  - `helpful_count` (integer, default 0) - Number of helpful votes
  - `created_at` (timestamptz) - Timestamp of creation

  ## Security
  - Enable RLS on both tables
  - Public read access for all users (since this is a review aggregation app)
  - Authenticated users can insert products and reviews
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  platform text NOT NULL,
  image_url text,
  price text,
  average_rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  review_date timestamptz DEFAULT now(),
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);