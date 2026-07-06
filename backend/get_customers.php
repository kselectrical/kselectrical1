<?php
// get_customers.php - Aggregate and fetch customer directory with history
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

$customers = [];
$query_combined = "
    SELECT comb.phone, 
           COALESCE(c.name, comb.name) AS name, 
           COALESCE(c.email, '') AS email, 
           COALESCE(c.created_at, comb.min_created) AS created_at
    FROM (
        SELECT phone, MAX(name) AS name, MIN(created_at) AS min_created
        FROM (
            SELECT phone, name, created_at FROM customers
            UNION
            SELECT phone, customer_name AS name, created_at FROM bookings
            UNION
            SELECT customer_phone AS phone, customer_name AS name, created_at FROM invoices
        ) AS u
        WHERE phone IS NOT NULL AND phone != ''
        GROUP BY phone
    ) AS comb
    LEFT JOIN customers c ON c.phone = comb.phone
    ORDER BY name ASC
";
$res_customers = $connect->query($query_combined);

if ($res_customers) {
    while ($cust = $res_customers->fetch_assoc()) {
        $phone = $cust['phone'];
        $email = $cust['email'];
        $name = $cust['name'];
        $joinedAt = date('c', strtotime($cust['created_at']));
        
        $history = [];
        $latest_address = 'Address not specified';
        $latest_date_ts = 0;
        
        // 1. Fetch Bookings for this customer
        $stmt_bk = $connect->prepare("SELECT * FROM `bookings` WHERE `phone` = ? OR `alternate_phone` = ? ORDER BY `created_at` DESC");
        if ($stmt_bk) {
            $stmt_bk->bind_param("ss", $phone, $phone);
            $stmt_bk->execute();
            $res_bk = $stmt_bk->get_result();
            while ($bk = $res_bk->fetch_assoc()) {
                $bk_date = date('c', strtotime($bk['created_at']));
                $bk_ts = strtotime($bk['created_at']);
                
                if ($bk_ts > $latest_date_ts) {
                    $latest_address = $bk['address'] . ' (' . $bk['area'] . ')';
                    $latest_date_ts = $bk_ts;
                }
                
                $history[] = [
                    'serviceId' => 'BK-' . $bk['id'],
                    'serviceName' => $bk['service_type'],
                    'date' => $bk_date,
                    'price' => floatval($bk['subtotal'])
                ];
            }
            $stmt_bk->close();
        }
        
        // 2. Fetch Invoices for this customer
        $stmt_inv = $connect->prepare("SELECT i.*, (SELECT GROUP_CONCAT(description SEPARATOR ', ') FROM invoice_items WHERE invoice_id = i.id) as items_summary FROM `invoices` i WHERE i.customer_phone = ? ORDER BY i.created_at DESC");
        if ($stmt_inv) {
            $stmt_inv->bind_param("s", $phone);
            $stmt_inv->execute();
            $res_inv = $stmt_inv->get_result();
            while ($inv = $res_inv->fetch_assoc()) {
                $inv_date = date('c', strtotime($inv['created_at']));
                $inv_ts = strtotime($inv['created_at']);
                
                if ($inv_ts > $latest_date_ts) {
                    // Reconstruct address: strip the Location details prefix from invoices
                    $clean_addr = trim(preg_replace('/\(Location:\s*.*?\)/', '', $inv['customer_address']));
                    $latest_address = $clean_addr;
                    $latest_date_ts = $inv_ts;
                }
                
                $history[] = [
                    'serviceId' => 'KS-' . $inv['id'],
                    'serviceName' => $inv['items_summary'] ? $inv['items_summary'] : 'Manual Invoice Services',
                    'date' => $inv_date,
                    'price' => floatval($inv['grand_total'])
                ];
            }
            $stmt_inv->close();
        }
        
        // Sort consolidated history newest first
        usort($history, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        $totalBookings = count($history);
        $lastBookingDate = ($totalBookings > 0) ? $history[0]['date'] : $joinedAt;
        
        $customers[] = [
            'name' => $name,
            'phone' => $phone,
            'email' => $email ? $email : null,
            'photoUrl' => null,
            'address' => $latest_address,
            'serviceHistory' => $history,
            'lastBookingDate' => $lastBookingDate,
            'totalBookings' => $totalBookings,
            'joinedAt' => $joinedAt
        ];
    }
}

echo json_encode($customers, JSON_PRETTY_PRINT);
?>
