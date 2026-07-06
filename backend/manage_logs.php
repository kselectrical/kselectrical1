<?php
// manage_logs.php - Save/load audit logs, price history, and admin logs
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$type = isset($_GET['type']) ? $_GET['type'] : '';

if (!in_array($type, ['audit', 'price', 'admin'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid log type. Use type=audit, price, or admin.']);
    exit;
}

$file = __DIR__ . '/' . $type . '_logs.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $new_log = json_decode($input, true);
    
    if ($new_log) {
        $logs = [];
        if (file_exists($file)) {
            $logs = json_decode(file_get_contents($file), true);
            if (!is_array($logs)) {
                $logs = [];
            }
        }
        
        // Prepend the new log entry
        array_unshift($logs, $new_log);
        
        // Cap the log size at 500 entries to prevent infinite growth
        if (count($logs) > 500) {
            $logs = array_slice($logs, 0, 500);
        }
        
        if (file_put_contents($file, json_encode($logs, JSON_PRETTY_PRINT))) {
            echo json_encode(['status' => 'success', 'message' => 'Log entry appended.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to write log file.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input.']);
    }
    exit;
}

// GET method
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo json_encode([]);
}
?>
