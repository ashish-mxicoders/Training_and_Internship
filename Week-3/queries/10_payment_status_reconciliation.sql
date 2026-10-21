-- ============================================================================
-- Query 10: Payment Method & Financial Reconciliation Report
-- Concept: Conditional Aggregation (SUM/COUNT with CASE WHEN)
-- Business Question: What is the success vs failure rate and revenue collected by payment method?
-- ============================================================================

-- Explanation:
-- Payments table me har payment method ka performance check karte hain:
-- Kitne payments SUCCESS hue, kitne PENDING hain, aur kitne FAILED.
-- CASE WHEN se bina alag-alag queries run kiye single row me matrix banta hai.
SELECT 
    payment_method,
    COUNT(payment_id) AS total_transactions,
    COUNT(CASE WHEN payment_status = 'SUCCESS' THEN 1 END) AS successful_count,
    COUNT(CASE WHEN payment_status = 'PENDING' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN payment_status = 'FAILED' THEN 1 END) AS failed_count,
    ROUND(SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END), 2) AS collected_revenue,
    ROUND(SUM(CASE WHEN payment_status != 'SUCCESS' THEN amount ELSE 0 END), 2) AS uncollected_amount
FROM payments
GROUP BY payment_method
ORDER BY collected_revenue DESC;
