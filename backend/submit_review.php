<?php
// submit_review.php - Safe Database Handler for Customer Reviews
header('Content-Type: application/json');

// Enable CORS for cross-domain React app submissions
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: https://www.kselectrical.in");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Request Method.']);
    exit;
}

// 1. Gather and Sanitize Input
$customer_name = isset($_POST['customer_name']) ? trim(strip_tags($_POST['customer_name'])) : '';
$rating = isset($_POST['rating']) ? intval($_POST['rating']) : 0;
$review_text = isset($_POST['review_text']) ? trim(strip_tags($_POST['review_text'])) : '';
$service_used = isset($_POST['service_used']) ? trim(strip_tags($_POST['service_used'])) : '';

// 2. Field Validations
if (empty($customer_name) || empty($review_text) || empty($service_used)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields (सभी फ़ील्ड भरें)।']);
    exit;
}

if ($rating < 1 || $rating > 5) {
    echo json_encode(['status' => 'error', 'message' => 'Please select a valid rating between 1 and 5 stars.']);
    exit;
}

// Ensure database connection is active
if (!isset($connect) || !$connect) {
    echo json_encode(['status' => 'error', 'message' => 'Database server offline. Please configure db_connect.php.']);
    exit;
}

// 3. Securely Insert Review (Prepared Statements)
// We default reviews to 'Approved' so they show up on the website instantly, or 'Pending' if moderated.
$status = 'Approved'; 

$stmt = $connect->prepare("INSERT INTO `reviews` (`customer_name`, `rating`, `review_text`, `service_used`, `status`) VALUES (?, ?, ?, ?, ?)");

if ($stmt) {
    $stmt->bind_param("sisss", $customer_name, $rating, $review_text, $service_used, $status);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => '<strong>Thank you!</strong> Your review has been submitted and published successfully (समीक्षा सफलतापूर्वक प्रकाशित की गई है)।'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save review. DB Error: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Statement preparation failed: ' . $connect->error]);
}
?>
