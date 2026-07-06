<?php
// get_invoices.php - Fetch invoices and items for React admin billbook
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

$sql_invoices = "SELECT * FROM `invoices` ORDER BY `id` DESC";
$res_invoices = $connect->query($sql_invoices);

$invoices = [];
if ($res_invoices) {
    while ($invoice = $res_invoices->fetch_assoc()) {
        $invoice_id = $invoice['id'];
        
        // Fetch items
        $sql_items = "SELECT * FROM `invoice_items` WHERE `invoice_id` = $invoice_id";
        $res_items = $connect->query($sql_items);
        $items = [];
        
        if ($res_items) {
            while ($item = $res_items->fetch_assoc()) {
                // Reconstruct brand and description if description matches "Name [Brand]"
                $serviceName = $item['description'];
                $brand = null;
                if (preg_match('/^(.*?)\s*\[(.*?)\]$/', $item['description'], $matches)) {
                    $serviceName = trim($matches[1]);
                    $brand = trim($matches[2]);
                }
                
                // Price must be inclusive of 18% GST (as React expects)
                // Since rate is stored exclusive of GST, we multiply it back by 1.18
                $price_inclusive = round(floatval($item['rate']) * 1.18, 2);
                
                $items[] = [
                    'serviceId' => 'itm-' . $item['id'],
                    'serviceName' => $serviceName,
                    'price' => $price_inclusive,
                    'quantity' => intval($item['quantity']),
                    'brand' => $brand
                ];
            }
        }
        
        // Reconstruct selectedLocation from full address
        $selectedLocation = 'Gaur City 1, Noida Extension, UP';
        $clean_address = $invoice['customer_address'];
        if (preg_match('/\(Location:\s*(.*?)\)/', $invoice['customer_address'], $matches)) {
            $selectedLocation = trim($matches[1]);
            // Remove the location suffix from the displayed address for cleanliness
            $clean_address = trim(preg_replace('/\(Location:\s*.*?\)/', '', $invoice['customer_address']));
        }
        
        // Map payment status
        $status = 'Completed';
        if ($invoice['payment_status'] === 'Unpaid' || $invoice['payment_status'] === 'Pending' || $invoice['payment_status'] === 'Partial') {
            $status = 'Pending';
        } elseif ($invoice['payment_status'] === 'Cancelled') {
            $status = 'Cancelled';
        }
        
        $invoices[] = [
            'id' => 'KS-' . $invoice['id'],
            'customerName' => $invoice['customer_name'],
            'phone' => $invoice['customer_phone'],
            'address' => $clean_address,
            'selectedLocation' => $selectedLocation,
            'dateTime' => $invoice['invoice_date'] . ' 12:00:00',
            'items' => $items,
            'subtotal' => floatval($invoice['grand_total']),
            'status' => $status,
            'createdAt' => date('c', strtotime($invoice['created_at']))
        ];
    }
}

echo json_encode($invoices, JSON_PRETTY_PRINT);
?>
