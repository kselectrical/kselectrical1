<?php
// manage_config.php - Read/write company branding configuration to branding.json
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

$file = __DIR__ . '/branding.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    if ($data) {
        if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT))) {
            echo json_encode(['status' => 'success', 'message' => 'Branding config saved.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to write config file.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input.']);
    }
    exit;
}

// GET method
if (file_exists($file)) {
    $content = file_get_contents($file);
    echo $content;
} else {
    echo json_encode(['status' => 'not_found', 'message' => 'No config saved yet.']);
}
?>
