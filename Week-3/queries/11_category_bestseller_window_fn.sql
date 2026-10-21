-- ============================================================================
-- Query 11: Top Bestselling Product In Each Category (Window Function)
-- Concept: Window Functions (ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)), CTE
-- Business Question: What is the single highest-selling product in each category?
-- ============================================================================

-- Explanation:
-- CTE me har category ke har product ka total units sold aur revenue calculate karte hain.
-- ROW_NUMBER() window function se category-wise sales rank assign karte hain.
-- Outer query me sirf rank = 1 (top product) filter karte hain.
WITH RankedProducts AS (
    SELECT 
        c.name AS category_name,
        p.product_id,
        p.name AS product_name,
        p.price,
        COALESCE(SUM(oi.quantity), 0) AS units_sold,
        COALESCE(ROUND(SUM(oi.quantity * oi.unit_price), 2), 0.00) AS total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY c.category_id 
            ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, COALESCE(SUM(oi.quantity * oi.unit_price), 0) DESC
        ) AS sales_rank
    FROM categories c
    INNER JOIN products p ON c.category_id = p.category_id
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id AND o.status != 'CANCELLED'
    GROUP BY c.category_id, c.name, p.product_id, p.name, p.price
)
SELECT 
    category_name,
    product_name,
    price,
    units_sold,
    total_revenue
FROM RankedProducts
WHERE sales_rank = 1
ORDER BY total_revenue DESC;
