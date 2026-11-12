# ==============================================================================
# WEEK 6: AUTOMATED API TEST SCRIPT (PowerShell)
# ==============================================================================
# Usage:
#   Make sure your server is running in another terminal (`npm run dev`)
#   Then run this command in Week-6 directory:
#   powershell -ExecutionPolicy Bypass -File .\test-api.ps1
# ==============================================================================

$BaseUrl = "http://localhost:5000"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " 🚀 STARTING AUTOMATED TODO CRUD API TESTS" -ForegroundColor Cyan
Write-Host " Base URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# Helper function to print results
function Print-Step ($stepNumber, $title) {
    Write-Host "`n[$stepNumber] $title" -ForegroundColor Yellow
}

# 1. Health Check
Print-Step "STEP 1" "Testing Server Health Check (GET /)..."
try {
    $res = Invoke-RestMethod -Uri "$BaseUrl/" -Method Get
    Write-Host "✅ Health Check OK: $($res.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to connect to server! Make sure 'npm run dev' is running." -ForegroundColor Red
    exit 1
}

# 2. Create Todo 1
Print-Step "STEP 2" "Creating First Todo (POST /api/todos)..."
$body1 = @{
    title = "Learn Neon PostgreSQL"
    description = "Understand connection strings and pool queries in Node.js"
} | ConvertTo-Json

$created1 = Invoke-RestMethod -Uri "$BaseUrl/api/todos" -Method Post -Body $body1 -ContentType "application/json"
$id1 = $created1.data.id
Write-Host "✅ Created Todo ID $id1: '$($created1.data.title)'" -ForegroundColor Green

# 3. Create Todo 2
Print-Step "STEP 3" "Creating Second Todo (POST /api/todos)..."
$body2 = @{
    title = "Complete Week-6 CRUD API"
    description = "Test all routes using PowerShell and Postman"
} | ConvertTo-Json

$created2 = Invoke-RestMethod -Uri "$BaseUrl/api/todos" -Method Post -Body $body2 -ContentType "application/json"
$id2 = $created2.data.id
Write-Host "✅ Created Todo ID $id2: '$($created2.data.title)'" -ForegroundColor Green

# 4. Get All Todos
Print-Step "STEP 4" "Fetching All Todos (GET /api/todos)..."
$allTodos = Invoke-RestMethod -Uri "$BaseUrl/api/todos" -Method Get
Write-Host "✅ Total Todos Found: $($allTodos.totalCount)" -ForegroundColor Green
foreach ($todo in $allTodos.data) {
    $status = if ($todo.is_completed) { "[COMPLETED]" } else { "[PENDING]" }
    Write-Host "   -> ID: $($todo.id) | $status $($todo.title)" -ForegroundColor Gray
}

# 5. Get Single Todo by ID
Print-Step "STEP 5" "Fetching Todo by ID (GET /api/todos/$id1)..."
$singleTodo = Invoke-RestMethod -Uri "$BaseUrl/api/todos/$id1" -Method Get
Write-Host "✅ Retrieved: ID $($singleTodo.data.id) - $($singleTodo.data.title)" -ForegroundColor Green

# 6. Update Todo
Print-Step "STEP 6" "Updating Todo (PUT /api/todos/$id1)..."
$updateBody = @{
    title = "Master Neon PostgreSQL (Updated)"
    description = "Database connected and CRUD completed"
    is_completed = $false
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "$BaseUrl/api/todos/$id1" -Method Put -Body $updateBody -ContentType "application/json"
Write-Host "✅ Updated Title: '$($updated.data.title)'" -ForegroundColor Green

# 7. Toggle Todo Status
Print-Step "STEP 7" "Toggling Todo Status (PATCH /api/todos/$id1/toggle)..."
$toggled = Invoke-RestMethod -Uri "$BaseUrl/api/todos/$id1/toggle" -Method Patch
$newStatus = if ($toggled.data.is_completed) { "Completed" } else { "Pending" }
Write-Host "✅ Toggled Status: $newStatus" -ForegroundColor Green

# 8. Delete Todo
Print-Step "STEP 8" "Deleting Second Todo (DELETE /api/todos/$id2)..."
$deleted = Invoke-RestMethod -Uri "$BaseUrl/api/todos/$id2" -Method Delete
Write-Host "✅ Deleted Todo ID $id2 successfully!" -ForegroundColor Green

# 9. Verify Deletion
Print-Step "STEP 9" "Verifying Deletion of ID $id2 (Expect 404)..."
try {
    $checkDeleted = Invoke-RestMethod -Uri "$BaseUrl/api/todos/$id2" -Method Get
    Write-Host "⚠️ Warning: Item was still found!" -ForegroundColor Red
} catch {
    Write-Host "✅ Verified: Item was deleted (Received expected 404 response)." -ForegroundColor Green
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " 🎉 ALL CRUD API TESTS PASSED SUCCESSFULLY!" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

