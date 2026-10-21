-- ============================================================================
-- Query 02: Top Spending Customers (Customer Lifetime Value - CLV)
-- Concept: Multi-table JOIN, Aggregations (SUM, COUNT), ORDER BY, LIMIT
-- Business Question: Who are the top 5 most valuable customers by total spend?
-- ============================================================================

-- Explanation:
-- Users table ko Orders table se join karke har customer ka total spent amount
-- aur unke total completed orders count nikaal rahe hain.
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    u.city,
    COUNT(o.order_id) AS total_orders_placed,
    ROUND(SUM(o.total_amount), 2) AS total_spent_amount
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
WHERE o.status != 'CANCELLED'
GROUP BY u.user_id, u.full_name, u.email, u.city
ORDER BY total_spent_amount DESC
LIMIT 5;
