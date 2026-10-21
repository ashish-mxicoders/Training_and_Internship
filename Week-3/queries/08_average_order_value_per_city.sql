-- ============================================================================
-- Query 08: Geographic Performance Analysis (City-level AOV & Volume)
-- Concept: GROUP BY, Aggregations (COUNT, SUM, AVG, ROUND), HAVING
-- Business Question: What is the Average Order Value (AOV) and revenue per city?
-- ============================================================================

-- Explanation:
-- Shipping city ke hisaab se orders ko aggregate karke delivery geography analyse karte hain.
-- Isse pata chalta hai ki kis city se high-value orders aa rahe hain.
SELECT 
    shipping_city,
    COUNT(order_id) AS total_orders,
    ROUND(SUM(total_amount), 2) AS total_city_revenue,
    ROUND(AVG(total_amount), 2) AS average_order_value,
    ROUND(MIN(total_amount), 2) AS min_order_amount,
    ROUND(MAX(total_amount), 2) AS max_order_amount
FROM orders
WHERE status != 'CANCELLED'
GROUP BY shipping_city
HAVING COUNT(order_id) >= 1
ORDER BY total_city_revenue DESC;
