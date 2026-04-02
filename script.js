/* =====================================================
   EasyShopping — script.js
   Handles:
     • Login / Logout
     • Product data & table rendering
     • Search (live dropdown + table filter)
     • Category filter
     • Add to Cart / Remove from Cart
     • Cart panel UI + Proceed to Payment button
     • Payment modal (Card / UPI / Net Banking / COD)
     • Customer Registration Form
     • Active nav link on scroll
   ====================================================== */

/* ─────────────────────────────────────────────────────
   1. PRODUCT DATA
   • All products set to "In Stock"
   • Updated images for Matte Lipstick Collection
     and Sunscreen SPF 50+
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
    img: "https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=80&q=70"   // clear lipstick image
  },
  {
    id: 3,
    name: "Sunscreen SPF 50+",
    category: "Beauty",
    price: 499,
    availability: "In Stock",                                                          // was Out of Stock
    img: "https://images.unsplash.com/photo-1556229010-aa3b7e8b5e32?w=80&q=70"       // clear sunscreen image
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
    availability: "In Stock",                                                          // was Out of Stock
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
    availability: "In Stock",                                                          // was Out of Stock
    img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=80&q=70"
  }
];

/* ─────────────────────────────────────────────────────
   2. STATE
───────────────────────────────────────────────────── */
const cart = new Map();       // productId → { product, quantity }
let   currentCategory = "All";

/* ─────────────────────────────────────────────────────
   3. UTILITY HELPERS
───────────────────────────────────────────────────── */
function formatPrice(n)   { return "₹" + n.toLocaleString("en-IN"); }
function isValidEmail(e)  { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function categoryClass(cat) {
  if (cat === "Beauty")          return "cat-badge cat-Beauty";
  if (cat === "Electronics")     return "cat-badge cat-Electronics";
  if (cat === "Home Appliances") return "cat-badge cat-Home";
  return "cat-badge cat-Others";
}

/* ─────────────────────────────────────────────────────
   4. LOGIN / LOGOUT
───────────────────────────────────────────────────── */
function doLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPassword").value.trim();
  const errEl = document.getElementById("loginError");

  // Validate inputs
  if (!email || !pass) {
    showLoginError("⚠ Please fill in both email and password.");
    return;
  }
  if (!isValidEmail(email)) {
    showLoginError("⚠ Please enter a valid email address.");
    return;
  }

  // Any valid-format credentials accepted (demo mode)
  errEl.style.display = "none";

  // Derive display name from email
  const name = email.split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  launchSite(name, false);
}

function guestLogin() {
  launchSite("Guest", true);
}

function launchSite(name, isGuest) {
  // Hide login, show site
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("mainSite").style.display  = "block";

  // Inject user avatar + name + logout into header
  const initial = name.charAt(0).toUpperCase();
  document.getElementById("headerUserArea").innerHTML = `
    <div class="header-user-info">
      <div class="header-user-avatar">${initial}</div>
      <span style="max-width:80px;overflow:hidden;text-overflow:ellipsis;font-size:.82rem">
        ${isGuest ? "Guest" : name}
      </span>
      <button class="header-logout-btn" onclick="doLogout()">Logout</button>
    </div>`;

  renderTable();

  setTimeout(() => {
    showToast(isGuest
      ? "👋 Welcome, Guest! Happy Shopping!"
      : `👋 Welcome back, ${name}!`);
  }, 400);
}

function doLogout() {
  // Clear cart
  cart.clear();
  updateCartUI();

  // Hide site, show login
  document.getElementById("mainSite").style.display  = "none";
  document.getElementById("loginPage").style.display = "flex";

  // Reset login form
  document.getElementById("loginEmail").value    = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("loginError").style.display = "none";
}

function showLoginError(msg) {
  const el = document.getElementById("loginError");
  el.textContent   = msg;
  el.style.display = "block";
}

// Press Enter on login form
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" &&
      document.getElementById("loginPage").style.display !== "none") {
    doLogin();
  }
});

/* ─────────────────────────────────────────────────────
   5. RENDER PRODUCT TABLE
───────────────────────────────────────────────────── */
function renderTable(searchQuery = "") {
  const tbody    = document.getElementById("productTableBody");
  const noResults = document.getElementById("noResults");
  const query    = searchQuery.trim().toLowerCase();

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

  tbody.innerHTML = filtered.map((p, i) => {
    const inCart = cart.has(p.id);
    const oos    = p.availability === "Out of Stock";

    const availHtml = oos
      ? `<span class="avail-out">✕ Out of Stock</span>`
      : `<span class="avail-in">✔ In Stock</span>`;

    let actionBtn;
    if (oos) {
      actionBtn = `<button class="btn-add-cart" disabled style="opacity:.45;cursor:not-allowed;">Unavailable</button>`;
    } else if (inCart) {
      actionBtn = `<button class="btn-remove-cart" onclick="removeFromCart(${p.id})">✕ Remove from Cart</button>`;
    } else {
      actionBtn = `<button class="btn-add-cart" onclick="addToCart(${p.id})">+ Add to Cart</button>`;
    }

    return `
      <tr id="row-${p.id}">
        <td>${i + 1}</td>
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
  }).join("");
}

/* ─────────────────────────────────────────────────────
   6. CART FUNCTIONS
───────────────────────────────────────────────────── */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.availability === "Out of Stock") return;
  if (!cart.has(productId)) cart.set(productId, { product, quantity: 1 });
  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
  showToast(`"${product.name}" added to cart 🛒`);
}

function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  const name = cart.get(productId).product.name;
  cart.delete(productId);
  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
  showToast(`"${name}" removed from cart`);
}

function updateCartUI() {
  const badge    = document.getElementById("cartBadge");
  const cartList = document.getElementById("cartList");
  const totalEl  = document.getElementById("cartTotal");
  const chkBtn   = document.getElementById("cartCheckoutBtn");
  const count    = cart.size;

  badge.textContent = count;

  // Badge bump animation
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);

  if (count === 0) {
    cartList.innerHTML  = `<li class="cart-empty">Your cart is empty.</li>`;
    totalEl.textContent = "₹0";
    chkBtn.style.display = "none";
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
          <div style="font-size:.75rem;color:var(--clr-muted)">${product.category}</div>
        </div>
        <span class="cart-item-price">${formatPrice(product.price)}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove">✕</button>
      </li>`);
  });

  cartList.innerHTML  = items.join("");
  totalEl.textContent = formatPrice(total);

  // Show the checkout button now that cart has items
  chkBtn.style.display = "block";
}

function toggleCartPanel() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
}

/* ─────────────────────────────────────────────────────
   7. PAYMENT MODAL
───────────────────────────────────────────────────── */
function openPayment() {
  if (cart.size === 0) { showToast("⚠ Your cart is empty!"); return; }

  // Close cart panel
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");

  // Build order summary
  let total = 0, html = "";
  cart.forEach(({ product }) => {
    total += product.price;
    html  += `
      <div class="order-line">
        <span>${product.name}</span>
        <span>${formatPrice(product.price)}</span>
      </div>`;
  });
  document.getElementById("payOrderItems").innerHTML = html;
  document.getElementById("payOrderTotal").textContent = formatPrice(total);
  document.getElementById("payNowBtn").textContent = `Pay ${formatPrice(total)} ✓`;

  // Reset to Card tab
  selectPayMethod("card", document.querySelector(".pay-tab"));

  // Show form, hide success
  document.getElementById("payFormView").style.display = "block";
  document.getElementById("paySuccessView").classList.remove("show");
  document.getElementById("paymentModal").classList.add("open");
}

function closePayment() {
  document.getElementById("paymentModal").classList.remove("open");
}

function selectPayMethod(method, btn) {
  document.querySelectorAll(".pay-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".pay-fields").forEach(f => f.classList.remove("visible"));
  document.getElementById("fields-" + method).classList.add("visible");

  // Update button label
  let total = 0;
  cart.forEach(({ product }) => { total += product.price; });
  document.getElementById("payNowBtn").textContent =
    method === "cod"
      ? "Confirm Order (COD) ✓"
      : `Pay ${formatPrice(total)} ✓`;
}

function processPayment() {
  // Generate a random order ID and show success screen
  const orderId = "ES" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById("successOrderId").textContent = "Order #" + orderId;
  document.getElementById("payFormView").style.display = "none";
  document.getElementById("paySuccessView").classList.add("show");

  // Clear cart after successful payment
  cart.clear();
  updateCartUI();
  renderTable(document.getElementById("searchInput").value);
}

function continueShopping() {
  closePayment();
  showToast("🎉 Thank you for shopping with EasyShopping!");
}

// Auto-format card number: "1234567890123456" → "1234 5678 9012 3456"
function formatCardNum(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
}

// Auto-format expiry: "1225" → "12 / 25"
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + " / " + v.substring(2);
  input.value = v;
}

/* ─────────────────────────────────────────────────────
   8. SEARCH
───────────────────────────────────────────────────── */
function searchProducts() {
  const query    = document.getElementById("searchInput").value.trim().toLowerCase();
  const dropdown = document.getElementById("searchDropdown");

  renderTable(query);

  if (!query) {
    dropdown.innerHTML = "";
    dropdown.classList.remove("open");
    return;
  }

  const matches = products
    .filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query))
    .slice(0, 6);

  if (!matches.length) {
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

function highlightMatch(text, query) {
  return text.replace(
    new RegExp(`(${escapeRegex(query)})`, "gi"),
    "<mark style='background:rgba(200,82,43,.15);border-radius:2px;'>$1</mark>"
  );
}

function selectSearchResult(name) {
  document.getElementById("searchInput").value = name;
  document.getElementById("searchDropdown").classList.remove("open");
  renderTable(name.toLowerCase());
}

document.addEventListener("click", function(e) {
  const w = document.querySelector(".search-wrapper");
  if (w && !w.contains(e.target))
    document.getElementById("searchDropdown").classList.remove("open");
});

/* ─────────────────────────────────────────────────────
   9. CATEGORY FILTER
───────────────────────────────────────────────────── */
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

  const sec = document.getElementById("products");
  if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─────────────────────────────────────────────────────
   10. TOAST NOTIFICATION
───────────────────────────────────────────────────── */
let toastTimeout;

function showToast(message) {
  const ex = document.getElementById("toast");
  if (ex) ex.remove();
  clearTimeout(toastTimeout);

  const t = document.createElement("div");
  t.id = "toast";
  t.textContent = message;
  Object.assign(t.style, {
    position: "fixed", bottom: "28px", left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: "var(--clr-dark)", color: "#fff",
    padding: "12px 24px", borderRadius: "30px",
    fontSize: "0.88rem", fontWeight: "500",
    fontFamily: "var(--ff-body)", zIndex: "5000",
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
    opacity: "0", transition: "all 0.3s ease",
    whiteSpace: "nowrap", maxWidth: "90vw", textAlign: "center"
  });
  document.body.appendChild(t);

  requestAnimationFrame(() => {
    t.style.opacity   = "1";
    t.style.transform = "translateX(-50%) translateY(0)";
  });

  toastTimeout = setTimeout(() => {
    t.style.opacity   = "0";
    t.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

/* ─────────────────────────────────────────────────────
   11. REGISTRATION FORM
───────────────────────────────────────────────────── */
function submitForm(event) {
  event.preventDefault();

  const name    = document.getElementById("custName").value.trim();
  const email   = document.getElementById("custEmail").value.trim();
  const phone   = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("address").value.trim();
  const gender  = document.querySelector('input[name="gender"]:checked');

  if (!name)                          return highlightField("custName",  "Please enter your name.");
  if (!email || !isValidEmail(email)) return highlightField("custEmail", "Please enter a valid email.");
  if (!phone || phone.length < 10)    return highlightField("custPhone", "Enter a valid 10-digit number.");
  if (!gender)                        return showToast("⚠ Please select your gender.");
  if (!address)                       return highlightField("address",   "Please enter your delivery address.");

  const s = document.getElementById("formSuccess");
  s.style.display = "block";
  document.getElementById("registrationForm").reset();
  s.scrollIntoView({ behavior: "smooth", block: "nearest" });
  setTimeout(() => { s.style.display = "none"; }, 5000);
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
   12. ACTIVE NAV LINK ON SCROLL
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
    if (href) link.classList.toggle("active", href.replace("#", "") === activeId);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });

/* ─────────────────────────────────────────────────────
   13. INITIALISATION
───────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function() {
  // Table will render after login, not here
  console.log("✅ EasyShopping loaded — " + products.length + " products ready.");
});
