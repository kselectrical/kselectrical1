<?php
// get_bookings.php - Fetch bookings and return as React compatible JSON
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

if (!isset($connect) || !$connect) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT * FROM `bookings` ORDER BY `id` DESC";
$res = $connect->query($sql);

$bookings = [];
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $items = [];
        if (!empty($row['items_json'])) {
            $items = json_decode($row['items_json'], true);
        }
        
        // Fallback for legacy items or bookings without JSON
        if (empty($items)) {
            $items = [
                [
                    'serviceId' => 'custom',
                    'serviceName' => $row['service_type'],
                    'price' => floatval($row['subtotal']),
                    'quantity' => 1
                ]
            ];
        }

        $bookings[] = [
            'id' => 'BK-' . $row['id'],
            'customerName' => $row['customer_name'],
            'phone' => $row['phone'],
            'address' => $row['address'],
            'selectedLocation' => $row['area'],
            'dateTime' => $row['preferred_date'] . ' ' . $row['preferred_time'],
            'items' => $items,
            'subtotal' => floatval($row['subtotal']),
            'status' => $row['status'],
            'createdAt' => date('c', strtotime($row['created_at']))
        ];
    }
}

echo json_encode($bookings, JSON_PRETTY_PRINT);
?>
