<?php
// submit_technician.php - Safe database & image upload handler for technician job applications
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
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$role = isset($_POST['role']) ? trim(strip_tags($_POST['role'])) : '';
$experience = isset($_POST['experience']) ? trim(strip_tags($_POST['experience'])) : '';
$location = isset($_POST['location']) ? trim(strip_tags($_POST['location'])) : '';
$current_employment = isset($_POST['current_employment']) ? trim(strip_tags($_POST['current_employment'])) : '';
$preferred_locations = isset($_POST['preferred_locations']) ? trim(strip_tags($_POST['preferred_locations'])) : '';
$note = isset($_POST['note']) ? trim(strip_tags($_POST['note'])) : '';

// 2. Field Validations
if (empty($name) || empty($phone) || empty($role) || empty($experience) || empty($location)) {
    echo json_encode(['status' => 'error', 'message' => 'Name, Phone, Role, Experience, and Location fields are required.']);
    exit;
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid 10-digit phone number.']);
    exit;
}

// 3. Image Compression & Resize Function (GD Library)
function compressImage($sourcePath, $destinationPath, $quality = 75) {
    $info = getimagesize($sourcePath);
    if ($info === false) return false;

    $mime = $info['mime'];
    
    // Create image resource based on type
    switch ($mime) {
        case 'image/jpeg':
        case 'image/jpg':
            if (!function_exists('imagecreatefromjpeg')) return false;
            $image = @imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            if (!function_exists('imagecreatefrompng')) return false;
            $image = @imagecreatefrompng($sourcePath);
            if ($image) {
                // Convert transparency to white background
                $bg = imagecreatetruecolor(imagesx($image), imagesy($image));
                $white = imagecolorallocate($bg, 255, 255, 255);
                imagefill($bg, 0, 0, $white);
                imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
                imagedestroy($image);
                $image = $bg;
            }
            break;
        case 'image/gif':
            if (!function_exists('imagecreatefromgif')) return false;
            $image = @imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            if (!function_exists('imagecreatefromwebp')) return false;
            $image = @imagecreatefromwebp($sourcePath);
            break;
        default:
            return false;
    }

    if (!$image) return false;

    // Resize image if it exceeds 800px width/height
    $width = imagesx($image);
    $height = imagesy($image);
    $max_size = 800;

    if ($width > $max_size || $height > $max_size) {
        if ($width > $height) {
            $new_width = $max_size;
            $new_height = floor($height * ($max_size / $width));
        } else {
            $new_height = $max_size;
            $new_width = floor($width * ($max_size / $height));
        }
        $resized_image = imagecreatetruecolor($new_width, $new_height);
        if ($resized_image) {
            imagecopyresampled($resized_image, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            imagedestroy($image);
            $image = $resized_image;
        }
    }

    // Save as JPEG to compress and reduce file size
    $success = @imagejpeg($image, $destinationPath, $quality);
    imagedestroy($image);
    return $success;
}

// 4. Handle File Upload (Photo)
$photo_url = '';
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['photo']['tmp_name'];
    $fileName = $_FILES['photo']['name'];
    $fileSize = $_FILES['photo']['size'];
    
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));
    
    // Sanitize file name
    $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
    
    // Allowed extensions
    $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg', 'webp');
    if (in_array($fileExtension, $allowedfileExtensions)) {
        // Directory where uploaded files will be saved
        $uploadFileDir = __DIR__ . '/uploads/';
        if (!file_exists($uploadFileDir)) {
            mkdir($uploadFileDir, 0755, true);
        }
        $dest_path = $uploadFileDir . $newFileName;
        
        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            // Compress image to save server space
            $compressed_dest = $uploadFileDir . 'comp_' . $newFileName;
            // Always convert to compressed jpg format to save maximum space
            $jpegFileName = md5(time() . $fileName) . '.jpg';
            $jpegDestPath = $uploadFileDir . $jpegFileName;
            
            if (compressImage($dest_path, $jpegDestPath, 75)) {
                // Remove original file, keep compressed jpg
                unlink($dest_path);
                $photo_url = 'uploads/' . $jpegFileName;
            } else {
                // If compression fails (e.g. GD not configured), fallback to original file
                $photo_url = 'uploads/' . $newFileName;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'There was an error moving the uploaded photo.']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Upload failed. Allowed image formats: ' . implode(',', $allowedfileExtensions)]);
        exit;
    }
}

// 5. Ensure database connection is active
if (!isset($connect) || !$connect) {
    echo json_encode(['status' => 'error', 'message' => 'Database server offline.']);
    exit;
}

// Ensure technicians table exists (fail-safe)
$connect->query("CREATE TABLE IF NOT EXISTS `technicians` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `role` VARCHAR(100) NOT NULL,
    `experience` VARCHAR(50) NOT NULL,
    `current_location` TEXT NOT NULL,
    `current_employment` TEXT DEFAULT '',
    `preferred_locations` TEXT DEFAULT '',
    `note` TEXT DEFAULT '',
    `photo_url` VARCHAR(255) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

// 6. Securely Insert Technician (Prepared Statements)
$stmt = $connect->prepare("INSERT INTO `technicians` (`name`, `phone`, `role`, `experience`, `current_location`, `current_employment`, `preferred_locations`, `note`, `photo_url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

if ($stmt) {
    $stmt->bind_param("sssssssss", $name, $phone, $role, $experience, $location, $current_employment, $preferred_locations, $note, $photo_url);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Technician application synced successfully on the server.',
            'photo_url' => $photo_url
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save technician: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Statement preparation failed: ' . $connect->error]);
}
?>
