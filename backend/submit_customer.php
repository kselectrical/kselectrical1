<?php
// submit_customer.php - Safe database handler for customer registration
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
$name = isset($_POST['customer_name']) ? trim(strip_tags($_POST['customer_name'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';

// 2. Field Validations
if (empty($name) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Name and Phone fields are required.']);
    exit;
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid 10-digit phone number.']);
    exit;
}

// Ensure database connection is active
if (!isset($connect) || !$connect) {
    echo json_encode(['status' => 'error', 'message' => 'Database server offline.']);
    exit;
}

// Ensure customers table exists (fail-safe)
$connect->query("CREATE TABLE IF NOT EXISTS `customers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL UNIQUE,
    `email` VARCHAR(255) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

// 3. Securely Insert or Update Customer (ON DUPLICATE KEY UPDATE)
$stmt = $connect->prepare("INSERT INTO `customers` (`name`, `phone`, `email`) VALUES (?, ?, '') ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `email` = ''");

if ($stmt) {
    $stmt->bind_param("ss", $name, $phone);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Customer profile synchronized successfully on the server.'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save customer: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Statement preparation failed: ' . $connect->error]);
}
?>
