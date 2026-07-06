<?php
// customers.php - Registered Customers & Doorstep Bookings Dashboard
require_once 'auth_check.php';
require_once 'db_connect.php';

// Handle booking status updates
if (isset($_GET['action']) && $_GET['action'] === 'update_status' && isset($_GET['booking_id']) && isset($_GET['status'])) {
    $booking_id = intval($_GET['booking_id']);
    $new_status = $_GET['status'];
    if (in_array($new_status, ['Pending', 'Completed', 'Cancelled'])) {
        $stmt = $connect->prepare("UPDATE `bookings` SET `status` = ? WHERE `id` = ?");
        if ($stmt) {
            $stmt->bind_param("si", $new_status, $booking_id);
            $stmt->execute();
            $stmt->close();
        }
    }
    header("Location: customers.php");
    exit;
}

// Fetch metrics
$total_cust = $connect->query("SELECT COUNT(*) as cnt FROM customers")->fetch_assoc()['cnt'];
$total_bks = $connect->query("SELECT COUNT(*) as cnt FROM bookings")->fetch_assoc()['cnt'];
$pending_bks = $connect->query("SELECT COUNT(*) as cnt FROM bookings WHERE status = 'Pending'")->fetch_assoc()['cnt'];

// Fetch customer records
$customers = [];
$res_cust = $connect->query("SELECT * FROM customers ORDER BY id DESC");
if ($res_cust && $res_cust->num_rows > 0) {
    while ($row = $res_cust->fetch_assoc()) {
        $customers[] = $row;
    }
}

// Fetch booking records
$bookings = [];
$res_bks = $connect->query("SELECT * FROM bookings ORDER BY id DESC");
if ($res_bks && $res_bks->num_rows > 0) {
    while ($row = $res_bks->fetch_assoc()) {
        $bookings[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customers & Bookings | Staff Portal</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
    <style>
        .portal-grid {
            display: flex;
            flex-direction: column;
            gap: 30px;
            margin-top: 20px;
        }
        .portal-tabs {
            display: flex;
            gap: 10px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 2px;
            margin-bottom: 20px;
        }
        .tab-btn {
            background: none;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 700;
            color: #64748b;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -4px;
            transition: all 0.2s ease;
        }
        .tab-btn:hover {
            color: var(--primary);
        }
        .tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }
        .tab-content {
            display: none;
            animation: fadeIn 0.2s ease-in-out;
        }
        .tab-content.active {
            display: block;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .status-pending { background-color: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
        .status-completed { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        
        .action-select {
            padding: 5px 8px;
            font-size: 12px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            font-weight: 600;
            outline: none;
            cursor: pointer;
        }
        .action-select:focus {
            border-color: var(--primary);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Modal Style rules */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(2px);
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 650px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
        }
        .modal-close {
            font-size: 24px;
            font-weight: bold;
            color: #94a3b8;
            cursor: pointer;
            transition: color 0.2s;
        }
        .modal-close:hover {
            color: #334155;
        }
        .modal-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            font-weight: 800;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
        }
        .modal-history-row:hover {
            background-color: #f8fafc;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
            <a href="customers.php" class="active">Customers & Bookings</a>
            <a href="technicians.php">Technicians</a>
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
                <h3>Total Registered Customers</h3>
                <p><?php echo $total_cust; ?></p>
            </div>
            <div class="metric-icon">👥</div>
        </div>
        <div class="metric-card">
            <div class="metric-info">
                <h3>Total Booking Requests</h3>
                <p><?php echo $total_bks; ?></p>
            </div>
            <div class="metric-icon">📅</div>
        </div>
        <div class="metric-card">
            <div class="metric-info">
                <h3>Pending Booking Visits</h3>
                <p style="color: var(--warning);"><?php echo $pending_bks; ?></p>
            </div>
            <div class="metric-icon">⏳</div>
        </div>
    </div>


    <div class="portal-grid">
        
        <!-- Tabbed Navigation Panel -->
        <div>
            <div class="portal-tabs">
                <button class="tab-btn active" onclick="switchTab('bookingsTab', this)">Doorstep Booking Requests (<?php echo $total_bks; ?>)</button>
                <button class="tab-btn" onclick="switchTab('customersTab', this)">Registered Customers (<?php echo $total_cust; ?>)</button>
                <button class="tab-btn" onclick="switchTab('historyTab', this)">Customer History Search (खोजें)</button>
            </div>

            <!-- TAB 1: Bookings List -->
            <div id="bookingsTab" class="tab-content active">
                <div class="section-title-bar" style="margin-top: 0;">
                    <h2>Technician Dispatch & Booking Requests</h2>
                </div>
                
                <?php if (empty($bookings)) { ?>
                    <div style="text-align: center; padding: 40px; border: 1px dashed #cbd5e1; border-radius: 8px; background: white; color: #64748b;">
                        No doorstep bookings submitted yet.
                    </div>
                <?php } else { ?>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer Name</th>
                                    <th>Phone Connection</th>
                                    <th>Services Selected</th>
                                    <th>Region / Address</th>
                                    <th>Schedule Date/Time</th>
                                    <th>Surcharges / Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($bookings as $bk) { ?>
                                    <tr>
                                        <td><strong>#<?php echo $bk['id']; ?></strong></td>
                                        <td><strong><?php echo htmlspecialchars($bk['customer_name']); ?></strong></td>
                                        <td>
                                            <a href="tel:<?php echo $bk['phone']; ?>" style="text-decoration: none; color: var(--primary); font-weight: 700;">📞 <?php echo htmlspecialchars($bk['phone']); ?></a>
                                            <?php if ($bk['alternate_phone']) { ?>
                                                <br><span style="font-size: 10px; color: var(--text-muted);">Alt: <?php echo htmlspecialchars($bk['alternate_phone']); ?></span>
                                            <?php } ?>
                                        </td>
                                        <td style="max-width: 200px; font-weight: 600; font-size: 12px;"><?php echo htmlspecialchars($bk['service_type']); ?></td>
                                        <td style="max-width: 250px; font-size: 11px;">
                                            <span style="background: #e2e8f0; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px;"><?php echo htmlspecialchars($bk['area']); ?></span>
                                            <br><?php echo htmlspecialchars($bk['address']); ?>
                                        </td>
                                        <td style="font-size: 11px; font-weight: bold;">
                                            <?php echo date('d M Y', strtotime($bk['preferred_date'])); ?>
                                            <br><span style="color: var(--primary);"><?php echo htmlspecialchars($bk['preferred_time']); ?></span>
                                        </td>
                                        <td>
                                            <span class="status-badge <?php 
                                                echo $bk['status'] === 'Completed' ? 'status-completed' : ($bk['status'] === 'Cancelled' ? 'status-cancelled' : 'status-pending'); 
                                            ?>">
                                                <?php echo $bk['status']; ?>
                                            </span>
                                        </td>
                                        <td>
                                            <select class="action-select" onchange="updateBookingStatus(<?php echo $bk['id']; ?>, this.value)">
                                                <option value="" disabled selected>Change Status</option>
                                                <option value="Pending">Pending (लंबित)</option>
                                                <option value="Completed">Completed (पूरा)</option>
                                                <option value="Cancelled">Cancelled (रद्द)</option>
                                            </select>
                                        </td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                <?php } ?>
            </div>

            <!-- TAB 2: Registered Customers List -->
            <div id="customersTab" class="tab-content">
                <div class="section-title-bar" style="margin-top: 0;">
                    <h2>Registered Customer Directory</h2>
                </div>
                
                <?php if (empty($customers)) { ?>
                    <div style="text-align: center; padding: 40px; border: 1px dashed #cbd5e1; border-radius: 8px; background: white; color: #64748b;">
                        No customer registrations logged yet.
                    </div>
                <?php } else { ?>
                    <div class="table-responsive" style="max-width: 800px; margin: 0 auto;">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 10%;">S.No</th>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
                                    <th>Email ID (if any)</th>
                                    <th>Joined Date</th>
                                    <th style="width: 15%; text-align: center;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $sno = 1; foreach ($customers as $c) { ?>
                                    <tr>
                                        <td><?php echo $sno++; ?></td>
                                        <td><strong><?php echo htmlspecialchars($c['name']); ?></strong></td>
                                        <td><strong><a href="tel:<?php echo $c['phone']; ?>" style="text-decoration: none; color: var(--primary);">📞 <?php echo htmlspecialchars($c['phone']); ?></a></strong></td>
                                        <td style="font-size: 12px;"><?php echo htmlspecialchars($c['email'] ?: 'N/A'); ?></td>
                                        <td style="font-size: 11px; font-weight: bold; color: var(--text-muted);"><?php echo date('d M Y • h:i A', strtotime($c['created_at'])); ?></td>
                                        <td style="text-align: center;">
                                            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="viewCustomerHistory('<?php echo htmlspecialchars($c['phone']); ?>', '<?php echo htmlspecialchars(addslashes($c['name'])); ?>', '<?php echo htmlspecialchars($c['email'] ?: 'N/A'); ?>', '<?php echo date('d M Y', strtotime($c['created_at'])); ?>')">📜 History</button>
                                        </td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                <?php } ?>
            </div>

            <!-- TAB 3: Customer History Search -->
            <div id="historyTab" class="tab-content">
                <div class="section-title-bar" style="margin-top: 0;">
                    <h2>Advanced Customer History Search</h2>
                </div>
                
                <!-- Prominent Search Box -->
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 25px; box-shadow: var(--shadow-sm); max-width: 600px; margin: 0 auto 30px auto; text-align: center; font-family: inherit;">
                    <h3 style="margin-top: 0; color: #1e293b; font-size: 15px; font-weight: 800; margin-bottom: 10px;">Search Customer Timeline by Mobile Number</h3>
                    <p style="font-size: 11px; color: #64748b; margin-bottom: 15px; font-weight: bold;">Enter a 10-digit mobile number to fetch registration, booking, and billing history directly from Firebase Firestore.</p>
                    <div style="display: flex; gap: 10px; justify-content: center; max-width: 450px; margin: 0 auto; align-items: center;">
                        <div style="display: flex; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; flex: 1; background: #f8fafc; align-items: center;">
                            <span style="padding: 10px 12px; font-weight: bold; color: #94a3b8; border-right: 1px solid #e2e8f0; font-size: 13px;">+91</span>
                            <input type="tel" id="dashboardPhoneSearch" placeholder="Enter 10-digit mobile number" maxlength="10" style="border: none; padding: 10px 12px; font-size: 13px; font-weight: bold; color: #1e293b; background: white; outline: none; width: 100%;" onkeydown="if(event.key==='Enter') executeDashboardSearch()">
                        </div>
                        <button class="btn btn-primary" onclick="executeDashboardSearch()" style="padding: 10px 20px; font-weight: bold; border-radius: 8px; font-size: 13px; cursor: pointer; background: var(--primary); color: white; border: none;">Search</button>
                    </div>
                </div>
                
                <!-- Timeline Container -->
                <div id="dashboardTimelineContainer" style="max-width: 700px; margin: 0 auto; min-height: 150px;">
                    <div style="text-align: center; padding: 40px; border: 1px dashed #cbd5e1; border-radius: 12px; background: white; color: #94a3b8; font-weight: bold;">
                        <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
                        Enter a mobile number above and click search to generate the chronological history timeline.
                    </div>
                </div>
            </div>

        </div>

    </div>

</div>

<!-- Load Firebase Credentials dynamically from PHP backend configuration -->
<?php
$firebase_config = [
    'apiKey' => '',
    'authDomain' => '',
    'projectId' => '',
    'storageBucket' => '',
    'messagingSenderId' => '',
    'appId' => ''
];
if (file_exists('firebase-config.json')) {
    $firebase_config = json_decode(file_get_contents('firebase-config.json'), true);
}
?>
<script>
    window.firebaseConfig = <?php echo json_encode($firebase_config); ?>;
</script>

<script>
    // Tab switching utility
    function switchTab(tabId, btn) {
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => content.classList.remove('active'));

        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(button => button.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        btn.classList.add('active');
    }

    function updateBookingStatus(bookingId, status) {
        if (confirm("Are you sure you want to update the booking status to " + status + "?")) {
            window.location.href = "customers.php?action=update_status&booking_id=" + bookingId + "&status=" + status;
        }
    }

    function closeHistoryModal() {
        document.getElementById('historyModal').style.display = 'none';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
</script>

<!-- Modular Firebase Integration for Admin Timeline Search -->
<script type="module">
    import { searchCustomerHistory, renderTimeline } from './js/admin.js';

    // Advanced search on the main dashboard tab
    window.executeDashboardSearch = function() {
        const phoneVal = document.getElementById('dashboardPhoneSearch').value.trim().replace(/\D/g, '');
        if (phoneVal.length !== 10) {
            alert("Please enter a valid 10-digit mobile number (केवल 10 अंकों का मोबाइल नंबर दर्ज करें)");
            return;
        }

        const container = document.getElementById('dashboardTimelineContainer');
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 28px; height: 28px; animation: spin 1s linear infinite; margin: 0 auto 15px auto;"></div>
                <span style="font-size: 13px; font-weight: bold; color: #64748b;">Fetching customer history from Firestore...</span>
            </div>
        `;

        searchCustomerHistory(phoneVal)
            .then(data => {
                renderTimeline(data.events, 'dashboardTimelineContainer');
            })
            .catch(err => {
                console.error("Error executing dashboard search:", err);
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--danger); font-weight: bold;">
                        Failed to fetch customer history from Firestore. Error: ${err.message}
                    </div>
                `;
            });
    };

    // Advanced search inside the profile history modal
    window.viewCustomerHistory = function(phone, name, email, joined) {
        document.getElementById('modalCustName').innerText = name;
        document.getElementById('modalCustAvatar').innerText = name.charAt(0);
        document.getElementById('modalCustMeta').innerText = "Phone: " + phone + " • Joined: " + joined;
        
        const infoCard = document.getElementById('modalCustInfoCard');
        if (infoCard) infoCard.style.display = 'none';
        
        document.getElementById('modalLoading').style.display = 'block';
        document.getElementById('modalHistoryContainer').style.display = 'none';
        document.getElementById('historyModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        const cleanPhone = phone.replace(/\D/g, '');
        searchCustomerHistory(cleanPhone)
            .then(data => {
                document.getElementById('modalLoading').style.display = 'none';
                document.getElementById('modalHistoryContainer').style.display = 'block';
                
                if (infoCard && data.profile) {
                    document.getElementById('infoCustPhone').innerText = data.profile.phone;
                    // Email is completely eliminated
                    document.getElementById('infoCustEmail').innerText = 'N/A';
                    document.getElementById('infoCustAddress').innerText = data.profile.address || 'Address not specified';
                    infoCard.style.display = 'block';
                }

                // Inject a div to render the chronological timeline
                const container = document.getElementById('modalHistoryContainer');
                container.innerHTML = '<div id="modalTimelineContainer" style="padding: 10px 5px;"></div>';
                renderTimeline(data.events, 'modalTimelineContainer');
            })
            .catch(err => {
                console.error("Error loading customer history in modal:", err);
                document.getElementById('modalLoading').style.display = 'none';
                document.getElementById('modalHistoryContainer').style.display = 'block';
                document.getElementById('modalHistoryContainer').innerHTML = `
                    <div style="text-align: center; padding: 30px; color: var(--danger); font-weight: bold;">
                        Failed to fetch customer history from Firestore: ${err.message}
                    </div>
                `;
            });
    };

    // Direct search by phone from quick search widget
    window.showCustomerByPhone = function(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (!cleanPhone) return;
        
        switchTab('historyTab', document.querySelector('[onclick="switchTab(\'historyTab\', this)"]'));
        document.getElementById('dashboardPhoneSearch').value = cleanPhone;
        window.executeDashboardSearch();
    };

    // Auto-search if URL query param 'search_phone' is present
    window.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchPhone = urlParams.get('search_phone');
        if (searchPhone) {
            setTimeout(() => {
                window.showCustomerByPhone(searchPhone);
            }, 400);
        }
    });
</script>

<!-- Customer History Modal Overlay -->
<div id="historyModal" class="modal-overlay" style="display: none;" onclick="if(event.target===this) closeHistoryModal()">
    <div class="modal-content" style="max-width: 650px;">
        <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="modal-avatar" id="modalCustAvatar">C</div>
                <div>
                    <h3 id="modalCustName" style="margin: 0; font-size: 18px; color: #1e293b; font-weight: 800;">Customer History</h3>
                    <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600;" id="modalCustMeta">Phone: N/A • Joined: N/A</p>
                </div>
            </div>
            <span class="modal-close" onclick="closeHistoryModal()">&times;</span>
        </div>
        <div class="modal-body" style="padding: 20px; overflow-y: auto; max-height: 450px;">
            <!-- Customer Information Card -->
            <div id="modalCustInfoCard" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 15px; margin-bottom: 15px; display: none;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
                    <div><strong style="color: #475569;">📞 Mobile Number:</strong> <span id="infoCustPhone" style="font-weight: bold; color: #0f172a;">-</span></div>
                    <div><strong style="color: #475569;">✉️ Email Address:</strong> <span id="infoCustEmail" style="font-weight: bold; color: #0f172a;">-</span></div>
                    <div style="grid-column: span 2; border-top: 1px dashed #e2e8f0; padding-top: 6px; margin-top: 2px;">
                        <strong style="color: #475569;">📍 Latest Address (पता):</strong> <span id="infoCustAddress" style="font-weight: bold; color: #0f172a;">-</span>
                    </div>
                </div>
            </div>

            <div id="modalLoading" style="text-align: center; padding: 30px 0; display: none;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 10px auto;"></div>
                <span style="font-size: 12px; font-weight: 700; color: #64748b;">Fetching customer service history...</span>
            </div>
            <div id="modalHistoryContainer">
                <!-- Chronological timeline injected here via JS -->
            </div>
        </div>
        <div class="modal-footer" style="background: #f8fafc; padding: 15px 20px; text-align: right; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">KS Electrical & AC Services</span>
            <button class="btn btn-secondary btn-sm" onclick="closeHistoryModal()" style="font-weight: bold; padding: 6px 12px; cursor: pointer;">Close</button>
        </div>
    </div>
</div>

<?php include_once 'search_widget.php'; ?>
</body>
</html>
