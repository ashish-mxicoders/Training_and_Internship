-- ============================================================================
-- Query 09: Product Rating vs Sales Performance Correlation
-- Concept: Multiple CTEs, Outer Joins, COALESCE, Statistical Aggregation
-- Business Question: Do highly-rated products (4+ stars) generate more sales?
-- ============================================================================

-- Explanation:
-- CTE 1 me reviews table se average rating aur review count calculate karte hain.
-- CTE 2 me order_items table se total quantity sold aur total revenue nikaalte hain.
-- Dono CTEs ko products table ke sath join karte hain (COALESCE use karke 0 set karte hain agar review/order na ho).
WITH ReviewStats AS (
    SELECT 
        product_id,
        ROUND(AVG(rating), 1) AS avg_rating,
        COUNT(review_id) AS total_reviews
    FROM reviews
    GROUP BY product_id
),
SalesStats AS (
    SELECT 
        oi.product_id,
        SUM(oi.quantity) AS units_sold,
        ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_sales
    FROM order_items oi
    INNER JOIN orders o ON oi.order_id = o.order_id
    WHERE o.status != 'CANCELLED'
    GROUP BY oi.product_id
)
SELECT 
    p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    COALESCE(rs.avg_rating, 0.0) AS average_rating,
    COALESCE(rs.total_reviews, 0) AS review_count,
    COALESCE(ss.units_sold, 0) AS total_units_sold,
    COALESCE(ss.gross_sales, 0.00) AS total_revenue
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id
LEFT JOIN ReviewStats rs ON p.product_id = rs.product_id
LEFT JOIN SalesStats ss ON p.product_id = ss.product_id
ORDER BY total_units_sold DESC, average_rating DESC;
