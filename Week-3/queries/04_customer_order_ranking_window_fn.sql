-- ============================================================================
-- Query 04: Customer Order Sequence Ranking (Window Function)
-- Concept: Window Functions (DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...))
-- Business Question: Rank each customer's orders chronologically (Order #1, Order #2, etc.)
-- ============================================================================

-- Explanation:
-- Window function PARTITION BY user_id se grouping hoti hai without collapsing rows.
-- DENSE_RANK() se customer ke orders 1st order, 2nd order ke roop me rank ho jaate hain.
SELECT 
    u.user_id,
    u.full_name,
    o.order_id,
    o.order_date,
    o.total_amount,
    DENSE_RANK() OVER (
        PARTITION BY u.user_id 
        ORDER BY o.order_date ASC
    ) AS customer_order_sequence
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
WHERE o.status != 'CANCELLED'
ORDER BY u.user_id, customer_order_sequence;
