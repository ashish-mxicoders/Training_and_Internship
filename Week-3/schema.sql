-- ============================================================================
-- Week 3: Database Engineering & Relational Schema Design
-- Project: E-Commerce Store Database Schema (PostgreSQL)
-- Author: Ashish (Internship Task)
-- 
-- Normalization Details:
-- 1NF: Atomic columns (no lists/repeating groups), primary keys on all tables.
-- 2NF: No partial dependency; order_items splits many-to-many relationship between orders & products.
-- 3NF: No transitive dependency; category details reside in categories, payment details in payments.
-- ============================================================================

-- Clean up existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Users Table
-- Stores customer profiles. Email is unique for authentication/identification.
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. Categories Table
-- Normalized table for product categories (3NF compliant: category names not duplicated in products).
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ----------------------------------------------------------------------------
-- 3. Products Table
-- Holds items available for sale, linked to categories via Foreign Key.
-- Includes CHECK constraints to make sure price and stock are non-negative.
-- ----------------------------------------------------------------------------
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. Orders Table
-- Represents an order placed by a user.
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    shipping_city VARCHAR(100) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0)
);

-- ----------------------------------------------------------------------------
-- 5. Order Items Table
-- Resolves Many-to-Many between Orders and Products (2NF & 3NF).
-- Stores historical unit_price at the time of purchase.
-- ----------------------------------------------------------------------------
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    CONSTRAINT uq_order_product UNIQUE (order_id, product_id)
);

-- ----------------------------------------------------------------------------
-- 6. Payments Table
-- Payment transaction status separated from Orders to keep schema normalized.
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(30) NOT NULL 
        CHECK (payment_method IN ('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CASH_ON_DELIVERY')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (payment_status IN ('SUCCESS', 'PENDING', 'FAILED', 'REFUNDED')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. Reviews Table
-- Product feedback submitted by verified users.
-- Rating restricted between 1 and 5 stars.
-- ----------------------------------------------------------------------------
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_product_review UNIQUE (user_id, product_id)
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- Foreign keys and frequently queried filter/join columns are indexed.
-- ============================================================================
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
