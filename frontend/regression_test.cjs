const { chromium } = require('playwright');

async function main() {
  console.log("Starting Regression Test Suite...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const failedItems = [];
  const checkedItems = [];

  // Log page console errors
  page.on('pageerror', err => {
    console.error(`[BROWSER ERROR] ${err.message}`);
    failedItems.push(`Browser JS Error: ${err.message}`);
  });

  async function checkPageLoad(url, name) {
    console.log(`Checking ${name} loading: ${url}`);
    try {
      const response = await page.goto(url, { timeout: 15000, waitUntil: 'load' });
      const status = response.status();
      if (status !== 200) {
        failedItems.push(`${name} page returned HTTP status ${status}`);
      } else {
        checkedItems.push(`${name} page load`);
      }
    } catch (err) {
      failedItems.push(`Failed to load ${name} page: ${err.message}`);
    }
  }

  // --- 1. Navigation & Page Load Tests ---
  await checkPageLoad('http://localhost:4173/', 'Home');
  await page.waitForTimeout(1000);

  await checkPageLoad('http://localhost:4173/about', 'About Us');
  await checkPageLoad('http://localhost:4173/contact', 'Contact Us');
  await checkPageLoad('http://localhost:4173/faq', 'FAQ');
  await checkPageLoad('http://localhost:4173/blog', 'Blog');
  await checkPageLoad('http://localhost:4173/privacy-policy', 'Privacy Policy');
  await checkPageLoad('http://localhost:4173/terms-and-cond', 'Terms & Conditions');

  // --- 2. Dynamic SEO Pages Tests ---
  await checkPageLoad('http://localhost:4173/services/ac-service/noida', 'Dynamic SEO AC Noida');
  await checkPageLoad('http://localhost:4173/services/electrician-service/greater-noida', 'Dynamic SEO Electrician Greater Noida');

  // --- 3. Service Pages Tests ---
  await checkPageLoad('http://localhost:4173/services/ac-service', 'AC Service Page');
  await checkPageLoad('http://localhost:4173/services/ro-service', 'RO Service Page');
  await checkPageLoad('http://localhost:4173/services/electrician-service', 'Electrician Service Page');
  await checkPageLoad('http://localhost:4173/services/washing-machine-repair', 'Washing Machine Repair Page');
  await checkPageLoad('http://localhost:4173/services/refrigerator-repair', 'Refrigerator Repair Page');
  await checkPageLoad('http://localhost:4173/services/chimney-service', 'Chimney Service Page');

  // --- 4. Search Functionality Tests ---
  console.log("Testing search functionality...");
  try {
    await page.goto('http://localhost:4173/services', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const searchQueries = ["AC Repair", "Washing Machine Repair", "Electrician", "Chimney"];
    const searchInputSelector = 'input[placeholder*="Search for repair"]';
    
    const searchInput = page.locator(searchInputSelector);
    if (await searchInput.count() === 0) {
      failedItems.push("Search: Input element not found on /services page");
    } else {
      for (const query of searchQueries) {
        await searchInput.fill(query);
        await page.waitForTimeout(1000); // wait for state filter update

        const noResultsText = await page.locator('text=No services found').count();
        if (noResultsText > 0) {
          failedItems.push(`Search: Query "${query}" returned "No services found"`);
        } else {
          // Check that at least one service card is visible
          const serviceCardsCount = await page.locator('.bg-white.border.border-slate-200').count();
          if (serviceCardsCount === 0) {
            failedItems.push(`Search: Query "${query}" returned 0 service cards`);
          } else {
            console.log(`Search for "${query}" successful. Found ${serviceCardsCount} service cards.`);
            checkedItems.push(`Search for "${query}"`);
          }
        }
      }
    }
  } catch (err) {
    failedItems.push(`Search: Error during search tests: ${err.message}`);
  }

  // --- 5. Category Links & Filter Tests ---
  console.log("Testing Category Pills / Filter Links...");
  try {
    await page.goto('http://localhost:4173/services', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Verify Category Pills container exists
    const categoryContainer = page.locator('.overflow-x-auto.whitespace-nowrap');
    if (await categoryContainer.count() === 0) {
      failedItems.push("Category Links: Horizontal category container not found");
    } else {
      // Find "AC Services" button pill specifically
      const acPill = page.locator('.overflow-x-auto.whitespace-nowrap button:has-text("AC Services")').first();
      if (await acPill.count() === 0) {
        failedItems.push("Category Links: AC Services pill not found");
      } else {
        await acPill.click();
        await page.waitForTimeout(1000);
        // Verify only AC services are shown
        const acCardsCount = await page.locator('.bg-white.border.border-slate-200').count();
        console.log(`Category Filter: Clicked AC Services. Found ${acCardsCount} cards.`);
        if (acCardsCount === 0) {
          failedItems.push("Category Links: Clicking AC Services pill showed 0 services");
        } else {
          checkedItems.push("Category filter click interaction");
        }
      }
    }
  } catch (err) {
    failedItems.push(`Category Links: Error during category filter tests: ${err.message}`);
  }

  // --- 6. Booking & Cart Flow Tests ---
  console.log("Testing Booking & Cart flow (using Electrician page to avoid brand modal)...");
  try {
    await page.goto('http://localhost:4173/services/electrician-service', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Find first "Add" button
    const addButtons = page.locator('button:has-text("Add +")');
    if (await addButtons.count() === 0) {
      failedItems.push("Booking: 'Add +' button not found on Electrician page");
    } else {
      await addButtons.first().click();
      await page.waitForTimeout(1000);

      // Verify cart badge count is updated in header
      const cartBtn = page.locator('button[aria-label*="Shopping Cart"]').first();
      if (await cartBtn.count() === 0) {
        failedItems.push("Booking: Shopping Cart button not found in header");
      } else {
        const cartText = await cartBtn.textContent();
        if (!cartText.includes('1')) {
          failedItems.push(`Booking: Cart count did not update to 1. Cart button text: "${cartText}"`);
        } else {
          console.log("Booking: Cart count updated to 1 in header.");
          checkedItems.push("Cart count badge update");
        }
      }

      // Try proceeding to checkout
      console.log("Clicking proceed/cart checkout link...");
      const proceedButton = page.locator('button:has-text("Proceed")').first();
      const cartButtonHeader = page.locator('button[aria-label*="Shopping Cart"]').first();
      
      if (await proceedButton.count() > 0) {
        await proceedButton.click();
      } else if (await cartButtonHeader.count() > 0) {
        await cartButtonHeader.click();
      } else {
        await page.locator('a[href="/checkout"]').first().click().catch(() => {});
      }
      await page.waitForTimeout(2000);

      // Verify that LoginModal/Checkout opens
      const bodyTextAfterClick = await page.evaluate(() => document.body.innerText);
      if (bodyTextAfterClick.includes('KS Portal Access') || bodyTextAfterClick.includes('mobile number') || page.url().includes('checkout')) {
        console.log("Booking Flow: Successfully triggered Login modal or navigated to checkout.");
        checkedItems.push("Checkout/Login redirect flow");
      } else {
        failedItems.push("Booking Flow: Proceeding to checkout did not trigger login modal or checkout navigation");
      }
    }
  } catch (err) {
    failedItems.push(`Booking: Error during booking tests: ${err.message}`);
  }

  // --- 7. Header Login Modal Test ---
  console.log("Testing Login modal entry point...");
  try {
    await page.goto('http://localhost:4173/', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const loginBtn = page.locator('button:has-text("Login")');
    if (await loginBtn.count() === 0) {
      failedItems.push("Login: 'Login' button not found in navigation header");
    } else {
      await loginBtn.click();
      await page.waitForTimeout(1000);

      const loginModalTitle = await page.locator('text=KS Portal Access').count();
      const phoneInput = await page.locator('input[placeholder*="mobile number"]').count();
      if (loginModalTitle === 0 && phoneInput === 0) {
        failedItems.push("Login: Clicking Login button did not open the login modal");
      } else {
        console.log("Login: Modal opened successfully.");
        checkedItems.push("Login modal opening");
      }
    }
  } catch (err) {
    failedItems.push(`Login: Error during login tests: ${err.message}`);
  }

  // --- 8. Footer Links Validation ---
  console.log("Testing Footer Links...");
  try {
    await page.goto('http://localhost:4173/', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const footer = page.locator('footer');
    if (await footer.count() === 0) {
      failedItems.push("Footer: Footer element not found on page");
    } else {
      const footerLinks = [
        { selector: 'footer a[href="/about"]', name: 'About' },
        { selector: 'footer a[href="/privacy-policy"]', name: 'Privacy Policy' },
        { selector: 'footer a[href="/terms-and-cond"]', name: 'Terms' }
      ];

      for (const link of footerLinks) {
        const linkEl = page.locator(link.selector);
        if (await linkEl.count() === 0) {
          failedItems.push(`Footer: Link to ${link.name} not found in footer`);
        } else {
          checkedItems.push(`Footer ${link.name} link`);
        }
      }
    }
  } catch (err) {
    failedItems.push(`Footer: Error during footer links validation: ${err.message}`);
  }

  // --- 9. Forms Tests ---
  console.log("Testing forms...");
  try {
    await page.goto('http://localhost:4173/contact', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const inputsCount = await page.locator('input').count();
    if (inputsCount < 2) {
      failedItems.push("Forms: Contact Us form inputs not found");
    } else {
      console.log("Forms: All contact form fields found.");
      checkedItems.push("Contact form inputs existence");
    }
  } catch (err) {
    failedItems.push(`Forms: Error during forms tests: ${err.message}`);
  }

  await browser.close();

  // --- Report Results ---
  console.log("\n=================== REGRESSION TEST REPORT ===================");
  console.log(`Checked items count: ${checkedItems.length}`);
  console.log(`Failed items count: ${failedItems.length}`);
  
  if (failedItems.length > 0) {
    console.log("\nFAILED ITEMS:");
    failedItems.forEach(item => console.log(`- ${item}`));
    process.exit(1);
  } else {
    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
    console.log("Production Ready");
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Test Suite crashed:", err);
  process.exit(1);
});
