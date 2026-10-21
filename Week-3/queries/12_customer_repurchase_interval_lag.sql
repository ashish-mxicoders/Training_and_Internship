-- ============================================================================
-- Query 12: Customer Repurchase Interval Analysis (LAG Window Function)
-- Concept: Advanced Window Function (LAG() OVER (PARTITION BY ... ORDER BY ...)), Interval Math
-- Business Question: How many days pass between consecutive orders for returning customers?
-- ============================================================================

-- Explanation:
-- LAG() window function previous order ki order_date fetch karta hai same customer ke liye.
-- Isse consecutive orders ke beech ka time difference (days gap) nikaal sakte hain.
-- Ye customer retention aur repurchase cycle samajhne ke liye bahut useful analytical query hai.
WITH OrderSequences AS (
    SELECT 
        u.user_id,
        u.full_name,
        o.order_id,
        o.order_date,
        o.total_amount,
        LAG(o.order_date) OVER (
            PARTITION BY u.user_id 
            ORDER BY o.order_date ASC
        ) AS previous_order_date
    FROM users u
    INNER JOIN orders o ON u.user_id = o.user_id
    WHERE o.status != 'CANCELLED'
)
SELECT 
    user_id,
    full_name,
    order_id,
    DATE(previous_order_date) AS prev_order_date,
    DATE(order_date) AS current_order_date,
    total_amount,
    EXTRACT(DAY FROM (order_date - previous_order_date)) AS days_since_last_order
FROM OrderSequences
WHERE previous_order_date IS NOT NULL
ORDER BY days_since_last_order ASC;
