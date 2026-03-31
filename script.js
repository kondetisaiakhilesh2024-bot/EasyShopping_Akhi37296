/* =====================================================
   EasyShopping — script.js
   Handles:
     • Product data & table rendering
     • Search (live dropdown + table filter)
     • Category filter (filter buttons + category cards)
     • Add to Cart / Remove from Cart
     • Cart panel UI (badge, panel, total)
     • Customer Registration Form
   ===================================================== */

/* ─────────────────────────────────────────────────────
   1. PRODUCT DATA
   Each product: id, name, category, price, availability, image URL
───────────────────────────────────────────────────── */
const products = [
  // ── Beauty ──────────────────────────────────────────
  {
    id: 1,
    name: "Radiance Face Serum",
    category: "Beauty",
    price: 899,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&q=70"
  },
  {
    id: 2,
    name: "Matte Lipstick Collection",
    category: "Beauty",
    price: 349,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1631214503851-25e91851c34e?w=80&q=70"
  },
  {
    id: 3,
    name: "Sunscreen SPF 50+",
    category: "Beauty",
    price: 499,
    availability: "Out of Stock",
    img: "https://images.unsplash.com/photo-1625093944978-ba36ccc46a3f?w=80&q=70"
  },

  // ── Electronics ─────────────────────────────────────
  {
    id: 4,
    name: "Wireless Earbuds Pro",
    category: "Electronics",
    price: 2999,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&q=70"
  },
  {
    id: 5,
    name: "Smart Watch Series 7",
    category: "Electronics",
    price: 8499,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=70"
  },
  {
    id: 6,
    name: "Bluetooth Speaker 360°",
    category: "Electronics",
    price: 1799,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&q=70"
  },
  {
    id: 7,
    name: "Laptop Sleeve 15-inch",
    category: "Electronics",
    price: 649,
    availability: "Out of Stock",
    img: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=80&q=70"
  },

  // ── Home Appliances ──────────────────────────────────
  {
    id: 8,
    name: "Air Purifier 360 HEPA",
    category: "Home Appliances",
    price: 12999,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&q=70"
  },
  {
    id: 9,
    name: "Electric Kettle 1.5L",
    category: "Home Appliances",
    price: 1099,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&q=70"
  },
  {
    id: 10,
    name: "Robot Vacuum Cleaner",
    category: "Home Appliances",
    price: 15499,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70"
  },

  // ── Others ───────────────────────────────────────────
  {
    id: 11,
    name: "Yoga Mat Premium",
    category: "Others",
    price: 799,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&q=70"
  },
  {
    id: 12,
    name: "Stainless Steel Bottle",
    category: "Others",
    price: 449,
    availability: "In Stock",
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&q=70"
  },
  {
    id: 13,
    name: "Scented Candle Set",
    category: "Others",
    price: 599,
    availability: "Out of Stock",
    img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=80&q=70"
  }
];

/* ─────────────────────────────────────────────────────
   2. STATE
───────────────────────────────────────────────────── */
// Set of product IDs currently in the cart
const cart = new Map();   // id → {product, quantity}

// Current category filter ('All' means no filter)
let currentCategory = "All";

/* ─────────────────────────────────────────────────────
   3. UTILITY HELPERS
───────────────────────────────────────────────────── */

/**
 * Format a number as Indian Rupee string.
 * e.g. 12999 → "₹12,999"
 */
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Return CSS class for a category badge.
 */
function categoryClass(cat) {
  if (cat === "Beauty")          return "cat-badge cat-Beauty";
  if (cat === "Electronics")     return "cat-badge cat-Electronics";
  if (cat === "Home Appliances") return "cat-badge cat-Home";
  return "cat-badge cat-Others";
}

/* ─────────────────────────────────────────────────────
   4. RENDER PRODUCT TABLE
   Filters by currentCategory and by searchQuery.
───────────────────────────────────────────────────── */
function renderTable(searchQuery = "") {
  const tbody = document.getElementById("productTableBody");
  const noResults = document.getElementById("noResults");

  const query = searchQuery.trim().toLowerCase();

  // Filter products
  const filtered = products.filter(p => {
    const matchCat   = currentCategory === "All" || p.category === currentCategory;
    const matchQuery = !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  // Show/hide no-results message
  if (filtered.length === 0) {
    tbody.innerHTML = "";
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";

  // Build rows HTML
  const rows = filtered.map((p, index) => {
    const inCart     = cart.has(p.id);
    const outOfStock = p.availability === "Out of Stock";

    // Availability badge
    const availHtml = outOfStock
      ? `<span class="avail-out">✕ Out of Stock</span>`
      : `<span class="avail-in">✔ In Stock</span>`;

    // Action button
    let actionBtn;
    if (outOfStock) {
      actionBtn = `<button class="btn-add-cart" disabled style="opacity:.45;cursor:not-allowed;">Unavailable</button>`;
    } else if (inCart) {
      actionBtn = `<button class="btn-remove-cart" onclick="removeFromCart(${p.id})">✕ Remove from Cart</button>`;
    } else {
      actionBtn = `<button class="btn-add-cart" onclick="addToCart(${p.id})">+ Add to Cart</button>`;
    }

    return `
      <tr id="row-${p.id}">
        <td>${index + 1}</td>
        <td>
          <div class="prod-cell">
            <img src="${p.img}" alt="${p.name}" class="prod-thumb" loading="lazy" />
            <span class="prod-name">${p.name}</span>
          </div>
        </td>
        <td class="price-cell">${formatPrice(p.price)}</td>
        <td><span class="${categoryClass(p.category)}">${p.category}</span></td>
        <td>${availHtml}</td>
        <td>${actionBtn}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rows.join("");
}

/* ─────────────────────────────────────────────────────
   5. CART FUNCTIONS
───────────────────────────────────────────────────── */

/**
 * Add a product to the cart.
 */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.availability === "Out of Stock") return;

  if (!cart.has(productId)) {
    cart.set(productId, { product, quantity: 1 });
  }

  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
  showToast(`"${product.name}" added to cart 🛒`);
}

/**
 * Remove a product from the cart.
 */
function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  const name = cart.get(productId).product.name;
  cart.delete(productId);

  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
  showToast(`"${name}" removed from cart`);
}

/**
 * Update the cart badge, cart panel list, and total.
 */
function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const cartList = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");

  const count = cart.size;
  badge.textContent = count;

  // Badge bump animation
  badge.classList.remove("bump");
  void badge.offsetWidth;  // reflow trick to restart animation
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);

  // Rebuild cart list
  if (count === 0) {
    cartList.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    totalEl.textContent = "₹0";
    return;
  }

  let total = 0;
  const items = [];

  cart.forEach(({ product }) => {
    total += product.price;
    items.push(`
      <li class="cart-item">
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div style="font-size:.78rem;color:var(--clr-muted)">${product.category}</div>
        </div>
        <span class="cart-item-price">${formatPrice(product.price)}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove">✕</button>
      </li>
    `);
  });

  cartList.innerHTML = items.join("");
  totalEl.textContent = formatPrice(total);
}

/**
 * Toggle the cart side panel open/closed.
 */
function toggleCartPanel() {
  const panel   = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");
  panel.classList.toggle("open");
  overlay.classList.toggle("open");
}

/* ─────────────────────────────────────────────────────
   6. SEARCH FUNCTIONALITY
───────────────────────────────────────────────────── */

/**
 * Called on every keystroke in the search input.
 * Updates both the live dropdown and the product table.
 */
function searchProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const dropdown = document.getElementById("searchDropdown");

  // Update the product table
  renderTable(query);

  // Live dropdown suggestions
  if (query.length === 0) {
    dropdown.innerHTML = "";
    dropdown.classList.remove("open");
    return;
  }

  const matches = products
    .filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
    .slice(0, 6);  // show at most 6 suggestions

  if (matches.length === 0) {
    dropdown.innerHTML = `<div class="search-result-item"><span class="sri-name">No results found</span></div>`;
    dropdown.classList.add("open");
    return;
  }

  dropdown.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="selectSearchResult('${p.name}')">
      <img src="${p.img}" alt="${p.name}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;" loading="lazy"/>
      <div>
        <div class="sri-name">${highlightMatch(p.name, query)}</div>
        <div class="sri-cat">${p.category} · ${formatPrice(p.price)}</div>
      </div>
    </div>
  `).join("");

  dropdown.classList.add("open");
}

/**
 * Wrap the matched substring in a <mark> tag for visual highlight.
 */
function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, "<mark style='background:rgba(200,82,43,.15);border-radius:2px;'>$1</mark>");
}

/** Escape special regex characters in user input. */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * When user clicks a dropdown suggestion, fill the input and search.
 */
function selectSearchResult(name) {
  const input = document.getElementById("searchInput");
  input.value = name;
  document.getElementById("searchDropdown").classList.remove("open");
  renderTable(name.toLowerCase());
}

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const wrapper = document.querySelector(".search-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById("searchDropdown").classList.remove("open");
  }
});

/* ─────────────────────────────────────────────────────
   7. CATEGORY FILTER
───────────────────────────────────────────────────── */

/**
 * Filter the product table by category.
 * Also updates the active state of filter buttons.
 */
function filterCategory(category) {
  currentCategory = category;

  // Update filter button active states
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.trim() === category || (category === "All" && btn.textContent.trim() === "All"));
  });

  // Clear search input when changing category
  document.getElementById("searchInput").value = "";
  document.getElementById("searchDropdown").classList.remove("open");

  renderTable();

  // Scroll to products section
  const productsSection = document.getElementById("products");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ─────────────────────────────────────────────────────
   8. TOAST NOTIFICATION
───────────────────────────────────────────────────── */
let toastTimeout;

/**
 * Show a brief toast notification at the bottom of the screen.
 */
function showToast(message) {
  // Remove existing toast if any
  const existing = document.getElementById("toast");
  if (existing) existing.remove();
  clearTimeout(toastTimeout);

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = message;

  // Inline styles for toast (no extra CSS class needed)
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: "var(--clr-dark)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "30px",
    fontSize: "0.88rem",
    fontWeight: "500",
    fontFamily: "var(--ff-body)",
    zIndex: "3000",
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
    opacity: "0",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    maxWidth: "90vw",
    textAlign: "center"
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  // Animate out after 2.5 s
  toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ─────────────────────────────────────────────────────
   9. REGISTRATION FORM
───────────────────────────────────────────────────── */

/**
 * Handle form submission.
 * Validates required fields and shows a success message.
 */
function submitForm(event) {
  event.preventDefault();

  const form = document.getElementById("registrationForm");
  const successBox = document.getElementById("formSuccess");

  // Basic validation
  const name    = document.getElementById("custName").value.trim();
  const email   = document.getElementById("custEmail").value.trim();
  const phone   = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("address").value.trim();
  const gender  = document.querySelector('input[name="gender"]:checked');

  if (!name)    return highlightField("custName", "Please enter your name.");
  if (!email || !isValidEmail(email)) return highlightField("custEmail", "Please enter a valid email.");
  if (!phone || phone.length < 10)    return highlightField("custPhone", "Enter a valid 10-digit number.");
  if (!gender)  return showToast("⚠ Please select your gender.");
  if (!address) return highlightField("address", "Please enter your delivery address.");

  // All good — show success
  successBox.style.display = "block";
  form.reset();

  // Scroll success into view
  successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Hide success after 5 seconds
  setTimeout(() => { successBox.style.display = "none"; }, 5000);

  showToast("🎉 Welcome to EasyShopping! Check your email.");
}

/** Simple email format checker. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Briefly highlight a form field with a red border and toast message.
 */
function highlightField(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.style.borderColor = "#c0392b";
  field.style.boxShadow   = "0 0 0 3px rgba(192,57,43,.15)";
  field.focus();

  showToast("⚠ " + message);

  // Reset border after 2 s
  setTimeout(() => {
    field.style.borderColor = "";
    field.style.boxShadow   = "";
  }, 2000);
}

/* ─────────────────────────────────────────────────────
   10. ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────────────────── */

/**
 * Highlight the correct nav link as the user scrolls
 * through different sections.
 */
function onScroll() {
  const sections = ["home", "products", "offers", "contact"];
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollY  = window.scrollY + 120;

  let activeId = "home";
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) activeId = id;
  });

  navLinks.forEach(link => {
    const href = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", href === activeId);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

/* ─────────────────────────────────────────────────────
   11. INITIALISATION
───────────────────────────────────────────────────── */

/**
 * Run once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Render the full product table on page load
  renderTable();

  // Set "All" filter button as active
  const allBtn = document.querySelector(".filter-btn");
  if (allBtn) allBtn.classList.add("active");

  console.log("✅ EasyShopping loaded — " + products.length + " products ready.");
});
