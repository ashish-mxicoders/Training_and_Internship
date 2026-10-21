-- ============================================================================
-- Query 01: Total Revenue and Units Sold per Category
-- Concept: Multi-table INNER JOIN, GROUP BY, Aggregate functions (SUM)
-- Business Question: Which product category drives the highest revenue?
-- ============================================================================

-- Explanation:
-- Ham categories, products, aur order_items tables ko join kar rahe hain.
-- Sirf un orders ko consider kar rahe hain jo cancel nahi hue hain.
SELECT 
    c.category_id,
    c.name AS category_name,
    COUNT(DISTINCT p.product_id) AS total_products_in_catalog,
    SUM(oi.quantity) AS total_units_sold,
    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue
FROM categories c
INNER JOIN products p ON c.category_id = p.category_id
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.status != 'CANCELLED'
GROUP BY c.category_id, c.name
ORDER BY total_revenue DESC;
