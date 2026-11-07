# Urban Threads — Test Results & Audit Log

> **Date of testing:** 2026-11-08  
> **Tester:** Lead Frontend Engineer  
> **Environment:** Chromium (Playwright headless / Chrome 125+ equivalent), Windows 11  
> **Status at handoff:** AWAITING PM REVIEW

---

## 1. Static Analysis & Lint

| Check | Tool / Method | Result | Notes |
|-------|--------------|--------|-------|
| HTML validity | Manual DOM inspection | PASS | Valid HTML5, all tags closed, no duplicate IDs |
| CSS syntax | Manual CSS parse review | PASS | Valid CSS, CSS variables resolve, media queries match |
| JS syntax | Node `--check` syntax pass | PASS | Valid ES6+, no parse errors |
| Checksums | SHA-256 against source | PASS | Byte-identical copy before normalisation |

---

## 2. Responsive Layout Tests

| Viewport | Expected | Result | Notes |
|----------|----------|--------|-------|
| **1440px (Desktop)** | 4-col product grid, sticky header, full nav, side filters | PASS | No horizontal overflow |
| **1100px (Laptop)** | 3-col product grid, story section adapts | PASS | No horizontal overflow |
| **960px (Tablet)** | 2-col shop grid, filters collapse into button, admin side becomes top bar | PASS | No horizontal overflow |
| **760px (Mobile wide)** | Hamburger menu, full-width cards, bottom-sheet modal | PASS | No horizontal overflow |
| **390px (Mobile — iPhone 14/15/16)** | 2-col tight grid, sticky header compact, all text wraps, touch targets ≥44px | PASS | Tested against 390px specification |

---

## 3. Navigation & Routing Tests

| Test Case | Steps | Expected | Result |
|-----------|-------|----------|--------|
| Route: Home | Click Home or load `#/` | Home view shown, others hidden, title set | PASS |
| Route: Shop | Click Shop or load `#/shop` | Shop view shown, filters rendered, title set | PASS |
| Route: Sign in | Click Sign in or load `#/login` | Login view shown, email auto-focused | PASS |
| Route: Admin | Click Admin or load `#/admin` | Admin dashboard shown, stats live | PASS |
| Route: Contact | Click Contact or load `#/contact` | Contact form shown | PASS |
| Unknown hash | Load `#/unknown-route` | Falls back to Home gracefully | PASS |
| Deep link with filter | Click "Shop womenswear" from Home | Navigates to `#/shop` with Women pre-selected | PASS |

---

## 4. Product Filtering & Quick View Tests

| Test Case | Steps | Expected | Result |
|-----------|-------|----------|--------|
| Gender chips | Click "Women" chip | Only Women's products shown, count updates | PASS |
| Category list | Click "Shirts" in list | Only Shirts shown, active style applied | PASS |
| Price slider | Drag slider to ₹2,500 | Only products ≤ ₹2,500 shown, price display updates | PASS |
| Sort: low to high | Select "Price: low to high" | Products sorted ascending by price | PASS |
| Sort: high to low | Select "Price: high to low" | Products sorted descending by price | PASS |
| Sort: newest | Select "Newest" | Products sorted descending by `arrived` | PASS |
| Reset filters | Click "Clear filters" | All filters reset to defaults, full list shown | PASS |
| Empty state | Set impossible filter combination | Empty state message shown, Clear filters button visible | PASS |
| Quick view open | Click "Quick view" on product | Modal opens, correct garment SVG, title, price, fabric, sizes shown | PASS |
| Quick view close (×) | Click × button | Modal closes, body un-locks, focus restored | PASS |
| Quick view close (esc) | Press Escape | Modal closes | PASS |
| Quick view close (overlay) | Click backdrop | Modal closes | PASS |
| Quick view focus trap | Tab through modal | Focus cycles within modal, doesn't leak to background | PASS |
| Quick view size select | Click "M" | Size button gets `.is-active`, others deselected | PASS |

---

## 5. Demo Authentication Tests

| Test Case | Steps | Expected | Result |
|-----------|-------|----------|--------|
| Empty submit | Click Sign in with empty fields | Toast: "Enter any email and password to preview." Focuses email | PASS |
| Valid submit | Enter demo email + password → Submit | Toast: "Signed in as priya (demo)." Redirects to Home | PASS |
| Password toggle | Click "Show" | Input type becomes `text`, button says "Hide" | PASS |
| Password toggle back | Click "Hide" | Input type becomes `password`, button says "Show" | PASS |
| Demo links | Click "Forgot password?" or "Create account" | Toast: "Demo link — this screen is a visual prototype." | PASS |

---

## 6. Admin CRUD Tests (In-Memory)

| Test Case | Steps | Expected | Result |
|-----------|-------|----------|--------|
| Initial stats | Open Admin | Live = 10, Draft = 2 (matches 12 products) | PASS |
| Table render | Open Admin | 12 rows rendered with garment icons, prices, pills | PASS |
| Search filter | Type "kurta" in search | Only kurta rows shown | PASS |
| Empty search | Type "xyzxyz" in search | Table hidden, "No products match that search" shown | PASS |
| New product open | Click "+ New product" | Modal opens, title is "New product", fields empty | PASS |
| New product validate | Submit empty form | Toast: "Add a product name and a valid price." Form stays open | PASS |
| New product create | Enter name "Linen Trousers", price 2199 → Save | Product added to top of table, live stat increments, toast shown | PASS |
| Edit product open | Click Edit on any row | Modal opens, title is "Edit product", fields pre-filled | PASS |
| Edit product save | Change price to 999 → Save | Row price updates, toast shown | PASS |
| Delete product | Click Delete on any row → Confirm | Row removed, live stat decrements, toast shown | PASS |
| Delete product cancel | Click Delete → Cancel in confirm dialog | Row remains, no changes | PASS |
| Refresh behaviour | Refresh page after modifications | State resets to original 12 products (expected, documented) | PASS |

---

## 7. Contact Form & Keyboard Handling Tests

| Test Case | Steps | Expected | Result |
|-----------|-------|----------|--------|
| Form submit | Fill form → Click "Send enquiry" | Success message shown inline, toast shown, nothing sent | PASS |
| FAQ accordion | Click each FAQ summary | Expands/collapses with + rotating to × | PASS |
| Global Escape | Press Escape with mobile nav open | Nav closes | PASS |
| Skip link | Focus page, press Tab | "Skip to content" appears at top, activates `#main` | PASS |

---

## 8. Verified Bugs & Resolutions

| # | Bug | Severity | Status | Resolution |
|---|-----|----------|--------|------------|
| 1 | `Limited` badge had no specific style (`""` class assigned) | Low (visual) | FIXED | Set to `product__badge--soft` in `app.js` line 169 |
| 2 | CRLF line endings mixed with LF in original files | Trivial (git) | FIXED | Normalised all files to LF |
| 3 | `product__price s` and `.product__off` not wrapping on very narrow screens (≤320px) | Low (edge case) | FIXED | Added `flex-wrap: wrap` in 760px media query |

---

## 9. Limitations & Explicit Scope Exclusions

| Excluded Feature | Why Excluded |
|-----------------|--------------|
| Persistent storage (IndexedDB/localStorage) | Prototype resets intentionally on refresh — this is the agreed behaviour for review |
| Real authentication | Prohibited by project constraints; demo credentials only |
| Payment processing | Prohibited; prototype scope only |
| Email delivery | Contact form is a mock; displays inline confirmation only |
| Server-side rendering | Client-side only; static files |
| External images | Uses inline SVG icons for offline resilience |

---

## Sign-Off

**Frontend Lead:** Verified complete and working as specified.  
**Current Status:** AWAITING PM REVIEW.
