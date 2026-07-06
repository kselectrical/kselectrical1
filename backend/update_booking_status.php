<?php
// update_booking_status.php - Update status of booking (BK-) or invoice (KS-)
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

if (!isset($connect) || !$connect) {
    echo json_encode(['status' => 'error', 'message' => 'No database connection.']);
    exit;
}

// Support both URL-encoded and JSON POST payloads
$id = '';
$status = '';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if ($data) {
    $id = isset($data['id']) ? trim($data['id']) : '';
    $status = isset($data['status']) ? trim($data['status']) : '';
} else {
    $id = isset($_POST['id']) ? trim($_POST['id']) : '';
    $status = isset($_POST['status']) ? trim($_POST['status']) : '';
}

if (empty($id) || empty($status)) {
    echo json_encode(['status' => 'error', 'message' => 'ID and Status are required fields.']);
    exit;
}

$success = false;
$msg = '';

if (strpos($id, 'BK-') === 0) {
    // 1. It is a Booking
    $db_id = intval(substr($id, 3));
    
    // Validate status values
    if (!in_array($status, ['Pending', 'Completed', 'Cancelled'])) {
        $status = 'Pending';
    }
    
    $stmt = $connect->prepare("UPDATE `bookings` SET `status` = ? WHERE `id` = ?");
    if ($stmt) {
        $stmt->bind_param("si", $status, $db_id);
        if ($stmt->execute()) {
            $success = true;
            $msg = "Booking status updated to $status.";
        } else {
            $msg = "Execute failed: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $msg = "Prepare failed: " . $connect->error;
    }
} elseif (strpos($id, 'KS-') === 0) {
    // 2. It is an Invoice
    $db_id = intval(substr($id, 3));
    
    // Map status
    $payment_status = 'Paid';
    $received_query = "`received` = `grand_total`, `balance` = 0.00";
    
    if ($status === 'Pending') {
        $payment_status = 'Unpaid';
        $received_query = "`received` = 0.00, `balance` = `grand_total`";
    } elseif ($status === 'Cancelled') {
        $payment_status = 'Cancelled';
        $received_query = "`received` = 0.00, `balance` = 0.00";
    }
    
    $sql = "UPDATE `invoices` SET `payment_status` = ?, $received_query WHERE `id` = ?";
    $stmt = $connect->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("si", $payment_status, $db_id);
        if ($stmt->execute()) {
            $success = true;
            $msg = "Invoice status updated to $status ($payment_status).";
        } else {
            $msg = "Execute failed: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $msg = "Prepare failed: " . $connect->error;
    }
} else {
    $msg = "Invalid ID prefix (must start with BK- or KS-).";
}

if ($success) {
    echo json_encode(['status' => 'success', 'message' => $msg]);
} else {
    echo json_encode(['status' => 'error', 'message' => $msg]);
}
?>
