-- ============================================================================
-- Query 05: Cumulative Running Total of Daily Revenue (Window Function)
-- Concept: CTE, Window Aggregate SUM(...) OVER (ORDER BY ... ROWS BETWEEN ...)
-- Business Question: What is the cumulative running total of revenue over time?
-- ============================================================================

-- Explanation:
-- Pehle CTE me har date ka daily revenue calculate karte hain.
-- Fir window function SUM() OVER(...) se continuous running total banate hain.
WITH DailyRevenue AS (
    SELECT 
        DATE(order_date) AS sale_date,
        COUNT(order_id) AS orders_count,
        ROUND(SUM(total_amount), 2) AS daily_total
    FROM orders
    WHERE status != 'CANCELLED'
    GROUP BY DATE(order_date)
)
SELECT 
    sale_date,
    orders_count,
    daily_total,
    ROUND(SUM(daily_total) OVER (
        ORDER BY sale_date ASC
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ), 2) AS cumulative_running_total
FROM DailyRevenue
ORDER BY sale_date ASC;
