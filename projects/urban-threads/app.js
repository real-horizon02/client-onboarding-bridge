/* ============================================================
   Urban Threads â€” prototype interactions
   Demo only: no network requests, no storage, no real accounts.
   ============================================================ */

const PRODUCTS = [
  {
    id: "p1", name: "Everyday Cotton Tee", category: "T-shirts", gender: "Unisex",
    price: 899, mrp: 1199, rating: 4.4, reviews: 218, badge: "New", arrived: 9,
    tone: "#ece5d8", tone2: "#d9cdb7", garment: "#2e3a4b", symbol: "g-tee",
    fabric: "100% combed cotton, 180 GSM", fit: "Relaxed unisex fit",
    desc: "The tee we build everything around. Mid-weight cotton, a clean neckline and a body that keeps its shape wash after wash.",
    stock: 120, status: "Live", sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p2", name: "Linen Overshirt", category: "Shirts", gender: "Men",
    price: 2499, mrp: 3299, rating: 4.6, reviews: 146, badge: "Bestseller", arrived: 6,
    tone: "#e6ded0", tone2: "#d2c3aa", garment: "#6e7a63", symbol: "g-shirt",
    fabric: "European linen-cotton blend", fit: "Easy overshirt fit",
    desc: "A layer for every season. Washed linen that softens with wear, cut long enough to wear open over a tee.",
    stock: 48, status: "Live", sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "p3", name: "Relaxed Chinos", category: "Bottoms", gender: "Men",
    price: 1999, mrp: 2499, rating: 4.3, reviews: 94, badge: null, arrived: 3,
    tone: "#e0e0d5", tone2: "#c8c9b9", garment: "#7a6a52", symbol: "g-trousers",
    fabric: "Cotton twill with 2% stretch", fit: "Straight, mid-rise",
    desc: "Chinos that move with a working day â€” structured enough for the office, soft enough for the commute home.",
    stock: 76, status: "Live", sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: "p4", name: "Slub Cotton Kurta", category: "Indian wear", gender: "Women",
    price: 1799, mrp: 2299, rating: 4.7, reviews: 312, badge: "Bestseller", arrived: 5,
    tone: "#efe0d6", tone2: "#dcc2b0", garment: "#a6482c", symbol: "g-kurta",
    fabric: "Handloom slub cotton", fit: "Straight, knee length",
    desc: "A quietly modern kurta in textured handloom cotton. Side slits, a clean placket and pockets that actually hold a phone.",
    stock: 62, status: "Live", sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p5", name: "Midi Wrap Dress", category: "Dresses", gender: "Women",
    price: 2899, mrp: 3499, rating: 4.5, reviews: 128, badge: "New", arrived: 10,
    tone: "#f0e2d8", tone2: "#dabfae", garment: "#b9795e", symbol: "g-dress",
    fabric: "Cupro-modal blend", fit: "Wrap silhouette, midi length",
    desc: "Fluid, forgiving and finished with a self-tie waist. Dressed up with sandals or down with white sneakers.",
    stock: 34, status: "Live", sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p6", name: "Heavyweight Hoodie", category: "Sweatshirts", gender: "Unisex",
    price: 2199, mrp: 2799, rating: 4.6, reviews: 402, badge: "New", arrived: 11,
    tone: "#e3e3da", tone2: "#c9ccbf", garment: "#4f5747", symbol: "g-hoodie",
    fabric: "400 GSM brushed cotton fleece", fit: "Oversized, dropped shoulder",
    desc: "Built for early flights and late nights. Heavy fleece, a double-layer hood and a kangaroo pocket with depth.",
    stock: 58, status: "Live", sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "p7", name: "Cropped Utility Jacket", category: "Outerwear", gender: "Women",
    price: 3299, mrp: 3999, rating: 4.2, reviews: 67, badge: null, arrived: 7,
    tone: "#e6ddd1", tone2: "#d1c1ab", garment: "#8e6a4a", symbol: "g-jacket",
    fabric: "Cotton canvas, garment washed", fit: "Cropped, boxy",
    desc: "A short utility jacket with four flat pockets and a softened canvas finish. Works over dresses and denim alike.",
    stock: 22, status: "Live", sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "p8", name: "Pleated Wide-Leg Trousers", category: "Bottoms", gender: "Women",
    price: 2199, mrp: 2799, rating: 4.4, reviews: 156, badge: null, arrived: 4,
    tone: "#e9e3da", tone2: "#d2c8b6", garment: "#2e3a4b", symbol: "g-trousers",
    fabric: "Tencel-cotton blend", fit: "High-rise, wide leg",
    desc: "Tailored ease. A single front pleat and a fluid drape that reads polished without feeling formal.",
    stock: 41, status: "Live", sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p9", name: "Classic Crew Sweatshirt", category: "Sweatshirts", gender: "Men",
    price: 1599, mrp: 1999, rating: 4.3, reviews: 188, badge: null, arrived: 2,
    tone: "#e9e4da", tone2: "#d5cbb9", garment: "#6e6355", symbol: "g-sweatshirt",
    fabric: "320 GSM loopback cotton", fit: "Regular fit",
    desc: "A crew that holds its collar and its colour. Loopback cotton with ribbed trims, in a palette that layers easily.",
    stock: 88, status: "Draft", sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "p10", name: "Oxford Shirt", category: "Shirts", gender: "Men",
    price: 2299, mrp: 2899, rating: 4.4, reviews: 112, badge: null, arrived: 1,
    tone: "#e7e6df", tone2: "#cfcec2", garment: "#d9d2c4", symbol: "g-shirt",
    fabric: "Cotton oxford weave", fit: "Regular, button-down collar",
    desc: "The dependable one. A soft-washed oxford with a button-down collar that looks right with chinos and with denim.",
    stock: 54, status: "Live", sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "p11", name: "Boxy Linen Shirt", category: "Shirts", gender: "Women",
    price: 2399, mrp: 2999, rating: 4.5, reviews: 73, badge: "New", arrived: 8,
    tone: "#e8e4dc", tone2: "#d2cbbb", garment: "#9aa189", symbol: "g-shirt",
    fabric: "100% washed linen", fit: "Boxy, cropped",
    desc: "An airy linen shirt with a boxy line and dropped shoulder. Wear it buttoned, open or half-tucked.",
    stock: 31, status: "Live", sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p12", name: "Handloom Cotton Saree", category: "Indian wear", gender: "Women",
    price: 3499, mrp: 4299, rating: 4.8, reviews: 96, badge: "Limited", arrived: 6,
    tone: "#ece1d5", tone2: "#d8c2ab", garment: "#8e3b2a", symbol: "g-kurta",
    fabric: "Handloom cotton, zari border", fit: "6.5m with unstitched blouse",
    desc: "A featherlight handloom saree with a fine zari border, woven in limited runs by a co-operative in Andhra Pradesh.",
    stock: 14, status: "Draft", sizes: ["Free size"]
  }
];

/* ---------- Utilities ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const inr = (n) => "\u20B9" + Number(n).toLocaleString("en-IN");

const state = {
  filter: { gender: "All", category: "All", max: 4999, sort: "featured" },
  adminQuery: "",
  products: PRODUCTS.map((p) => ({ ...p, sizes: [...p.sizes] }))
};

let lastFocused = null;
let toastTimer = null;

/* ---------- Routing ---------- */

const VIEWS = ["home", "shop", "login", "admin", "contact"];

function currentView() {
  const hash = (location.hash || "").replace(/^#\/?/, "").split("?")[0];
  return VIEWS.includes(hash) ? hash : "home";
}

function renderRoute() {
  const view = currentView();
  $$("[data-view]").forEach((el) => {
    el.hidden = el.dataset.view !== view;
  });

  $$(".nav__link[data-nav]").forEach((el) => {
    const active = el.dataset.nav === view;
    el.classList.toggle("is-active", active);
    if (active) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });

  if (view === "shop") renderShop();
  if (view === "admin") renderAdmin();
  if (view === "login") $("#login-email")?.focus({ preventScroll: true });

  window.scrollTo(0, 0);
  closeNav();
  document.title = "Urban Threads â€” " + ({
    home: "Everyday essentials, cut with intent",
    shop: "The collection",
    login: "Sign in",
    admin: "Admin preview",
    contact: "Contact"
  }[view] || "Urban Threads");
}

window.addEventListener("hashchange", renderRoute);

function goTo(view) {
  if (currentView() === view) renderRoute();
  else location.hash = "#/" + view;
}

/* ---------- Product rendering ---------- */

function productCard(p) {
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const badge = p.badge
    ? `<span class="product__badge ${p.badge === "Limited" ? "product__badge--soft" : ""}">${p.badge}</span>`
    : "";
  return `
    <article class="product">
      <div class="product__media" style="--tone:${p.tone};--tone-2:${p.tone2};--garment:${p.garment}">
        ${badge}
        <svg class="product__garment" aria-hidden="true"><use href="#${p.symbol}"/></svg>
        <button class="product__quick" type="button" data-quick-view="${p.id}">Quick view</button>
      </div>
      <div class="product__body">
        <p class="product__eyebrow">${p.gender} &middot; ${p.category}</p>
        <h3 class="product__name">${p.name}</h3>
        <p class="product__price">${inr(p.price)} <s>${inr(p.mrp)}</s> <span class="product__off">${off}% off</span></p>
        <p class="product__rating"><b>&#9733; ${p.rating}</b> <span>(${p.reviews})</span></p>
      </div>
    </article>`;
}

function renderHomeGrids() {
  const live = state.products.filter((p) => p.status === "Live");
  const featured = live.filter((p) => p.badge === "Bestseller" || p.badge === "New").slice(0, 4);
  const featuredGrid = $("[data-featured-grid]");
  const newGrid = $("[data-new-grid]");
  if (featuredGrid) featuredGrid.innerHTML = featured.map(productCard).join("");
  if (newGrid) {
    const newest = [...live].sort((a, b) => b.arrived - a.arrived).slice(0, 4);
    newGrid.innerHTML = newest.map(productCard).join("");
  }
}

function applyFilters(list) {
  const f = state.filter;
  let out = list.filter((p) => {
    if (f.gender !== "All" && p.gender !== f.gender) return false;
    if (f.category !== "All" && p.category !== f.category) return false;
    if (p.price > f.max) return false;
    return true;
  });
  if (f.sort === "low") out.sort((a, b) => a.price - b.price);
  else if (f.sort === "high") out.sort((a, b) => b.price - a.price);
  else if (f.sort === "new") out.sort((a, b) => b.arrived - a.arrived);
  else out.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
  return out;
}

function renderShop() {
  const grid = $("[data-shop-grid]");
  if (!grid) return;
  const live = state.products.filter((p) => p.status === "Live");
  const items = applyFilters(live);
  grid.innerHTML = items.map(productCard).join("");
  $("[data-count]").textContent = `Showing ${items.length} of ${live.length} styles`;
  $("[data-empty]").hidden = items.length > 0;
  grid.hidden = items.length === 0;

  $$("[data-filter-gender] .chip").forEach((chip) => {
    const active = chip.dataset.value === state.filter.gender;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  $$("[data-filter-category] button").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.value === state.filter.category);
  });
  $("[data-price-range]").value = state.filter.max;
  $("[data-price-out]").textContent = inr(state.filter.max);
  $("[data-sort-select]").value = state.filter.sort;
  syncFilters();
}

function syncCategoryCounts() {
  const wrap = $("[data-filter-category]");
  if (!wrap) return;
  const live = state.products.filter((p) => p.status === "Live");
  $$("button", wrap).forEach((btn) => {
    const v = btn.dataset.value;
    const count = v === "All"
      ? live.length
      : live.filter((p) => p.category === v).length;
    const span = btn.querySelector("span");
    if (span) span.textContent = count;
  });
}

/* ---------- Quick view ---------- */

const productModal = $("[data-product-modal]");

function openQuickView(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  $("[data-qv-media]").style.cssText = `--tone:${p.tone};--tone-2:${p.tone2}`;
  $("[data-qv-svg]").style.setProperty("--garment", p.garment);
  $("[data-qv-svg] use").setAttribute("href", "#" + p.symbol);
  $("[data-qv-eyebrow]").textContent = `${p.gender} Â· ${p.category}`;
  $("[data-qv-name]").textContent = p.name;
  $("[data-qv-price]").innerHTML = `${inr(p.price)} <s>${inr(p.mrp)}</s> <span class="product__off">${off}% off</span>`;
  $("[data-qv-desc]").textContent = p.desc;
  $("[data-qv-fabric]").textContent = p.fabric;
  $("[data-qv-fit]").textContent = p.fit;
  $("[data-qv-sizes]").innerHTML = p.sizes
    .map((s) => `<button class="size" type="button">${s}</button>`)
    .join("");
  $$("[data-qv-sizes] .size").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("[data-qv-sizes] .size").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  openModal(productModal, "[data-close-modal]");
}

function openModal(modal, closeSel) {
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("is-locked");
  const focusTarget = modal.querySelector(closeSel) || modal.querySelector("button");
  setTimeout(() => focusTarget?.focus(), 30);
}

function closeModal(modal) {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  if ($("[data-product-modal]").hidden && $("[data-admin-modal]").hidden) {
    document.body.classList.remove("is-locked");
    lastFocused?.focus?.();
  }
}

/* ---------- Admin ---------- */

const adminModal = $("[data-admin-modal]");
const adminForm = $("[data-product-form]");

function renderAdmin() {
  const body = $("[data-admin-rows]");
  if (!body) return;
  const q = state.adminQuery.trim().toLowerCase();
  const rows = state.products.filter((p) =>
    !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  body.innerHTML = rows.map((p) => {
    const stockPill = p.stock === 0
      ? `<span class="pill pill--low">Out of stock</span>`
      : p.stock < 20
        ? `<span class="pill pill--low">${p.stock} left</span>`
        : p.stock;
    return `
      <tr>
        <td>
          <div class="table__product">
            <span class="table__thumb" style="--tone:${p.tone};--tone-2:${p.tone2};--garment:${p.garment}">
              <svg aria-hidden="true"><use href="#${p.symbol}"/></svg>
            </span>
            <div>
              <div class="table__name">${p.name}</div>
              <div class="table__meta">${p.gender} &middot; ${p.id.toUpperCase()}</div>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td class="table__price">${inr(p.price)}</td>
        <td>${stockPill}</td>
        <td><span class="pill ${p.status === "Live" ? "pill--live" : "pill--draft"}">${p.status}</span></td>
        <td>
          <div class="table__actions">
            <button type="button" data-edit="${p.id}">Edit</button>
            <button type="button" data-delete="${p.id}">Delete</button>
          </div>
        </td>
      </tr>`;
  }).join("");

  $("[data-admin-empty]").hidden = rows.length > 0;
  $(".table-wrap").hidden = rows.length === 0;

  const live = state.products.filter((p) => p.status === "Live").length;
  const draft = state.products.filter((p) => p.status === "Draft").length;
  const liveEl = $('[data-stat="live"]');
  const draftEl = $('[data-stat="draft"]');
  if (liveEl) liveEl.textContent = live;
  if (draftEl) draftEl.textContent = draft;

  syncCategoryCounts();
}

function openProductForm(id) {
  const isEdit = Boolean(id);
  const p = isEdit ? state.products.find((x) => x.id === id) : null;
  adminForm.reset();
  adminForm.elements.id.value = isEdit ? id : "";
  $("[data-admin-modal-title]").textContent = isEdit ? "Edit product" : "New product";
  $("[data-product-submit]").textContent = isEdit ? "Save changes" : "Create product";

  if (p) {
    adminForm.elements.name.value = p.name;
    adminForm.elements.category.value = p.category;
    adminForm.elements.price.value = p.price;
    adminForm.elements.stock.value = p.stock;
    adminForm.elements.status.value = p.status;
    adminForm.elements.description.value = p.desc;
  }
  openModal(adminModal, "[data-close-admin]");
  setTimeout(() => adminForm.elements.name.focus(), 60);
}

const PALETTE = [
  { tone: "#ece5d8", tone2: "#d9cdb7", garment: "#6e7a63" },
  { tone: "#e6ded0", tone2: "#d2c3aa", garment: "#a6482c" },
  { tone: "#e3e3da", tone2: "#c9ccbf", garment: "#2e3a4b" },
  { tone: "#efe0d6", tone2: "#dcc2b0", garment: "#b9795e" }
];

function handleProductSubmit(e) {
  e.preventDefault();
  const f = adminForm.elements;
  const name = f.name.value.trim();
  const price = Number(f.price.value);
  if (!name || !Number.isFinite(price) || price <= 0) {
    showToast("Add a product name and a valid price.");
    (!name ? f.name : f.price).focus();
    return;
  }

  const id = f.id.value;
  if (id) {
    const p = state.products.find((x) => x.id === id);
    if (p) {
      p.name = name;
      p.category = f.category.value;
      p.price = price;
      p.mrp = Math.round(price * 1.25);
      p.stock = Number(f.stock.value) || 0;
      p.status = f.status.value;
      p.desc = f.description.value.trim() || p.desc;
      showToast(`â€œ${name}â€ updated.`);
    }
  } else {
    const swatch = PALETTE[state.products.length % PALETTE.length];
    const category = f.category.value;
    state.products.unshift({
      id: "p" + Date.now(),
      name,
      category,
      gender: "Unisex",
      price,
      mrp: Math.round(price * 1.25),
      rating: 4.5,
      reviews: 0,
      badge: "New",
      arrived: 99,
      ...swatch,
      symbol: category === "Bottoms" ? "g-trousers"
        : category === "Dresses" || category === "Indian wear" ? "g-dress"
        : category === "Sweatshirts" ? "g-sweatshirt"
        : category === "Outerwear" ? "g-jacket"
        : "g-shirt",
      fabric: "Cotton blend",
      fit: "Regular fit",
      desc: f.description.value.trim() || "New addition to the SS26 collection.",
      stock: Number(f.stock.value) || 0,
      status: f.status.value,
      sizes: ["S", "M", "L", "XL"]
    });
    showToast(`â€œ${name}â€ created in the catalogue.`);
  }

  closeModal(adminModal);
  renderAdmin();
  renderHomeGrids();
}

function deleteProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const ok = window.confirm(`Delete â€œ${p.name}â€ from the catalogue?\n\nDemo only â€” refresh restores the sample data.`);
  if (!ok) return;
  state.products = state.products.filter((x) => x.id !== id);
  renderAdmin();
  renderHomeGrids();
  showToast(`â€œ${p.name}â€ deleted.`);
}

/* ---------- Toast ---------- */

function showToast(msg) {
  const el = $("[data-toast]");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
}

/* ---------- Mobile nav ---------- */

const nav = $("#primary-nav");
const navToggle = $("[data-nav-toggle]");

function closeNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

/* ---------- Mobile filter panel ---------- */

const filtersPanel = $("#shop-filters");
const filtersToggle = $("[data-filters-toggle]");
let filtersTouched = false;

function syncFilters() {
  if (!filtersPanel || !filtersToggle) return;
  const compact = window.matchMedia("(max-width: 960px)").matches;
  filtersToggle.hidden = !compact;
  if (!compact) {
    filtersPanel.hidden = false;
    return;
  }
  if (!filtersTouched) filtersPanel.hidden = true;
  filtersToggle.textContent = filtersPanel.hidden ? "Filters" : "Hide filters";
  filtersToggle.setAttribute("aria-expanded", String(!filtersPanel.hidden));
}

filtersToggle?.addEventListener("click", () => {
  filtersTouched = true;
  filtersPanel.hidden = !filtersPanel.hidden;
  filtersToggle.textContent = filtersPanel.hidden ? "Filters" : "Hide filters";
  filtersToggle.setAttribute("aria-expanded", String(!filtersPanel.hidden));
});

window.addEventListener("resize", syncFilters);

/* ---------- Global click handling ---------- */

document.addEventListener("click", (e) => {
  const t = e.target;

  const quick = t.closest("[data-quick-view]");
  if (quick) return openQuickView(quick.dataset.quickView);

  if (t.closest("[data-new-product]")) return openProductForm();

  const editBtn = t.closest("[data-edit]");
  if (editBtn) return openProductForm(editBtn.dataset.edit);

  const delBtn = t.closest("[data-delete]");
  if (delBtn) return deleteProduct(delBtn.dataset.delete);

  if (t.closest("[data-close-modal]")) return closeModal(productModal);
  if (t.closest("[data-close-admin]")) return closeModal(adminModal);

  const genderLink = t.closest("[data-gender]");
  if (genderLink) {
    e.preventDefault();
    state.filter.gender = genderLink.dataset.gender;
    state.filter.category = "All";
    state.filter.max = 4999;
    goTo("shop");
    return;
  }

  const sortLink = t.closest("[data-sort]");
  if (sortLink) {
    e.preventDefault();
    state.filter.sort = sortLink.dataset.sort;
    goTo("shop");
    return;
  }

  const demoLink = t.closest("[data-demo-link]");
  if (demoLink) {
    e.preventDefault();
    showToast("Demo link â€” this screen is a visual prototype.");
    return;
  }

  if (t.closest("[data-reset-filters]")) {
    state.filter = { gender: "All", category: "All", max: 4999, sort: "featured" };
    renderShop();
    return;
  }

  if (t.closest("[data-toggle-password]")) {
    const input = $("#login-password");
    const btn = t.closest("[data-toggle-password]");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Hide" : "Show";
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    return;
  }
});

/* ---------- Inputs ---------- */

document.addEventListener("input", (e) => {
  const t = e.target;

  if (t.matches("[data-price-range]")) {
    state.filter.max = Number(t.value);
    $("[data-price-out]").textContent = inr(state.filter.max);
    renderShop();
  }

  if (t.matches("[data-admin-search]")) {
    state.adminQuery = t.value;
    renderAdmin();
  }
});

document.addEventListener("change", (e) => {
  if (e.target.matches("[data-sort-select]")) {
    state.filter.sort = e.target.value;
    renderShop();
  }
});

document.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-filter-gender] .chip");
  if (chip) {
    state.filter.gender = chip.dataset.value;
    renderShop();
  }
  const cat = e.target.closest("[data-filter-category] button");
  if (cat) {
    state.filter.category = cat.dataset.value;
    renderShop();
  }
});

/* ---------- Forms ---------- */

$("[data-login-form]")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#login-email").value.trim();
  const pw = $("#login-password").value.trim();
  if (!email || !pw) {
    showToast("Enter any email and password to preview.");
    (!email ? $("#login-email") : $("#login-password")).focus();
    return;
  }
  showToast(`Signed in as ${email.replace(/@.*/, "")} (demo).`);
  location.hash = "#/";
});

$("[data-contact-form]")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const success = $("[data-contact-success]");
  success.hidden = false;
  showToast("Demo form â€” nothing was sent.");
  success.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

adminForm?.addEventListener("submit", handleProductSubmit);

/* ---------- Keyboard ---------- */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(productModal);
    closeModal(adminModal);
    closeNav();
  }

  if (e.key !== "Tab") return;
  const modal = [productModal, adminModal].find((m) => m && !m.hidden);
  if (!modal) return;
  const focusables = $$(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    modal
  ).filter((el) => !el.disabled && el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ---------- Header scroll ---------- */

const header = $("[data-header]");
function onScroll() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Init ---------- */

renderHomeGrids();
syncCategoryCounts();
renderRoute();
