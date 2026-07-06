<?php
// technicians.php - Secure Job Applicants Portal for KS Staff
require_once 'auth_check.php';
require_once 'db_connect.php';

// Handle technician delete action
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $tech_id = intval($_GET['id']);
    
    // Fetch photo path to delete it from server
    $stmt = $connect->prepare("SELECT `photo_url` FROM `technicians` WHERE `id` = ?");
    if ($stmt) {
        $stmt->bind_param("i", $tech_id);
        $stmt->execute();
        $res = $stmt->get_result()->fetch_assoc();
        if ($res && !empty($res['photo_url'])) {
            $full_path = __DIR__ . '/' . $res['photo_url'];
            if (file_exists($full_path)) {
                @unlink($full_path);
            }
        }
        $stmt->close();
    }
    
    $stmt_del = $connect->prepare("DELETE FROM `technicians` WHERE `id` = ?");
    if ($stmt_del) {
        $stmt_del->bind_param("i", $tech_id);
        $stmt_del->execute();
        $stmt_del->close();
    }
    header("Location: technicians.php");
    exit;
}

// Fetch metrics
$total_techs = $connect->query("SELECT COUNT(*) as cnt FROM technicians")->fetch_assoc()['cnt'];
$ac_techs = $connect->query("SELECT COUNT(*) as cnt FROM technicians WHERE role LIKE '%AC%'")->fetch_assoc()['cnt'];
$elec_techs = $connect->query("SELECT COUNT(*) as cnt FROM technicians WHERE role LIKE '%Electrician%'")->fetch_assoc()['cnt'];
$ro_techs = $connect->query("SELECT COUNT(*) as cnt FROM technicians WHERE role LIKE '%RO%'")->fetch_assoc()['cnt'];

// Fetch all technicians
$technicians = [];
$res_techs = $connect->query("SELECT * FROM technicians ORDER BY id DESC");
if ($res_techs && $res_techs->num_rows > 0) {
    while ($row = $res_techs->fetch_assoc()) {
        $technicians[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technician Applications | Staff Portal</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
    <style>
        .tech-thumbnail {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--primary-light);
            background-color: #f1f5f9;
        }
        
        /* Modal Overlay Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
            background-color: var(--card-bg);
            margin: 8% auto;
            padding: 30px;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            border: 1px solid #cbd5e1;
            position: relative;
            animation: slideUp 0.3s ease-out;
        }
        
        .close-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 28px;
            font-weight: 700;
            color: var(--text-muted);
            cursor: pointer;
        }
        
        .close-btn:hover {
            color: var(--danger);
        }
        
        /* Detail view styling */
        .detail-header {
            display: flex;
            align-items: center;
            gap: 20px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .detail-photo {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--primary);
            box-shadow: var(--shadow-sm);
            background-color: #f1f5f9;
        }
        .detail-title h3 {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 4px;
        }
        .detail-title span {
            font-size: 13px;
            font-weight: 600;
            color: var(--primary);
            background: var(--primary-light);
            padding: 2px 8px;
            border-radius: 4px;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 15px;
        }
        .detail-item {
            margin-bottom: 15px;
        }
        .detail-item label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 4px;
        }
        .detail-item p {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            margin: 0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
</head>
<body>

<header>
    <div class="container header-container">
        <div class="logo-section">
            <h1>KS Electrical and AC Services</h1>
            <span>Kaushindra Singh • Staff Portal</span>
        </div>
        <nav>
            <a href="index.php">Dashboard</a>
            <a href="customers.php">Customers & Bookings</a>
            <a href="technicians.php" class="active">Technicians</a>
            <a href="history.php">Bill History</a>
            <a href="create_invoice.php">Create New Bill</a>
            <a href="logout.php" style="color: var(--danger); margin-left: 10px;">Logout</a>
        </nav>
    </div>
</header>

<div class="container">
    
    <!-- Metrics Row -->
    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-info">
                <h3>Total Job Applicants</h3>
                <p><?php echo $total_techs; ?></p>
            </div>
            <div class="metric-icon">🛠️</div>
        </div>
        <div class="metric-card">
            <div class="metric-info">
                <h3>AC Technicians</h3>
                <p><?php echo $ac_techs; ?></p>
            </div>
            <div class="metric-icon">❄️</div>
        </div>
        <div class="metric-card">
            <div class="metric-info">
                <h3>Electricians</h3>
                <p><?php echo $elec_techs; ?></p>
            </div>
            <div class="metric-icon">⚡</div>
        </div>
        <div class="metric-card">
            <div class="metric-info">
                <h3>RO Specialists</h3>
                <p><?php echo $ro_techs; ?></p>
            </div>
            <div class="metric-icon">💧</div>
        </div>
    </div>

    <!-- Applicant Directory -->
    <div class="section-title-bar" style="margin-top: 30px;">
        <h2>Technician Recruitment Directory</h2>
    </div>

    <?php if (empty($technicians)) { ?>
        <div style="text-align: center; padding: 50px; border: 1px dashed #cbd5e1; border-radius: 8px; background: white; color: #64748b; margin-top: 20px;">
            No technician job applications submitted yet.
        </div>
    <?php } else { ?>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">S.No</th>
                        <th style="width: 8%;">DP</th>
                        <th>Technician Name</th>
                        <th>Role / Specialty</th>
                        <th>Experience</th>
                        <th>Current Address</th>
                        <th>Applied Date</th>
                        <th style="text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $sno = 1; foreach ($technicians as $tech) { ?>
                        <tr>
                            <td><?php echo $sno++; ?></td>
                            <td>
                                <img src="<?php echo $tech['photo_url'] ?: 'logo.png'; ?>" alt="DP" class="tech-thumbnail">
                            </td>
                            <td><strong><?php echo htmlspecialchars($tech['name']); ?></strong><br>
                                <a href="tel:<?php echo $tech['phone']; ?>" style="text-decoration: none; color: var(--primary); font-size: 12px; font-weight: 700;">📞 <?php echo htmlspecialchars($tech['phone']); ?></a>
                            </td>
                            <td><span style="font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px;"><?php echo htmlspecialchars($tech['role']); ?></span></td>
                            <td><strong><?php echo htmlspecialchars($tech['experience']); ?> Years</strong></td>
                            <td style="font-size: 12px; max-width: 200px;"><?php echo htmlspecialchars($tech['current_location']); ?></td>
                            <td style="font-size: 11px; color: var(--text-muted);"><?php echo date('d M Y', strtotime($tech['created_at'])); ?></td>
                            <td style="text-align: center;">
                                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 11px; width: auto; display: inline-block; margin-right: 5px;" onclick='viewDetails(<?php echo json_encode($tech); ?>)'>View Details</button>
                                <a href="technicians.php?action=delete&id=<?php echo $tech['id']; ?>" class="btn btn-danger" style="padding: 6px 12px; font-size: 11px; width: auto; display: inline-block; text-decoration: none;" onclick="return confirm('Are you sure you want to delete this applicant?')">Delete</a>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    <?php } ?>

</div>

<!-- Interactive Modal for Detailed View -->
<div id="techModal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        
        <div class="detail-header">
            <img id="m-photo" src="logo.png" alt="Candidate Photo" class="detail-photo">
            <div class="detail-title">
                <h3 id="m-name">Rajesh Kumar</h3>
                <span id="m-role">AC Technician</span>
            </div>
        </div>
        
        <div class="detail-grid">
            <div class="detail-item">
                <label>Phone Connection</label>
                <p><a id="m-phone-link" href="#" style="text-decoration: none; color: inherit;">📞 <span id="m-phone">7895321472</span></a></p>
            </div>
            <div class="detail-item">
                <label>Experience Level</label>
                <p id="m-experience">3 Years</p>
            </div>
            <div class="detail-item">
                <label>Current Location (वर्तमान पता)</label>
                <p id="m-location">Gaur City 1, Greater Noida</p>
            </div>
            <div class="detail-item">
                <label>Current Employment (अभी कहाँ काम करते हैं)</label>
                <p id="m-employment">Self-employed / Shop</p>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <label>Preferred Work Areas (आगे कहाँ काम करना चाहते हैं)</label>
                <p id="m-preferred">Noida Extension, Gaur City, Crossing Republik</p>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <label>Applied Date</label>
                <p id="m-date">12 June 2026</p>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <label>Self Notes / Introduction</label>
                <p id="m-note" style="min-height: 60px; font-weight: normal; line-height: 1.5;"></p>
            </div>
        </div>
    </div>
</div>

<script>
    function viewDetails(tech) {
        document.getElementById('m-photo').src = tech.photo_url ? tech.photo_url : 'logo.png';
        document.getElementById('m-name').innerText = tech.name;
        document.getElementById('m-role').innerText = tech.role;
        document.getElementById('m-phone').innerText = tech.phone;
        document.getElementById('m-phone-link').href = 'tel:' + tech.phone;
        document.getElementById('m-experience').innerText = tech.experience + ' Years';
        document.getElementById('m-location').innerText = tech.current_location;
        document.getElementById('m-employment').innerText = tech.current_employment ? tech.current_employment : 'Not Working / Fresher';
        document.getElementById('m-preferred').innerText = tech.preferred_locations ? tech.preferred_locations : 'Not Specified';
        document.getElementById('m-note').innerText = tech.note ? tech.note : 'None';
        
        // Format date nicely
        const date = new Date(tech.created_at);
        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        document.getElementById('m-date').innerText = date.toLocaleString('en-US', options);
        
        document.getElementById('techModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function closeModal() {
        document.getElementById('techModal').style.display = 'none';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    // Close when clicking outside of modal content
    window.onclick = function(event) {
        const modal = document.getElementById('techModal');
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }
</script>

<?php include_once 'search_widget.php'; ?>
</body>
</html>
