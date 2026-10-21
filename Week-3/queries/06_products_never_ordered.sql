-- ============================================================================
-- Query 06: Products With Zero Sales (Unsold / Dead Stock Inventory)
-- Concept: LEFT JOIN anti-pattern (WHERE ... IS NULL) / Outer Joins
-- Business Question: Which products in the catalog have never been purchased?
-- ============================================================================

-- Explanation:
-- Products table ko order_items table se LEFT JOIN karte hain.
-- Agar order_items ka foreign key NULL aata hai, iska matlab kisi ne ye product kabhi order nahi kiya.
SELECT 
    p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    p.price,
    p.stock_quantity AS current_stock
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.product_id IS NULL
ORDER BY p.price DESC;
