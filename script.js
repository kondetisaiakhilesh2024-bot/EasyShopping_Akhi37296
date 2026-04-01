/* =====================================================
   EasyShopping — script.js
   Handles:
     • Auth guard (redirect to login if not logged in)
     • Header user info display & logout
     • Product data & table rendering
     • Search (live dropdown + table filter)
     • Category filter (filter buttons + category cards)
     • Add to Cart / Remove from Cart
     • Cart panel UI (badge, panel, total, checkout button)
     • Payment modal (Card / UPI / Net Banking / COD)
     • Customer Registration Form
     • Active nav link on scroll
   ====================================================== */

/* ─────────────────────────────────────────────────────
   1. AUTH GUARD
   Redirect to login.html if no session exists.
───────────────────────────────────────────────────── */
(function authGuard() {
  const user = sessionStorage.getItem("es_user");
  if (!user) {
    window.location.href = "login.html";
  }
})();

/* ─────────────────────────────────────────────────────
   2. PRODUCT DATA
   Each product: id, name, category, price, availability, image URL
   ➤ All products set to "In Stock" as requested.
   ➤ Updated images for Matte Lipstick Collection & Sunscreen SPF 50+.
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
    // Updated to a clear lipstick product image
    img: "https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=80&q=70"
  },
  {
    id: 3,
    name: "Sunscreen SPF 50+",
    category: "Beauty",
    price: 499,
    availability: "In Stock",            // ← was Out of Stock, now In Stock
    // Updated to a clear sunscreen / skincare bottle image
    img: "https://images.unsplash.com/photo-1556229010-aa3b7e8b5e32?w=80&q=70"
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
    availability: "In Stock",            // ← was Out of Stock, now In Stock
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
    img: "https://images.unsplash.com/photo-1574293876203-8cbcf0b0bef2?w=80&q=70"
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
    availability: "In Stock",            // ← was Out of Stock, now In Stock
    img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=80&q=70"
  }
];

/* ─────────────────────────────────────────────────────
   3. STATE
───────────────────────────────────────────────────── */
const cart = new Map();       // productId → { product, quantity }
let   currentCategory = "All";

/* ─────────────────────────────────────────────────────
   4. UTILITY HELPERS
───────────────────────────────────────────────────── */

/** Format rupee amount: 12999 → "₹12,999" */
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

/** Return CSS badge class based on category string */
function categoryClass(cat) {
  if (cat === "Beauty")          return "cat-badge cat-Beauty";
  if (cat === "Electronics")     return "cat-badge cat-Electronics";
  if (cat === "Home Appliances") return "cat-badge cat-Home";
  return "cat-badge cat-Others";
}

/** Basic email format validator */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Escape special regex chars in user input */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ─────────────────────────────────────────────────────
   5. HEADER USER INFO & LOGOUT
───────────────────────────────────────────────────── */
function initUserHeader() {
  const raw  = sessionStorage.getItem("es_user");
  if (!raw) return;
  const user = JSON.parse(raw);
  const area = document.getElementById("headerUserArea");
  if (!area) return;

  const initial = user.name.charAt(0).toUpperCase();
  area.innerHTML = `
    <div class="header-user-info">
      <div class="header-user-avatar">${initial}</div>
      <span style="max-width:80px;overflow:hidden;text-overflow:ellipsis;font-size:.82rem">
        ${user.isGuest ? "Guest" : user.name}
      </span>
      <button class="header-logout-btn" onclick="doLogout()">Logout</button>
    </div>`;
}

function doLogout() {
  sessionStorage.removeItem("es_user");
  window.location.href = "login.html";
}

/* ─────────────────────────────────────────────────────
   6. RENDER PRODUCT TABLE
───────────────────────────────────────────────────── */
function renderTable(searchQuery = "") {
  const tbody    = document.getElementById("productTableBody");
  const noResults = document.getElementById("noResults");
  const query    = searchQuery.trim().toLowerCase();

  // Filter by active category and search query
  const filtered = products.filter(p => {
    const matchCat   = currentCategory === "All" || p.category === currentCategory;
    const matchQuery = !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";

  const rows = filtered.map((p, index) => {
    const inCart     = cart.has(p.id);
    const outOfStock = p.availability === "Out of Stock";

    const availHtml = outOfStock
      ? `<span class="avail-out">✕ Out of Stock</span>`
      : `<span class="avail-in">✔ In Stock</span>`;

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
      </tr>`;
  });

  tbody.innerHTML = rows.join("");
}

/* ─────────────────────────────────────────────────────
   7. CART FUNCTIONS
───────────────────────────────────────────────────── */

/** Add a product to the cart */
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

/** Remove a product from the cart */
function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  const name = cart.get(productId).product.name;
  cart.delete(productId);
  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
  showToast(`"${name}" removed from cart`);
}

/** Rebuild cart panel UI: list, badge, total, checkout button */
function updateCartUI() {
  const badge    = document.getElementById("cartBadge");
  const cartList = document.getElementById("cartList");
  const totalEl  = document.getElementById("cartTotal");
  const chkBtn   = document.getElementById("cartCheckoutBtn");

  const count = cart.size;
  badge.textContent = count;

  // Badge bump animation
  badge.classList.remove("bump");
  void badge.offsetWidth;          // trigger reflow to restart animation
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);

  // Empty cart state
  if (count === 0) {
    cartList.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    totalEl.textContent = "₹0";
    chkBtn.style.display = "none";
    return;
  }

  // Build cart item rows
  let total = 0;
  const items = [];
  cart.forEach(({ product }) => {
    total += product.price;
    items.push(`
      <li class="cart-item">
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div style="font-size:.75rem;color:var(--clr-muted)">${product.category}</div>
        </div>
        <span class="cart-item-price">${formatPrice(product.price)}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove">✕</button>
      </li>`);
  });

  cartList.innerHTML = items.join("");
  totalEl.textContent = formatPrice(total);

  // Show "Proceed to Payment" button only when cart has items
  chkBtn.style.display = "block";
}

/** Toggle the cart side panel */
function toggleCartPanel() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
}

/* ─────────────────────────────────────────────────────
   8. PAYMENT MODAL
───────────────────────────────────────────────────── */

/** Open the payment modal, populate order summary */
function openPayment() {
  if (cart.size === 0) {
    showToast("⚠ Your cart is empty!");
    return;
  }

  // Close cart panel first
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");

  // Build order summary rows
  let total = 0;
  let itemsHtml = "";
  cart.forEach(({ product }) => {
    total += product.price;
    itemsHtml += `
      <div class="order-line">
        <span>${product.name}</span>
        <span>${formatPrice(product.price)}</span>
      </div>`;
  });

  document.getElementById("payOrderItems").innerHTML = itemsHtml;
  document.getElementById("payOrderTotal").textContent = formatPrice(total);
  document.getElementById("payNowBtn").textContent = `Pay ${formatPrice(total)} ✓`;

  // Reset to Card method tab
  selectPayMethod("card", document.querySelector(".pay-tab"));

  // Show form, hide success
  document.getElementById("payFormView").style.display  = "block";
  document.getElementById("paySuccessView").classList.remove("show");
  document.getElementById("paymentModal").classList.add("open");
}

/** Close the payment modal */
function closePayment() {
  document.getElementById("paymentModal").classList.remove("open");
}

/** Switch between payment method tabs */
function selectPayMethod(method, btn) {
  // Update active tab
  document.querySelectorAll(".pay-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // Show correct fields
  document.querySelectorAll(".pay-fields").forEach(f => f.classList.remove("visible"));
  document.getElementById("fields-" + method).classList.add("visible");

  // Update button label for COD
  let total = 0;
  cart.forEach(({ product }) => { total += product.price; });
  document.getElementById("payNowBtn").textContent =
    method === "cod"
      ? "Confirm Order (COD) ✓"
      : `Pay ${formatPrice(total)} ✓`;
}

/** Simulate payment processing → show success screen */
function processPayment() {
  const orderId = "ES" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById("successOrderId").textContent = "Order #" + orderId;
  document.getElementById("payFormView").style.display = "none";
  document.getElementById("paySuccessView").classList.add("show");

  // Clear the cart
  cart.clear();
  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
}

/** Close modal after successful payment */
function continueShopping() {
  closePayment();
  showToast("🎉 Thank you for shopping with EasyShopping!");
}

/* Card number auto-formatting: "1234567890123456" → "1234 5678 9012 3456" */
function formatCardNum(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
}

/* Expiry auto-formatting: "1225" → "12 / 25" */
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + " / " + v.substring(2);
  input.value = v;
}

/* ─────────────────────────────────────────────────────
   9. SEARCH FUNCTIONALITY
───────────────────────────────────────────────────── */

/** Called on every keystroke in the search input */
function searchProducts() {
  const query    = document.getElementById("searchInput").value.trim().toLowerCase();
  const dropdown = document.getElementById("searchDropdown");

  renderTable(query);

  if (query.length === 0) {
    dropdown.innerHTML = "";
    dropdown.classList.remove("open");
    return;
  }

  const matches = products
    .filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query))
    .slice(0, 6);

  if (matches.length === 0) {
    dropdown.innerHTML = `<div class="search-result-item"><span class="sri-name">No results found</span></div>`;
    dropdown.classList.add("open");
    return;
  }

  dropdown.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="selectSearchResult('${p.name}')">
      <img src="${p.img}" alt="${p.name}"
           style="width:32px;height:32px;object-fit:cover;border-radius:6px;" loading="lazy"/>
      <div>
        <div class="sri-name">${highlightMatch(p.name, query)}</div>
        <div class="sri-cat">${p.category} · ${formatPrice(p.price)}</div>
      </div>
    </div>`).join("");

  dropdown.classList.add("open");
}

/** Wrap matched text in a <mark> highlight */
function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, "<mark style='background:rgba(200,82,43,.15);border-radius:2px;'>$1</mark>");
}

/** Fill search input from dropdown suggestion */
function selectSearchResult(name) {
  document.getElementById("searchInput").value = name;
  document.getElementById("searchDropdown").classList.remove("open");
  renderTable(name.toLowerCase());
}

// Close dropdown on outside click
document.addEventListener("click", function(e) {
  const wrapper = document.querySelector(".search-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById("searchDropdown").classList.remove("open");
  }
});

/* ─────────────────────────────────────────────────────
   10. CATEGORY FILTER
───────────────────────────────────────────────────── */

/** Filter table by category; reset search; update active button */
function filterCategory(category) {
  currentCategory = category;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.textContent.trim() === category ||
      (category === "All" && btn.textContent.trim() === "All")
    );
  });

  document.getElementById("searchInput").value = "";
  document.getElementById("searchDropdown").classList.remove("open");

  renderTable();

  const productsSection = document.getElementById("products");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ─────────────────────────────────────────────────────
   11. TOAST NOTIFICATION
───────────────────────────────────────────────────── */
let toastTimeout;

function showToast(message) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();
  clearTimeout(toastTimeout);

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position:     "fixed",
    bottom:       "28px",
    left:         "50%",
    transform:    "translateX(-50%) translateY(20px)",
    background:   "var(--clr-dark)",
    color:        "#fff",
    padding:      "12px 24px",
    borderRadius: "30px",
    fontSize:     "0.88rem",
    fontWeight:   "500",
    fontFamily:   "var(--ff-body)",
    zIndex:       "5000",
    boxShadow:    "0 8px 24px rgba(0,0,0,.25)",
    opacity:      "0",
    transition:   "all 0.3s ease",
    whiteSpace:   "nowrap",
    maxWidth:     "90vw",
    textAlign:    "center"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  toastTimeout = setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ─────────────────────────────────────────────────────
   12. REGISTRATION FORM
───────────────────────────────────────────────────── */

function submitForm(event) {
  event.preventDefault();

  const name    = document.getElementById("custName").value.trim();
  const email   = document.getElementById("custEmail").value.trim();
  const phone   = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("address").value.trim();
  const gender  = document.querySelector('input[name="gender"]:checked');

  if (!name)                            return highlightField("custName",  "Please enter your name.");
  if (!email || !isValidEmail(email))   return highlightField("custEmail", "Please enter a valid email.");
  if (!phone || phone.length < 10)      return highlightField("custPhone", "Enter a valid 10-digit number.");
  if (!gender)                          return showToast("⚠ Please select your gender.");
  if (!address)                         return highlightField("address",   "Please enter your delivery address.");

  const successBox = document.getElementById("formSuccess");
  successBox.style.display = "block";
  document.getElementById("registrationForm").reset();
  successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  setTimeout(() => { successBox.style.display = "none"; }, 5000);
  showToast("🎉 Welcome to EasyShopping! Check your email.");
}

function highlightField(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = "#c0392b";
  field.style.boxShadow   = "0 0 0 3px rgba(192,57,43,.15)";
  field.focus();
  showToast("⚠ " + message);
  setTimeout(() => {
    field.style.borderColor = "";
    field.style.boxShadow   = "";
  }, 2000);
}

/* ─────────────────────────────────────────────────────
   13. ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────────────────── */
function onScroll() {
  const sections = ["home", "products", "offers", "contact"];
  const scrollY  = window.scrollY + 120;
  let   activeId = "home";

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) activeId = id;
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href) {
      link.classList.toggle("active", href.replace("#", "") === activeId);
    }
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

/* ─────────────────────────────────────────────────────
   14. INITIALISATION
───────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function() {
  // Show logged-in user in the header
  initUserHeader();

  // Render the full product table
  renderTable();

  // Set "All" filter button as active
  const allBtn = document.querySelector(".filter-btn");
  if (allBtn) allBtn.classList.add("active");

  // Welcome toast
  const raw = sessionStorage.getItem("es_user");
  if (raw) {
    const user = JSON.parse(raw);
    const greeting = user.isGuest
      ? "👋 Welcome, Guest! Happy Shopping!"
      : `👋 Welcome back, ${user.name}!`;
    setTimeout(() => showToast(greeting), 500);
  }

  console.log("✅ EasyShopping loaded — " + products.length + " products ready.");
});
