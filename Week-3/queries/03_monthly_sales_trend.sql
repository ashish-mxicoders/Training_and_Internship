-- ============================================================================
-- Query 03: Monthly Sales Trend & Average Order Value (AOV)
-- Concept: Date Truncation (DATE_TRUNC), Aggregations (SUM, COUNT, AVG)
-- Business Question: How is sales volume and average order value trending month-over-month?
-- ============================================================================

-- Explanation:
-- DATE_TRUNC('month', order_date) se orders ko month wise group karte hain.
-- Isse month-by-month total revenue, order count aur average basket size milta hai.
SELECT 
    TO_CHAR(DATE_TRUNC('month', order_date), 'YYYY-MM') AS sales_month,
    COUNT(order_id) AS total_orders,
    ROUND(SUM(total_amount), 2) AS monthly_revenue,
    ROUND(AVG(total_amount), 2) AS average_order_value
FROM orders
WHERE status != 'CANCELLED'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY sales_month ASC;
