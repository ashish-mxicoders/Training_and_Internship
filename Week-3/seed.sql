-- ============================================================================
-- Week 3: Database Engineering & SQL Mastery
-- Seed Script: Realistic Sample Data for E-Commerce Database
-- Author: Ashish (Internship Task)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Insert Categories
-- ----------------------------------------------------------------------------
INSERT INTO categories (name, description) VALUES
('Electronics', 'Gadgets, accessories, smart devices, and home entertainment'),
('Fashion & Apparel', 'Men and women casual wear, formal wear, and accessories'),
('Home & Kitchen', 'Kitchen appliances, cookware, and home essentials'),
('Books & Stationery', 'Novels, technical books, self-help, and notebooks'),
('Fitness & Sports', 'Workout equipment, yoga gear, and activewear');

-- ----------------------------------------------------------------------------
-- 2. Insert Users
-- ----------------------------------------------------------------------------
INSERT INTO users (full_name, email, phone, city, created_at) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '+91-9876543210', 'Mumbai', '2024-05-10 10:00:00+00'),
('Priya Patel', 'priya.patel@example.com', '+91-9876543211', 'Ahmedabad', '2024-05-15 11:30:00+00'),
('Amit Verma', 'amit.verma@example.com', '+91-9876543212', 'Bengaluru', '2024-06-01 09:15:00+00'),
('Neha Singh', 'neha.singh@example.com', '+91-9876543213', 'Delhi', '2024-06-10 14:20:00+00'),
('Rajesh Kumar', 'rajesh.kumar@example.com', '+91-9876543214', 'Pune', '2024-06-25 16:45:00+00'),
('Sneha Iyer', 'sneha.iyer@example.com', '+91-9876543215', 'Chennai', '2024-07-01 08:30:00+00'),
('Vikram Mehta', 'vikram.mehta@example.com', '+91-9876543216', 'Mumbai', '2024-07-15 12:00:00+00'),
('Pooja Nair', 'pooja.nair@example.com', '+91-9876543217', 'Kochi', '2024-08-01 13:10:00+00'),
('Ankit Gupta', 'ankit.gupta@example.com', '+91-9876543218', 'Jaipur', '2024-08-10 15:50:00+00'),
('Divya Joshi', 'divya.joshi@example.com', '+91-9876543219', 'Bengaluru', '2024-08-20 17:00:00+00');

-- ----------------------------------------------------------------------------
-- 3. Insert Products
-- (Some products will have high sales, others zero sales to test anti-joins)
-- ----------------------------------------------------------------------------
INSERT INTO products (category_id, name, description, price, stock_quantity) VALUES
-- Electronics (cat_id: 1)
(1, 'Wireless Bluetooth Headphones', 'Active noise cancelling over-ear headphones', 2999.00, 50),
(1, 'Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with blue switches', 3499.00, 30),
(1, 'Fast Charging Power Bank 20000mAh', '22.5W high speed power delivery', 1499.00, 100),
(1, 'Smart Fitness Band', 'OLED display with heart rate and sleep tracking', 1999.00, 45),
(1, 'Ultra HD 4K Webcam', 'Stream-ready 60fps auto-focus webcam', 4599.00, 15),

-- Fashion (cat_id: 2)
(2, 'Men Slim Fit Cotton Shirt', 'Breathable pure cotton casual shirt', 899.00, 80),
(2, 'Women High-Rise Stretch Jeans', 'Comfortable classic denim jeans', 1599.00, 60),
(2, 'Classic Leather Wallet', 'Genuine leather bi-fold RFID protected wallet', 699.00, 120),
(2, 'Unisex Polarized Sunglasses', 'UV400 protection lightweight frame', 1199.00, 40),

-- Home & Kitchen (cat_id: 3)
(3, 'Stainless Steel Electric Kettle', '1.5 Litre fast boil auto shut-off kettle', 999.00, 75),
(3, 'High Speed 750W Mixer Grinder', '3 stainless steel jars with heavy motor', 2899.00, 25),
(3, 'Cast Iron Cooking Skillet', 'Pre-seasoned heavy duty induction friendly pan', 1399.00, 35),
(3, 'Aroma Essential Oil Diffuser', 'Ultrasonic humidifier with ambient LED light', 1249.00, 50),

-- Books (cat_id: 4)
(4, 'Atomic Habits by James Clear', 'Transformative guide on building good habits', 499.00, 150),
(4, 'Designing Data-Intensive Applications', 'O Reilly comprehensive guide to databases and systems', 1850.00, 20),
(4, 'Clean Code by Robert C. Martin', 'Handbook of agile software craftsmanship', 1190.00, 30),
(4, 'The Psychology of Money', 'Timeless lessons on wealth and greed', 399.00, 100),

-- Fitness & Sports (cat_id: 5)
(5, 'Non-Slip Eco Yoga Mat', '6mm thick high density cushioned workout mat', 799.00, 65),
(5, 'Adjustable Dumbbells Set (20KG)', 'Cast iron home workout strength training weights', 3999.00, 10),
(5, 'Skipping Rope with Counter', 'Speed jump rope with digital rotation tracker', 349.00, 90),
-- Products intentionally without any sales (to test 06_products_never_ordered query):
(1, 'Vintage Turntable Vinyl Player', 'Retro bluetooth turntable with built-in speakers', 7999.00, 8),
(3, 'Smart Robot Vacuum Cleaner', 'Automated floor mopping with LIDAR sensor', 18999.00, 5);

-- ----------------------------------------------------------------------------
-- 4. Insert Orders
-- Realistic order progression across multiple months (Jun-Oct 2024)
-- ----------------------------------------------------------------------------
INSERT INTO orders (user_id, order_date, status, shipping_city, total_amount) VALUES
-- Order 1: Rahul Sharma (Mumbai) - Jun 05
(1, '2024-06-05 14:10:00+00', 'DELIVERED', 'Mumbai', 4498.00),
-- Order 2: Priya Patel (Ahmedabad) - Jun 12
(2, '2024-06-12 11:20:00+00', 'DELIVERED', 'Ahmedabad', 1499.00),
-- Order 3: Amit Verma (Bengaluru) - Jun 20
(3, '2024-06-20 16:45:00+00', 'DELIVERED', 'Bengaluru', 3040.00),
-- Order 4: Neha Singh (Delhi) - Jul 02
(4, '2024-07-02 10:00:00+00', 'DELIVERED', 'Delhi', 5498.00),
-- Order 5: Rahul Sharma (Mumbai) - Jul 18 (Repeat order 2)
(1, '2024-07-18 18:30:00+00', 'DELIVERED', 'Mumbai', 2899.00),
-- Order 6: Rajesh Kumar (Pune) - Jul 25
(5, '2024-07-25 12:15:00+00', 'DELIVERED', 'Pune', 1148.00),
-- Order 7: Priya Patel (Ahmedabad) - Aug 05 (Repeat order 2)
(2, '2024-08-05 15:40:00+00', 'DELIVERED', 'Ahmedabad', 2498.00),
-- Order 8: Vikram Mehta (Mumbai) - Aug 12
(7, '2024-08-12 09:50:00+00', 'DELIVERED', 'Mumbai', 4599.00),
-- Order 9: Amit Verma (Bengaluru) - Aug 22 (Repeat order 2)
(3, '2024-08-22 14:05:00+00', 'DELIVERED', 'Bengaluru', 1190.00),
-- Order 10: Neha Singh (Delhi) - Sep 01 (Repeat order 2)
(4, '2024-09-01 11:30:00+00', 'DELIVERED', 'Delhi', 3999.00),
-- Order 11: Sneha Iyer (Chennai) - Sep 08
(6, '2024-09-08 17:15:00+00', 'SHIPPED', 'Chennai', 2398.00),
-- Order 12: Rahul Sharma (Mumbai) - Sep 15 (Repeat order 3)
(1, '2024-09-15 13:00:00+00', 'DELIVERED', 'Mumbai', 1850.00),
-- Order 13: Pooja Nair (Kochi) - Sep 20
(8, '2024-09-20 10:45:00+00', 'DELIVERED', 'Kochi', 799.00),
-- Order 14: Ankit Gupta (Jaipur) - Sep 28
(9, '2024-09-28 16:20:00+00', 'PROCESSING', 'Jaipur', 3499.00),
-- Order 15: Neha Singh (Delhi) - Oct 05 (Repeat order 3)
(4, '2024-10-05 12:00:00+00', 'DELIVERED', 'Delhi', 1498.00),
-- Order 16: Divya Joshi (Bengaluru) - Oct 10
(10, '2024-10-10 14:40:00+00', 'PENDING', 'Bengaluru', 2999.00),
-- Order 17: Rajesh Kumar (Pune) - Oct 14 (Failed payment / cancelled)
(5, '2024-10-14 18:00:00+00', 'CANCELLED', 'Pune', 3999.00);

-- ----------------------------------------------------------------------------
-- 5. Insert Order Items
-- ----------------------------------------------------------------------------
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
-- Order 1 (Total: 4498) -> Headphones (2999) + Power bank (1499)
(1, 1, 1, 2999.00),
(1, 3, 1, 1499.00),

-- Order 2 (Total: 1499) -> Power bank (1499)
(2, 3, 1, 1499.00),

-- Order 3 (Total: 3040) -> Designing Data-Intensive Apps (1850) + Clean Code (1190)
(3, 15, 1, 1850.00),
(3, 16, 1, 1190.00),

-- Order 4 (Total: 5498) -> Headphones (2999) + Smart Fitness Band (1999) + Atomic Habits (499) -> let's match 5497 approx
(4, 1, 1, 2999.00),
(4, 4, 1, 1999.00),
(4, 14, 1, 499.00),

-- Order 5 (Total: 2899) -> Mixer Grinder (2899)
(5, 11, 1, 2899.00),

-- Order 6 (Total: 1148) -> Skipping Rope (349) + Yoga Mat (799)
(6, 18, 1, 799.00),
(6, 20, 1, 349.00),

-- Order 7 (Total: 2498) -> Men Shirt (899) + Women Jeans (1599)
(7, 6, 1, 899.00),
(7, 7, 1, 1599.00),

-- Order 8 (Total: 4599) -> 4K Webcam (4599)
(8, 5, 1, 4599.00),

-- Order 9 (Total: 1190) -> Clean Code (1190)
(9, 16, 1, 1190.00),

-- Order 10 (Total: 3999) -> Adjustable Dumbbells (3999)
(10, 19, 1, 3999.00),

-- Order 11 (Total: 2398) -> Sunglasses (1199) x 2
(11, 9, 2, 1199.00),

-- Order 12 (Total: 1850) -> Designing Data-Intensive Apps (1850)
(12, 15, 1, 1850.00),

-- Order 13 (Total: 799) -> Yoga Mat (799)
(13, 18, 1, 799.00),

-- Order 14 (Total: 3499) -> Mechanical Keyboard (3499)
(14, 2, 1, 3499.00),

-- Order 15 (Total: 1498) -> Electric Kettle (999) + Atomic Habits (499)
(15, 10, 1, 999.00),
(15, 14, 1, 499.00),

-- Order 16 (Total: 2999) -> Wireless Headphones (2999)
(16, 1, 1, 2999.00),

-- Order 17 (Total: 3999) -> Dumbbells (3999)
(17, 19, 1, 3999.00);

-- Update total_amount in orders table to match accurate order_item sums exactly
UPDATE orders o
SET total_amount = sub.calculated_total
FROM (
    SELECT order_id, SUM(quantity * unit_price) AS calculated_total
    FROM order_items
    GROUP BY order_id
) sub
WHERE o.order_id = sub.order_id;

-- ----------------------------------------------------------------------------
-- 6. Insert Payments
-- ----------------------------------------------------------------------------
INSERT INTO payments (order_id, payment_method, payment_status, amount, payment_date) VALUES
(1, 'UPI', 'SUCCESS', 4498.00, '2024-06-05 14:12:00+00'),
(2, 'CREDIT_CARD', 'SUCCESS', 1499.00, '2024-06-12 11:21:00+00'),
(3, 'NET_BANKING', 'SUCCESS', 3040.00, '2024-06-20 16:47:00+00'),
(4, 'UPI', 'SUCCESS', 5497.00, '2024-07-02 10:02:00+00'),
(5, 'CREDIT_CARD', 'SUCCESS', 2899.00, '2024-07-18 18:31:00+00'),
(6, 'DEBIT_CARD', 'SUCCESS', 1148.00, '2024-07-25 12:16:00+00'),
(7, 'UPI', 'SUCCESS', 2498.00, '2024-08-05 15:42:00+00'),
(8, 'CREDIT_CARD', 'SUCCESS', 4599.00, '2024-08-12 09:52:00+00'),
(9, 'UPI', 'SUCCESS', 1190.00, '2024-08-22 14:06:00+00'),
(10, 'NET_BANKING', 'SUCCESS', 3999.00, '2024-09-01 11:32:00+00'),
(11, 'CREDIT_CARD', 'SUCCESS', 2398.00, '2024-09-08 17:16:00+00'),
(12, 'UPI', 'SUCCESS', 1850.00, '2024-09-15 13:01:00+00'),
(13, 'UPI', 'SUCCESS', 799.00, '2024-09-20 10:46:00+00'),
(14, 'CASH_ON_DELIVERY', 'PENDING', 3499.00, '2024-09-28 16:21:00+00'),
(15, 'UPI', 'SUCCESS', 1498.00, '2024-10-05 12:02:00+00'),
(16, 'NET_BANKING', 'PENDING', 2999.00, '2024-10-10 14:41:00+00'),
(17, 'CREDIT_CARD', 'FAILED', 3999.00, '2024-10-14 18:02:00+00');

-- ----------------------------------------------------------------------------
-- 7. Insert Reviews
-- ----------------------------------------------------------------------------
INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Superb sound quality and battery life is awesome!', '2024-06-15 10:00:00+00'),
(1, 4, 4, 'Great noise cancellation, comfortable for long calls.', '2024-07-10 15:30:00+00'),
(3, 1, 5, 'Charges my phone really fast, solidly built.', '2024-06-18 12:00:00+00'),
(3, 2, 4, 'Very handy for travel, little bit heavy though.', '2024-06-25 09:00:00+00'),
(15, 3, 5, 'Must read for every backend and data engineer! Excellent.', '2024-07-01 11:00:00+00'),
(16, 3, 4, 'Classic programming book with timeless principles.', '2024-07-02 18:00:00+00'),
(11, 1, 4, 'Good power, grinds tough spices quickly.', '2024-07-28 14:00:00+00'),
(18, 5, 5, 'Good grip and cushion, does not slip on tiles.', '2024-08-01 10:30:00+00'),
(6, 2, 3, 'Fitting is good but color is slightly lighter than photo.', '2024-08-15 16:00:00+00'),
(7, 2, 5, 'Super comfortable stretch denim, fits perfectly!', '2024-08-16 11:00:00+00'),
(5, 7, 5, 'Crisp video quality for meetings and recordings.', '2024-08-20 17:00:00+00'),
(19, 4, 5, 'Solid weights for home gym, totally worth the price.', '2024-09-10 19:00:00+00'),
(14, 4, 5, 'Life-changing book, easy practical takeaways.', '2024-07-15 13:00:00+00'),
(9, 6, 4, 'Stylish look and good polarization in bright sun.', '2024-09-15 12:00:00+00');
