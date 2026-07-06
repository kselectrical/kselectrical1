<?php
// search_widget.php - Global Customer Care Phone Search Widget
?>
<div id="globalSearchWidget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; align-items: center; gap: 10px; font-family: sans-serif;">
    <!-- Search Input Panel (hidden by default) -->
    <div id="globalSearchInputPanel" style="display: none; background: white; border: 1.5px solid var(--primary); border-radius: 25px; padding: 4px 8px 4px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); align-items: center; gap: 8px; animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
        <span style="font-size: 13px; font-weight: bold; color: #64748b;">+91</span>
        <input type="tel" id="globalSearchPhoneInput" placeholder="Search phone number..." maxlength="10" 
               style="border: none; outline: none; font-size: 13px; font-weight: 700; width: 170px; color: #0f172a; background: transparent;"
               onkeydown="if(event.key === 'Enter') triggerGlobalSearch()">
        <button onclick="triggerGlobalSearch()" 
                style="background: var(--primary); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: bold; transition: all 0.2s;"
                onmouseover="this.style.background='#0274b3'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='var(--primary)'; this.style.transform='scale(1)';">
            ➔
        </button>
    </div>

    <!-- Toggle Button -->
    <button id="globalSearchToggleButton" onclick="toggleGlobalSearchPanel()" 
            style="background: var(--primary); color: white; border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-size: 18px;"
            onmouseover="this.style.transform='scale(1.1)';" onmouseout="this.style.transform='scale(1)';" title="Customer Care Lookup">
        🔍
    </button>
</div>

<style>
@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(30px) scale(0.9); }
    to { opacity: 1; transform: translateX(0) scale(1); }
}
</style>

<script>
function toggleGlobalSearchPanel() {
    const panel = document.getElementById('globalSearchInputPanel');
    const btn = document.getElementById('globalSearchToggleButton');
    const input = document.getElementById('globalSearchPhoneInput');
    
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'flex';
        btn.innerHTML = '✖';
        btn.style.background = '#ef4444'; // Red background for close button
        btn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
        input.focus();
    } else {
        panel.style.display = 'none';
        btn.innerHTML = '🔍';
        btn.style.background = 'var(--primary)';
        btn.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.3)';
    }
}

function triggerGlobalSearch() {
    const inputVal = document.getElementById('globalSearchPhoneInput').value.trim().replace(/\D/g, '');
    if (inputVal.length !== 10) {
        alert("Please enter a valid 10-digit mobile number (केवल 10 अंकों का मोबाइल नंबर दर्ज करें)");
        return;
    }
    
    // Check if showCustomerByPhone function is available globally on this page (which is in customers.php)
    if (typeof showCustomerByPhone === 'function') {
        showCustomerByPhone(inputVal);
        toggleGlobalSearchPanel();
        document.getElementById('globalSearchPhoneInput').value = '';
    } else {
        // Redirect to customers.php with search_phone query
        window.location.href = "customers.php?search_phone=" + inputVal;
    }
}
</script>
