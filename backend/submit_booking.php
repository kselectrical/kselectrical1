<?php
// submit_booking.php - Safe Database Handler for Customer Bookings
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
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$alternate_phone = isset($_POST['alternate_phone']) ? trim(strip_tags($_POST['alternate_phone'])) : '';
$service_type = isset($_POST['service_type']) ? trim(strip_tags($_POST['service_type'])) : '';
if (strlen($service_type) > 250) {
    $service_type = substr($service_type, 0, 247) . '...';
}
$address = isset($_POST['address']) ? trim(strip_tags($_POST['address'])) : '';
$area = isset($_POST['area']) ? trim(strip_tags($_POST['area'])) : '';
$preferred_date = isset($_POST['preferred_date']) ? trim(strip_tags($_POST['preferred_date'])) : '';
$preferred_time = isset($_POST['preferred_time']) ? trim(strip_tags($_POST['preferred_time'])) : '';
$subtotal = isset($_POST['subtotal']) ? floatval($_POST['subtotal']) : 0.00;
$items_json = isset($_POST['items_json']) ? trim($_POST['items_json']) : null;

// 2. Field Validations & Sensible Defaults
if (empty($address)) {
    $address = 'Contact Customer (पता संपर्क करें)';
}
if (empty($area)) {
    $area = 'Noida Extension';
}
if (empty($preferred_date)) {
    $preferred_date = date('Y-m-d');
}
if (empty($preferred_time)) {
    $preferred_time = 'Anytime (किसी भी समय)';
}

if (empty($customer_name) || empty($phone) || empty($service_type) || empty($address) || empty($area) || empty($preferred_date) || empty($preferred_time)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields (सभी आवश्यक फ़ील्ड भरें)।']);
    exit;
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid 10-digit phone number (10-अंकीय मोबाइल नंबर दर्ज करें)।']);
    exit;
}

if (!empty($alternate_phone) && !preg_match('/^[0-9]{10}$/', $alternate_phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Alternate phone must be a 10-digit number.']);
    exit;
}

// Ensure database connection is active
if (!isset($connect) || !$connect) {
    echo json_encode(['status' => 'error', 'message' => 'Database server offline. Please configure db_connect.php.']);
    exit;
}

// 3. Securely Insert Booking (Prepared Statements)
$stmt = $connect->prepare("INSERT INTO `bookings` (`customer_name`, `phone`, `alternate_phone`, `service_type`, `address`, `area`, `preferred_date`, `preferred_time`, `status`, `subtotal`, `items_json`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)");

if ($stmt) {
    $stmt->bind_param("ssssssssds", $customer_name, $phone, $alternate_phone, $service_type, $address, $area, $preferred_date, $preferred_time, $subtotal, $items_json);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => '<strong>Booking Confirmed!</strong> Your request has been saved. Lead technician will call you shortly on +91 ' . htmlspecialchars($phone) . ' (बुकिंग सफल! ऑपरेटर आपको जल्द ही संपर्क करेगा)।'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save booking. DB Error: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Statement preparation failed: ' . $connect->error]);
}
?>
