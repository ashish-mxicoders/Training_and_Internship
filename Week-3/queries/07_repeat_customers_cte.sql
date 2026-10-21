-- ============================================================================
-- Query 07: Repeat Customers Analysis (CTE & Filtered Aggregation)
-- Concept: Common Table Expressions (WITH clause), HAVING filter, Multi-table JOIN
-- Business Question: Who are our repeat buyers (ordered > 1 time) and what is their average spend?
-- ============================================================================

-- Explanation:
-- CTE use karke pehle orders table se repeat buyers identify karte hain (COUNT > 1).
-- Fir user details ke sath join karke clean summary report banate hain.
WITH RepeatBuyerStats AS (
    SELECT 
        user_id,
        COUNT(order_id) AS total_orders,
        SUM(total_amount) AS total_spend,
        AVG(total_amount) AS avg_order_spend
    FROM orders
    WHERE status != 'CANCELLED'
    GROUP BY user_id
    HAVING COUNT(order_id) > 1
)
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    u.city,
    rbs.total_orders,
    ROUND(rbs.total_spend, 2) AS lifetime_value,
    ROUND(rbs.avg_order_spend, 2) AS average_basket_size
FROM RepeatBuyerStats rbs
INNER JOIN users u ON rbs.user_id = u.user_id
ORDER BY rbs.total_orders DESC, rbs.total_spend DESC;
