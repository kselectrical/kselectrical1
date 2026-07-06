<?php
// submit_invoice.php - Save manual invoice from React admin
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

if (!isset($connect) || !$connect) {
    echo json_encode(['status' => 'error', 'message' => 'No database connection.']);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input.']);
    exit;
}

// 1. Map fields
$customer_name = isset($data['customerName']) ? trim(strip_tags($data['customerName'])) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$address = isset($data['address']) ? trim(strip_tags($data['address'])) : '';
$location = isset($data['selectedLocation']) ? trim(strip_tags($data['selectedLocation'])) : '';
$created_at_raw = isset($data['createdAt']) ? $data['createdAt'] : '';
$subtotal_inclusive = isset($data['subtotal']) ? floatval($data['subtotal']) : 0.00;
$status = isset($data['status']) ? $data['status'] : 'Completed';
$items = isset($data['items']) ? $data['items'] : [];

if (empty($customer_name) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Customer name and phone are required.']);
    exit;
}

// Full address includes location prefix if available
$full_address = $address;
if (!empty($location) && strpos($address, $location) === false) {
    $full_address .= " (Location: " . $location . ")";
}

// Parse invoice date
$invoice_date = date('Y-m-d');
if (!empty($created_at_raw)) {
    $timestamp = strtotime($created_at_raw);
    if ($timestamp !== false) {
        $invoice_date = date('Y-m-d', $timestamp);
    }
}

// GST calculations (React subtotal is grand total inclusive of 18% GST)
$grand_total = $subtotal_inclusive;
$sub_total = round($grand_total / 1.18, 2);
$gst_amount = round($grand_total - $sub_total, 2);
$gst_rate = 18.00;
$discount = 0.00;

// Payments mapping
if ($status === 'Completed') {
    $received = $grand_total;
    $balance = 0.00;
    $payment_status = 'Paid';
} elseif ($status === 'Cancelled') {
    $received = 0.00;
    $balance = 0.00;
    $payment_status = 'Cancelled';
} else {
    $received = 0.00;
    $balance = $grand_total;
    $payment_status = 'Unpaid';
}
$payment_method = 'Cash';

// Start transaction for integrity
$connect->begin_transaction();

try {
    // 2. Insert into invoices
    $stmt = $connect->prepare("INSERT INTO `invoices` (`customer_name`, `customer_phone`, `customer_address`, `invoice_date`, `sub_total`, `gst_rate`, `gst_amount`, `discount`, `grand_total`, `received`, `balance`, `payment_status`, `payment_method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception("Invoices statement prepare failed: " . $connect->error);
    }
    
    $stmt->bind_param("ssssdddddddss", $customer_name, $phone, $full_address, $invoice_date, $sub_total, $gst_rate, $gst_amount, $discount, $grand_total, $received, $balance, $payment_status, $payment_method);
    
    if (!$stmt->execute()) {
        throw new Exception("Invoices execute failed: " . $stmt->error);
    }
    
    $invoice_id = $connect->insert_id;
    $stmt->close();
    
    // 3. Insert items
    if (!empty($items)) {
        $stmt_item = $connect->prepare("INSERT INTO `invoice_items` (`invoice_id`, `description`, `hsn_sac`, `quantity`, `rate`, `total`) VALUES (?, ?, '', ?, ?, ?)");
        
        if (!$stmt_item) {
            throw new Exception("Invoice items statement prepare failed: " . $connect->error);
        }
        
        foreach ($items as $item) {
            $desc = isset($item['serviceName']) ? trim(strip_tags($item['serviceName'])) : '';
            if (isset($item['brand']) && !empty($item['brand'])) {
                $desc .= " [" . trim(strip_tags($item['brand'])) . "]";
            }
            $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;
            $rate_inclusive = isset($item['price']) ? floatval($item['price']) : 0.00;
            
            // Base rate before 18% GST
            $rate = round($rate_inclusive / 1.18, 2);
            $total = round($rate * $quantity, 2);
            
            $stmt_item->bind_param("isidd", $invoice_id, $desc, $quantity, $rate, $total);
            if (!$stmt_item->execute()) {
                throw new Exception("Invoice item execute failed: " . $stmt_item->error);
            }
        }
        $stmt_item->close();
    }
    
    // 4. Upsert Customer Record
    $stmt_cust = $connect->prepare("INSERT INTO `customers` (`name`, `phone`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`)");
    if ($stmt_cust) {
        $stmt_cust->bind_param("ss", $customer_name, $phone);
        $stmt_cust->execute();
        $stmt_cust->close();
    }
    
    $connect->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Invoice created successfully.',
        'invoice_id' => 'KS-' . $invoice_id,
        'db_id' => $invoice_id
    ]);
    
} catch (Exception $e) {
    $connect->rollback();
    echo json_encode([
        'status' => 'error',
        'message' => 'Transaction failed: ' . $e->getMessage()
    ]);
}
?>
