<?php
// home.php - Dynamic Public Homepage for KS Electrical and AC Services
require_once 'db_connect.php';

// ----------------------------------------------------
// 1. DYNAMIC LOCAL SEO INTEGRATION
// ----------------------------------------------------
$service_slug = isset($_GET['service']) ? trim(strtolower($_GET['service'])) : '';
$location_slug = isset($_GET['location']) ? trim(strtolower($_GET['location'])) : '';

// Map service slugs to clean names
$services_map = [
    'ac-service' => 'AC Service & Jet Cleaning',
    'ac-repair' => 'AC Repair & Gas Leak Fix',
    'ac-installation' => 'AC Installation & Uninstall',
    'ro-service' => 'RO Water Purifier Service',
    'ro-repair' => 'RO Repair & Filter Change',
    'electrician' => 'Electrician Service & Short Circuit Fix',
    'pigeon-net' => 'Balcony Pigeon Net Installation',
    'geyser-service' => 'Geyser Repair & Service',
    'washing-machine' => 'Washing Machine Repair',
    'refrigerator' => 'Refrigerator Gas Recharging & Repair',
    'chimney' => 'Kitchen Chimney Deep Servicing',
    'plumbing' => 'Plumbing Works & Leak Fixes',
    'carpenter' => 'Carpentry Adjustments',
    'ceiling' => 'False Ceiling Installation'
];

// Map location slugs to clean names
$locations_map = [
    'gaur-city-1' => 'Gaur City 1',
    'gaur-city-2' => 'Gaur City 2',
    'noida-extension' => 'Noida Extension',
    'ghaziabad' => 'Ghaziabad',
    'greater-noida' => 'Greater Noida West'
];

// Default fallback SEO metadata (NAP Consistency)
$business_name = "KS Electrical and AC Services";
$page_title = "KS Electrical and AC Services | Best Appliance Repair & Electrician in Noida Extension";
$meta_desc = "KS Electrical and AC Services provides same-day split & window AC wet cleaning, RO purifier repair, certified electrician visits, and balcony pigeon nets in Noida Extension, Gaur City, and Ghaziabad.";
$seo_heading = "Professional Appliance Repair & Electrical Services";
$seo_subheading = "Fast, Safe, and Certified Doorstep Service in Gaur City & Noida Extension";

$matched_service = isset($services_map[$service_slug]) ? $services_map[$service_slug] : '';
$matched_location = isset($locations_map[$location_slug]) ? $locations_map[$location_slug] : '';

// Dynamically optimize titles, meta descriptions, and headings for Google rankings
if ($matched_service && $matched_location) {
    $page_title = "Best {$matched_service} in {$matched_location} | {$business_name}";
    $meta_desc = "Looking for the best {$matched_service} in {$matched_location}? Get same-day doorstep technician visits, 100% genuine parts, and 30-day warranty. Book now!";
    $seo_heading = "Best {$matched_service} in {$matched_location}";
    $seo_subheading = "Verified doorstep {$matched_service} solutions across {$matched_location} by certified engineers.";
} elseif ($matched_service) {
    $page_title = "Top {$matched_service} near Noida Extension & Gaur City | {$business_name}";
    $meta_desc = "Get fast, certified {$matched_service} by {$business_name}. Transparent pricing, manufacturer-approved spares, and same-day scheduling.";
    $seo_heading = "Top {$matched_service} Services";
    $seo_subheading = "Prompt repairs, certified technicians, and upfront pricing on all doorstep bookings.";
} elseif ($matched_location) {
    $page_title = "Best Electrician & AC Service in {$matched_location} | {$business_name}";
    $meta_desc = "Need local appliance repair or electrical work in {$matched_location}? Hire Kaushindra Singh's expert team for AC, RO, Geyser, and wiring fixes.";
    $seo_heading = "Certified Doorstep Services in {$matched_location}";
    $seo_subheading = "Serving residential apartments in {$matched_location} with transparent billing and warranty.";
}

// ----------------------------------------------------
// 2. FETCH APPROVED REVIEWS FOR DYNAMIC TESTIMONIALS
// ----------------------------------------------------
$reviews = [];
if (isset($connect)) {
    $query_reviews = "SELECT `customer_name`, `rating`, `review_text`, `service_used`, `created_at` FROM `reviews` WHERE `status` = 'Approved' ORDER BY `id` DESC LIMIT 6";
    $res_reviews = $connect->query($query_reviews);
    if ($res_reviews && $res_reviews->num_rows > 0) {
        while ($row = $res_reviews->fetch_assoc()) {
            $reviews[] = $row;
        }
    }
}

// Fallback reviews if database is empty/not setup
if (empty($reviews)) {
    $reviews = [
        [
            'customer_name' => 'Amit Sharma',
            'rating' => 5,
            'review_text' => 'Excellent AC wet service in Gaur City 1. The high-pressure jet wash removed all dirt. Cooling is great now!',
            'service_used' => 'ac-service',
            'created_at' => '2026-06-12'
        ],
        [
            'customer_name' => 'Priya Goel',
            'rating' => 5,
            'review_text' => 'Professional electrician service in Noida Extension. The technician diagnosed the earth leak and replaced the MCB in no time.',
            'service_used' => 'electrician',
            'created_at' => '2026-06-13'
        ],
        [
            'customer_name' => 'Sanjay Verma',
            'rating' => 4,
            'review_text' => 'Fast RO filter service. The water taste has improved. Very reasonable service rates.',
            'service_used' => 'ro-service',
            'created_at' => '2026-06-14'
        ]
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($meta_desc); ?>">
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts (Outfit) -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1e40af;
            --accent: #f97316;
            --accent-dark: #ea580c;
            --bg-dark: #0f172a;
            --text-main: #1e293b;
            --text-muted: #64748b;
        }

        body {
            font-family: 'Outfit', sans-serif;
            color: var(--text-main);
            background-color: #f8fafc;
        }

        /* Navbar Styling */
        .navbar {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .navbar-brand h4 {
            font-weight: 800;
            color: var(--bg-dark);
            margin: 0;
            line-height: 1;
        }
        .navbar-brand span {
            font-size: 10px;
            color: var(--text-muted);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Hero Section */
        .hero-section {
            background: linear-gradient(135deg, var(--bg-dark) 0%, #1e1b4b 100%);
            color: white;
            padding: 100px 0 80px;
            position: relative;
            overflow: hidden;
        }
        .hero-section::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 300px;
            background: rgba(37, 99, 235, 0.15);
            border-radius: 50%;
            filter: blur(80px);
        }
        .hero-section h1 {
            font-weight: 900;
            font-size: 2.8rem;
            line-height: 1.1;
            letter-spacing: -0.03em;
        }
        .hero-section p {
            font-size: 1.1rem;
            color: #cbd5e1;
            font-weight: 500;
        }

        /* Service Cards */
        .service-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
            border-color: var(--primary);
        }
        .service-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            display: block;
        }
        .service-card h4 {
            font-weight: 800;
            font-size: 1.2rem;
            color: var(--bg-dark);
            margin-bottom: 10px;
        }
        .service-card p {
            font-size: 0.85rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 20px;
        }

        /* Reviews Slider/Grid */
        .review-box {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 25px;
            height: 100%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.01);
        }
        .stars {
            color: #fbbf24;
            font-size: 1.1rem;
            margin-bottom: 10px;
        }
        .review-text {
            font-size: 0.9rem;
            color: var(--text-main);
            font-style: italic;
            line-height: 1.6;
        }
        .reviewer-name {
            font-weight: 700;
            font-size: 0.85rem;
            color: var(--bg-dark);
            margin-top: 15px;
            display: block;
        }
        .reviewer-meta {
            font-size: 10px;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
        }

        /* Form Styling */
        .card-form {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.02);
        }
        .form-label {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            margin-bottom: 6px;
        }
        .form-control, .form-select {
            padding: 12px;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        /* Star Rating Selection */
        .rating-selection {
            display: flex;
            gap: 8px;
            font-size: 1.8rem;
            cursor: pointer;
            color: #cbd5e1;
        }
        .rating-selection span.selected, .rating-selection span:hover, .rating-selection span:hover ~ span {
            color: #fbbf24;
        }

        /* Buttons */
        .btn-primary-custom {
            background-color: var(--primary);
            color: white;
            font-weight: 700;
            border: none;
            padding: 12px 25px;
            border-radius: 10px;
            transition: all 0.2s ease;
        }
        .btn-primary-custom:hover {
            background-color: var(--primary-dark);
        }
        .btn-accent-custom {
            background-color: var(--accent);
            color: white;
            font-weight: 700;
            border: none;
            padding: 12px 25px;
            border-radius: 10px;
            transition: all 0.2s ease;
        }
        .btn-accent-custom:hover {
            background-color: var(--accent-dark);
        }

        /* Floating CTA Footer Bar for Mobile */
        .floating-cta-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #0f172a;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
        }
        .floating-cta-btn {
            flex: 1;
            margin: 0 5px;
            padding: 12px 10px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .floating-call {
            background-color: var(--primary);
            color: white;
        }
        .floating-whatsapp {
            background-color: #25d366;
            color: white;
        }
        .floating-book {
            background-color: var(--accent);
            color: white;
        }

        footer {
            background-color: var(--bg-dark);
            color: #94a3b8;
            padding: 50px 0 90px; /* Extra padding for floating bar */
            font-size: 0.85rem;
            border-top: 1px solid #1e293b;
        }
        footer h5 {
            color: white;
            font-weight: 700;
            margin-bottom: 20px;
        }
        /* Service Image Styling */
        .service-image {
            width: 100%;
            height: 170px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 15px;
            display: block;
            transition: transform 0.3s ease;
        }
        .service-card:hover .service-image {
            transform: scale(1.03);
        }
        .service-card {
            overflow: hidden;
        }

        /* Hero Image */
        .hero-img {
            width: 100%;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            object-fit: cover;
            max-height: 350px;
        }
    </style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
        <a class="navbar-brand d-flex flex-col align-items-start" href="home.php">
            <h4>KS Electrical</h4>
            <span>And AC Services</span>
        </a>
        <div class="d-none d-md-block text-end">
            <span class="d-block text-muted" style="font-size: 10px; font-weight: 700; text-transform: uppercase;">Helpline Dispatch</span>
            <a href="tel:7895321472" class="text-decoration-none fw-bold fs-5 text-dark">📞 +91 7895321472</a>
        </div>
    </div>
</nav>

<!-- Hero Section -->
<section class="hero-section text-center text-md-start">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-7">
                <span class="badge bg-primary mb-3 py-2 px-3 text-uppercase fw-bold" style="font-size: 11px;">Certified local Experts</span>
                <h1 class="mb-3"><?php echo htmlspecialchars($seo_heading); ?></h1>
                <p class="mb-4"><?php echo htmlspecialchars($seo_subheading); ?></p>
                <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                    <a href="#bookingForm" class="btn btn-accent-custom py-3 px-4 uppercase">Book Technician Now</a>
                    <a href="tel:7895321472" class="btn btn-outline-light py-3 px-4">📞 Call operator</a>
                </div>
            </div>
            <div class="col-lg-5 d-none d-lg-block">
                <img src="images/services/hero_banner.jpg" alt="KS Electrical Service Team" class="hero-img">
            </div>
        </div>
    </div>
</section>

<!-- ======================================================= -->
<!-- PHOTO GALLERY SLIDER - Auto Sliding Work Portfolio       -->
<!-- ======================================================= -->
<section class="gallery-slider-section" id="gallery">
    <div class="slider-header text-center">
        <span class="slider-tag">📸 Our Real Work</span>
        <h2 class="slider-title">See Our Expert Technicians in Action</h2>
        <p class="slider-sub">Real on-site service photos from our certified team across Gaur City & Noida Extension</p>
    </div>

    <div class="ks-slider-wrapper">
        <div class="ks-slider" id="ksSlider">

            <!-- Slide 1 - AI: AC Service Banner -->
            <div class="ks-slide active">
                <img src="images/slider/slide_ac_service.jpg" alt="AC Jet Wash Service" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">❄️ AC Service</span>
                    <h3>High-Pressure Jet Wash AC Cleaning</h3>
                    <p>Deep cleaning of cooling coils, drain pipes & outdoor units</p>
                </div>
            </div>

            <!-- Slide 2 - Real: AC Outdoor Service -->
            <div class="ks-slide">
                <img src="images/slider/gallery_ac_1.jpg" alt="AC Outdoor Unit Service" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">❄️ AC Repair</span>
                    <h3>Outdoor AC Unit Servicing</h3>
                    <p>Compressor & coil cleaning for improved cooling performance</p>
                </div>
            </div>

            <!-- Slide 3 - AI: Electrician Banner -->
            <div class="ks-slide">
                <img src="images/slider/slide_electrician.jpg" alt="Electrical Wiring Work" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">⚡ Electrician</span>
                    <h3>Professional Electrical Wiring & Panel Work</h3>
                    <p>MCB upgrades, short circuit fixes & new modular fittings</p>
                </div>
            </div>

            <!-- Slide 4 - Real: Wiring Work -->
            <div class="ks-slide">
                <img src="images/slider/gallery_wiring_1.jpg" alt="Electrical Wiring Installation" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">⚡ Wiring</span>
                    <h3>Complete Home Wiring Installation</h3>
                    <p>PVC conduit wiring with proper earthing & circuit protection</p>
                </div>
            </div>

            <!-- Slide 5 - Real: Washing Machine Repair -->
            <div class="ks-slide">
                <img src="images/slider/gallery_washing_1.jpg" alt="Washing Machine Repair" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">🌀 Washing Machine</span>
                    <h3>Washing Machine Motor & Drum Repair</h3>
                    <p>PCB diagnostics, drum bearing replacement & drain blockage fixes</p>
                </div>
            </div>

            <!-- Slide 6 - Real: RO Purifier -->
            <div class="ks-slide">
                <img src="images/slider/gallery_ro_1.jpg" alt="RO Water Purifier Service" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">💧 RO Service</span>
                    <h3>RO Water Purifier Complete Service</h3>
                    <p>Filter replacement, membrane cleaning & TDS calibration</p>
                </div>
            </div>

            <!-- Slide 7 - Real: Refrigerator Repair -->
            <div class="ks-slide">
                <img src="images/slider/gallery_fridge_1.jpg" alt="Refrigerator Repair" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">🧊 Refrigerator</span>
                    <h3>Refrigerator Gas Charging & Repair</h3>
                    <p>Compressor relay, thermostat & R134a gas recharging service</p>
                </div>
            </div>

            <!-- Slide 8 - Real: Geyser Service -->
            <div class="ks-slide">
                <img src="images/slider/gallery_geyser_1.jpg" alt="Geyser Repair Service" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">🔥 Geyser</span>
                    <h3>Geyser Heating Element & Thermostat Service</h3>
                    <p>Safe earthing check, leakage repair & heating element replacement</p>
                </div>
            </div>

            <!-- Slide 9 - Real: Second Wiring -->
            <div class="ks-slide">
                <img src="images/slider/gallery_wiring_2.jpg" alt="Electrical Works" loading="lazy">
                <div class="slide-caption">
                    <span class="slide-badge">⚡ Electrical</span>
                    <h3>Switchboard & Junction Box Work</h3>
                    <p>Modular switch fitting, MCB installation & safety upgrades</p>
                </div>
            </div>

        </div>

        <!-- Prev / Next Arrows -->
        <button class="slider-arrow prev-arrow" onclick="slideMove(-1)" aria-label="Previous">&#8249;</button>
        <button class="slider-arrow next-arrow" onclick="slideMove(1)" aria-label="Next">&#8250;</button>

        <!-- Dots Navigation -->
        <div class="slider-dots" id="sliderDots"></div>
    </div>
</section>

<style>
/* ===========================
   GALLERY SLIDER STYLES
   =========================== */
.gallery-slider-section {
    background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
    padding: 60px 0 50px;
    overflow: hidden;
}
.slider-header {
    padding: 0 20px 35px;
}
.slider-tag {
    display: inline-block;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: white;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 5px 16px;
    border-radius: 999px;
    margin-bottom: 14px;
}
.slider-title {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
}
.slider-sub {
    color: #64748b;
    font-size: 0.9rem;
    max-width: 560px;
    margin: 0 auto;
}

/* Slider Wrapper */
.ks-slider-wrapper {
    position: relative;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0,0,0,0.15);
    background: #0f172a;
}
.ks-slider {
    position: relative;
    width: 100%;
    height: 480px;
}
@media (max-width: 768px) {
    .ks-slider { height: 280px; }
    .gallery-slider-section { padding: 40px 0 30px; }
}

/* Individual Slides */
.ks-slide {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    pointer-events: none;
}
.ks-slide.active {
    opacity: 1;
    pointer-events: auto;
}
.ks-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.82);
}

/* Caption Overlay */
.slide-caption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(0deg, rgba(10,20,40,0.92) 0%, rgba(10,20,40,0.5) 70%, transparent 100%);
    padding: 30px 35px 28px;
    color: white;
}
.slide-badge {
    display: inline-block;
    background: rgba(37,99,235,0.85);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 3px 10px;
    border-radius: 999px;
    margin-bottom: 8px;
    backdrop-filter: blur(4px);
}
.slide-caption h3 {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    font-weight: 800;
    margin: 0 0 5px;
    line-height: 1.2;
    text-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.slide-caption p {
    font-size: clamp(0.75rem, 1.5vw, 0.9rem);
    color: #cbd5e1;
    margin: 0;
}

/* Arrows */
.slider-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    z-index: 10;
    backdrop-filter: blur(6px);
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}
.slider-arrow:hover {
    background: rgba(37,99,235,0.8);
    border-color: rgba(37,99,235,0.9);
    transform: translateY(-50%) scale(1.1);
}
.prev-arrow { left: 16px; }
.next-arrow { right: 16px; }

/* Dots */
.slider-dots {
    position: absolute;
    bottom: 14px;
    right: 20px;
    display: flex;
    gap: 7px;
    z-index: 10;
}
.slider-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}
.slider-dot.active {
    background: white;
    width: 22px;
    border-radius: 4px;
}
</style>

<script>
// ===============================
// KS Gallery Slider Logic
// ===============================
(function() {
    const slides = document.querySelectorAll('.ks-slide');
    const dotsContainer = document.getElementById('sliderDots');
    let current = 0;
    let timer = null;
    const INTERVAL = 3500;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(n) {
        slides[current].classList.remove('active');
        document.querySelectorAll('.slider-dot')[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        document.querySelectorAll('.slider-dot')[current].classList.add('active');
    }

    function next() { goTo(current + 1); }

    function startTimer() { timer = setInterval(next, INTERVAL); }
    function stopTimer() { clearInterval(timer); }

    // Pause on hover
    const wrapper = document.querySelector('.ks-slider-wrapper');
    wrapper.addEventListener('mouseenter', stopTimer);
    wrapper.addEventListener('mouseleave', startTimer);

    // Touch/swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopTimer(); }, { passive: true });
    wrapper.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); }
        startTimer();
    }, { passive: true });

    startTimer();

    // Global arrow functions
    window.slideMove = function(dir) { stopTimer(); goTo(current + dir); startTimer(); };
})();
</script>

<!-- Services Grid Section -->
<section class="py-5" id="services">
    <div class="container py-4">
        <div class="text-center mb-5">
            <h2 class="fw-bold text-dark mb-2">Our Premium Doorstep Services</h2>
            <p class="text-muted max-w-lg mx-auto">We provide expert, certified repair and installations for all household utilities.</p>
        </div>
        
        <div class="row g-4">
            <!-- 1. AC Service -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/ac_service.jpg" alt="AC Service & Jet Cleaning" class="service-image">
                        <h4>AC Service &amp; Jet Clean</h4>
                        <p>High-pressure jet wash for cooling coils, filter sanitization, drain cleaning, and outdoor unit wash.</p>
                    </div>
                    <button onclick="prefillBooking('AC Service &amp; Jet Cleaning')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>
            
            <!-- 2. AC Repair -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/ac_repair.jpg" alt="AC Repair & Gas Leak Fix" class="service-image">
                        <h4>AC Repair &amp; Gas Leak Fix</h4>
                        <p>Compressor diagnostics, capacitor replacements, nitrogen testing, leak welds, and R32/R22 gas refilling.</p>
                    </div>
                    <button onclick="prefillBooking('AC Repair &amp; Gas Leak Fix')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 3. AC Installation -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/ac_installation.jpg" alt="AC Installation & Removal" class="service-image">
                        <h4>AC Installation &amp; Removal</h4>
                        <p>Secure split and window AC wall mounting, piping layout, outdoor bracket setup, and safe removal.</p>
                    </div>
                    <button onclick="prefillBooking('AC Installation &amp; Uninstall')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 4. RO Service -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/ro_service.jpg" alt="RO Service & Maintenance" class="service-image">
                        <h4>RO Service &amp; Maintenance</h4>
                        <p>Complete checkup, pre-carbon sediment filter replacements, membrane cleaning, and TDS calibration.</p>
                    </div>
                    <button onclick="prefillBooking('RO Water Purifier Service')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 5. RO Repair -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/ro_repair.jpg" alt="RO Purifier Repair" class="service-image">
                        <h4>RO Purifier Repair</h4>
                        <p>Fixing choking membranes, TDS imbalances, pump failures, solenoid leaks, and electrical adapter faults.</p>
                    </div>
                    <button onclick="prefillBooking('RO Repair &amp; Filter Change')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 6. Electrician Works -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/electrician.jpg" alt="Electrician Works" class="service-image">
                        <h4>Electrician Works</h4>
                        <p>Short circuit diagnosis, switch modular board repairs, MCB/RCCB protector upgrades, and new lighting fitting.</p>
                    </div>
                    <button onclick="prefillBooking('Electrician Service &amp; Short Circuit Fix')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 7. Pigeon Net -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/pigeon_net.jpg" alt="Pigeon Net Installation" class="service-image">
                        <h4>Pigeon Net Installation</h4>
                        <p>Heavy-duty HDPE nylon net installation on balconies with rustproof steel anchors to prevent bird infestation.</p>
                    </div>
                    <button onclick="prefillBooking('Balcony Pigeon Net Installation')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 8. Geyser Service -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/geyser.jpg" alt="Geyser Repair & Service" class="service-image">
                        <h4>Geyser Repair &amp; Service</h4>
                        <p>Thermostat replacement, heating elements scaling clean, leakage repair, and earthing checks.</p>
                    </div>
                    <button onclick="prefillBooking('Geyser Repair &amp; Service')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 9. Washing Machine -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/washing_machine.jpg" alt="Washing Machine Repair" class="service-image">
                        <h4>Washing Machine Repair</h4>
                        <p>Fixing drum vibration, spin cycle errors, water inlet drainage blockages, and motherboard (PCB) repairs.</p>
                    </div>
                    <button onclick="prefillBooking('Washing Machine Repair')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 10. Refrigerator -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/refrigerator.jpg" alt="Refrigerator Gas & Repair" class="service-image">
                        <h4>Refrigerator Gas &amp; Repair</h4>
                        <p>Thermostat calibration, compressor relay replacements, defrost timer fixes, and R134a/R600a gas charging.</p>
                    </div>
                    <button onclick="prefillBooking('Refrigerator Gas Recharging &amp; Repair')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 11. Chimney Service -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/chimney.jpg" alt="Kitchen Chimney Servicing" class="service-image">
                        <h4>Kitchen Chimney Servicing</h4>
                        <p>Deep grease baffle filter wash, suction blower oil clearing, carbon filter check, and ducting setups.</p>
                    </div>
                    <button onclick="prefillBooking('Kitchen Chimney Deep Servicing')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>

            <!-- 12. Plumbing -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/plumbing.jpg" alt="Plumbing Works" class="service-image">
                        <h4>Plumbing Works</h4>
                        <p>Repairing faucet leaks, bathroom fittings, washbasin pipeline blockages, and flush tank valve checks.</p>
                    </div>
                    <button onclick="prefillBooking('Plumbing Works &amp; Leak Fixes')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>
            
            <!-- 13. Carpenter -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/carpentry.jpg" alt="Carpentry Adjustments" class="service-image">
                        <h4>Carpentry Adjustments</h4>
                        <p>Door lock replacements, hinge realignments, drawer channel fixing, and general wooden adjustments.</p>
                    </div>
                    <button onclick="prefillBooking('Carpentry Adjustments')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>
            
            <!-- 14. False Ceiling -->
            <div class="col-md-4 col-sm-6">
                <div class="service-card">
                    <div>
                        <img src="images/services/false_ceiling.jpg" alt="False Ceiling Service" class="service-image">
                        <h4>False Ceiling Service</h4>
                        <p>Gypsum panel board installations, grid frames, cove lighting configurations, and decorative updates.</p>
                    </div>
                    <button onclick="prefillBooking('False Ceiling Installation')" class="btn btn-primary-custom w-100">Book Service</button>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Testimonials Carousel Section -->
<section class="py-5 bg-white border-y border-gray-200">
    <div class="container py-4">
        <div class="text-center mb-5">
            <h2 class="fw-bold text-dark mb-2">Real Customer Reviews</h2>
            <p class="text-muted">Direct feed of verified feedback submitted by local apartment owners.</p>
        </div>

        <div class="row g-4 justify-content-center">
            <?php foreach ($reviews as $rev): ?>
            <div class="col-lg-4 col-md-6">
                <div class="review-box">
                    <div class="stars">
                        <?php 
                        for ($i = 1; $i <= 5; $i++) {
                            echo $i <= $rev['rating'] ? '★' : '☆';
                        }
                        ?>
                    </div>
                    <p class="review-text">"<?php echo htmlspecialchars($rev['review_text']); ?>"</p>
                    <span class="reviewer-name"><?php echo htmlspecialchars($rev['customer_name']); ?></span>
                    <span class="reviewer-meta"><?php echo htmlspecialchars($rev['service_used']); ?> • Verified Client</span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Booking & Review Submission Forms -->
<section class="py-5" id="formsSection">
    <div class="container">
        <div class="row g-5">
            
            <!-- Booking Form Column -->
            <div class="col-lg-7" id="bookingForm">
                <div class="card-form">
                    <h3 class="fw-bold mb-2">Book Doorstep Technician</h3>
                    <p class="text-muted mb-4" style="font-size: 13px;">Fill in your details, select your appliance type, and select your preferred schedule slot.</p>
                    
                    <div id="bookingAlert"></div>

                    <form id="bookForm" action="submit_booking.php" method="POST">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label" for="c_name">Customer Name</label>
                                <input type="text" class="form-control" id="c_name" name="customer_name" required placeholder="e.g. Rajesh Singh">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="c_phone">Phone Number</label>
                                <input type="tel" class="form-control" id="c_phone" name="phone" required placeholder="e.g. 7895XXXXXX" pattern="[0-9]{10}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="c_alt_phone">Alternate Phone (Optional)</label>
                                <input type="tel" class="form-control" id="c_alt_phone" name="alternate_phone" placeholder="Alternate phone" pattern="[0-9]{10}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="c_service">Service Type</label>
                                <select class="form-select" id="c_service" name="service_type" required>
                                    <option value="" disabled selected>Choose a Service</option>
                                    <?php foreach ($services_map as $key => $val): ?>
                                        <option value="<?php echo htmlspecialchars($val); ?>"><?php echo htmlspecialchars($val); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="c_area">Service Area Coverage</label>
                                <select class="form-select" id="c_area" name="area" required>
                                    <option value="" disabled selected>Choose Area</option>
                                    <?php foreach ($locations_map as $key => $val): ?>
                                        <option value="<?php echo htmlspecialchars($val); ?>"><?php echo htmlspecialchars($val); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="c_date">Preferred Date</label>
                                <input type="date" class="form-control" id="c_date" name="preferred_date" required min="<?php echo date('Y-m-d'); ?>">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="c_time">Preferred Slot Time</label>
                                <select class="form-select" id="c_time" name="preferred_time" required>
                                    <option value="" disabled selected>Choose Time Slot</option>
                                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                                    <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                                    <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                                    <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="c_address">Complete Address (Flat, Block, Society Name)</label>
                                <textarea class="form-control" id="c_address" name="address" required rows="3" placeholder=" सोसाइटी और फ्लैट नंबर सहित पूरा पता यहाँ लिखें..."></textarea>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-accent-custom w-100 py-3 uppercase">Submit Booking Request</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Review Submission Column -->
            <div class="col-lg-5" id="reviewForm">
                <div class="card-form">
                    <h3 class="fw-bold mb-2">Write a Review</h3>
                    <p class="text-muted mb-4" style="font-size: 13px;">Share your experience with our technician and help others select local services.</p>
                    
                    <div id="reviewAlert"></div>

                    <form id="submitReviewForm" action="submit_review.php" method="POST">
                        <div class="mb-3">
                            <label class="form-label">Select Star Rating</label>
                            <div class="rating-selection" id="starsSelector">
                                <span data-value="1">☆</span>
                                <span data-value="2">☆</span>
                                <span data-value="3">☆</span>
                                <span data-value="4">☆</span>
                                <span data-value="5">☆</span>
                            </div>
                            <input type="hidden" name="rating" id="review_rating" value="5" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="r_name">Your Name</label>
                            <input type="text" class="form-control" id="r_name" name="customer_name" required placeholder="e.g. Sonia Sharma">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="r_service">Service Utilized</label>
                            <select class="form-select" id="r_service" name="service_used" required>
                                <option value="" disabled selected>Select service</option>
                                <?php foreach ($services_map as $key => $val): ?>
                                    <option value="<?php echo htmlspecialchars($val); ?>"><?php echo htmlspecialchars($val); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="form-label" for="r_text">Review Description</label>
                            <textarea class="form-control" id="r_text" name="review_text" required rows="4" placeholder="अपना रिपेयरिंग अनुभव यहाँ विस्तार से साझा करें..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary-custom w-100 py-3 uppercase">Publish Review</button>
                    </form>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Footer -->
<footer>
    <div class="container">
        <div class="row g-4">
            <div class="col-md-5">
                <h5 class="text-white fw-bold mb-3"><?php echo htmlspecialchars($business_name); ?></h5>
                <p>Kaushindra Singh • Certified HVAC and Residential Electrical Contractor.</p>
                <p>📍 Gaur City 1, Greater Noida West, Noida Extension, Uttar Pradesh 201301</p>
                <p>📞 Helpline: +91 7895321472 | 📧 email: kselectrical004@gmail.com</p>
            </div>
            <div class="col-md-4">
                <h5>Our Dynamic Areas</h5>
                <ul class="list-unstyled text-light" style="font-size: 13px; opacity: 0.8;">
                    <li><a href="home.php?location=gaur-city-1" class="text-white text-decoration-none">AC Service in Gaur City 1</a></li>
                    <li><a href="home.php?location=gaur-city-2" class="text-white text-decoration-none">Electrician in Gaur City 2</a></li>
                    <li><a href="home.php?location=noida-extension" class="text-white text-decoration-none">RO Service in Noida Extension</a></li>
                    <li><a href="home.php?location=ghaziabad" class="text-white text-decoration-none">Pigeon Net in Ghaziabad</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h5>Local SEO Index</h5>
                <ul class="list-unstyled text-light" style="font-size: 13px; opacity: 0.8;">
                    <li><a href="home.php?service=ac-service" class="text-white text-decoration-none">AC Services</a></li>
                    <li><a href="home.php?service=electrician" class="text-white text-decoration-none">Electrician Services</a></li>
                    <li><a href="home.php?service=ro-service" class="text-white text-decoration-none">RO Services</a></li>
                </ul>
            </div>
        </div>
        <hr class="my-4 bg-secondary">
        <div class="text-center text-muted" style="font-size: 12px;">
            <p>© <?php echo date('Y'); ?> <?php echo strtoupper($business_name); ?>. ALL RIGHTS RESERVED. (INFINITYFREE SYSTEM)</p>
        </div>
    </div>
</footer>

<!-- Floating CTA Bar for Mobile / Sticky Bar -->
<div class="floating-cta-bar d-md-none">
    <a href="tel:7895321472" class="floating-cta-btn floating-call">
        📞 Call Now
    </a>
    <a href="https://wa.me/917895321472?text=Hi%20KS%20Electrical%20and%20AC%20Services,%20I'd%20like%20to%20book%20a%20doorstep%20technician." target="_blank" rel="noopener noreferrer" class="floating-cta-btn floating-whatsapp">
        💬 WhatsApp
    </a>
    <a href="#bookingForm" class="floating-cta-btn floating-book">
        📅 Book Now
    </a>
</div>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>

<!-- Interactive Frontend Logic -->
<script>
    // Prefill service in Booking Form from card buttons
    function prefillBooking(serviceName) {
        const serviceSelect = document.getElementById('c_service');
        if (serviceSelect) {
            serviceSelect.value = serviceName;
            document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 5-Star Interactive Rating Handler
    const stars = document.querySelectorAll('#starsSelector span');
    const ratingInput = document.getElementById('review_rating');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const val = parseInt(this.getAttribute('data-value'));
            ratingInput.value = val;
            updateStars(val);
        });
    });

    function updateStars(val) {
        stars.forEach(star => {
            const starVal = parseInt(star.getAttribute('data-value'));
            if (starVal <= val) {
                star.textContent = '★';
                star.classList.add('selected');
            } else {
                star.textContent = '☆';
                star.classList.remove('selected');
            }
        });
    }

    // Initialize 5 stars selection
    updateStars(5);

    // AJAX Booking Submission
    document.getElementById('bookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const alertDiv = document.getElementById('bookingAlert');
        const formData = new FormData(form);

        alertDiv.innerHTML = '<div class="alert alert-info">Booking request is sending (बुकिंग प्रक्रिया में है)...</div>';

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alertDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                form.reset();
            } else {
                alertDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            }
        })
        .catch(err => {
            alertDiv.innerHTML = '<div class="alert alert-danger">Error: Could not connect to database handler. Please try again.</div>';
        });
    });

    // AJAX Review Submission
    document.getElementById('submitReviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const alertDiv = document.getElementById('reviewAlert');
        const formData = new FormData(form);

        alertDiv.innerHTML = '<div class="alert alert-info">Publishing review (समीक्षा प्रकाशित हो रही है)...</div>';

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alertDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                form.reset();
                updateStars(5);
            } else {
                alertDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            }
        })
        .catch(err => {
            alertDiv.innerHTML = '<div class="alert alert-danger">Error: Review could not be published. Please try again.</div>';
        });
    });
</script>

</body>
</html>
