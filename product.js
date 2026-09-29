// Cek autentikasi
function checkAuth() {
  const userStorage = localStorage.getItem("user");
  if (!userStorage) {
    window.location.href = "index.html"; 
  } else {
    const userData = JSON.parse(userStorage);
    document.getElementById("welcomeMessage").innerText = `Welcome, ${userData.username || "Pengguna"}!`;
  }
}
// checkAuth();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "index.html";
});

// State management
let allProducts = [];
let filteredProducts = [];
let displayCount = 12;
const itemsPerLoad = 12;

const productContainer = document.getElementById("productContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// Fetch products from API
async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0");
    const data = await response.json();
    
    allProducts = data.products;
    filteredProducts = [...allProducts];
    
    populateCategories();
    renderProducts();
    updateCartBadge();
  } catch (error) {
    productContainer.innerHTML = "<p style='color:white;'>Gagal memuat data produk.</p>";
  }
}

// Render products to the DOM
function renderProducts() {
  productContainer.innerHTML = "";
  const productsToShow = filteredProducts.slice(0, displayCount);

  productsToShow.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // Card content
    card.innerHTML = `
      <img src="${product.thumbnail}" class="product-image">
      <h4 class="product-title">${product.title}</h4>
      <p class="product-price">$${product.price}</p>
      <button class="add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
      <button class="detail-btn" data-id="${product.id}">Lihat Detail</button>
    `;
    productContainer.appendChild(card);
  });

  if (displayCount >= filteredProducts.length) {
    loadMoreBtn.classList.add("hidden-element");
  } else {
    loadMoreBtn.classList.remove("hidden-element");
  }
}

// Pagination: Load more products
loadMoreBtn.addEventListener("click", () => {
  displayCount += itemsPerLoad;
  renderProducts();
});

// Filtering and sorting
function applyFilters() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sortVal = document.getElementById("sortFilter").value;

  filteredProducts = allProducts.filter(p => {
    const matchName = p.title.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || p.category === category;
    return matchName && matchCategory;
  });

  if (sortVal === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayCount = itemsPerLoad;
  renderProducts();
}

// Populate category filter options
function populateCategories() {
  const categories = [...new Set(allProducts.map(p => p.category))];
  const select = document.getElementById("categoryFilter");
  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortFilter").addEventListener("change", applyFilters);

// Keranjang belanja
function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); updateCartBadge(); }

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  document.getElementById("cartBadge").innerText = totalQty;
  document.getElementById("cartTotalHeader").innerText = totalPrice.toFixed(2);
}

function addToCart(id, qty = 1) {
  const product = allProducts.find(p => p.id === id);
  if (product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += qty;
    else cart.push({ id: product.id, title: product.title, price: product.price, quantity: qty });
    
    saveCart(cart);
    alert(`${qty}x "${product.title}" berhasil ditambahkan!`);
  }
}

// Event Listeners (Detail & Tambah)
productContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    addToCart(parseInt(e.target.getAttribute("data-id")), 1);
  } else if (e.target.classList.contains("detail-btn")) {
    showModal(parseInt(e.target.getAttribute("data-id")));
  }
});

// Modal Produk
const modal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");

function showModal(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  // Populate modal content
  modalBody.innerHTML = `
    <h2 class="modal-title">${product.title}</h2>
    <img src="${product.thumbnail}" class="modal-product-img">
    <p><strong>Brand:</strong> ${product.brand || "-"}</p>
    <p><strong>Stok Tersedia:</strong> ${product.stock}</p>
    <p><strong>Harga:</strong> $${product.price}</p>
    <p class="modal-desc">${product.description}</p>
    
    <div class="qty-group">
      <label><strong>Jumlah Beli:</strong></label>
      <input type="number" id="customQty" class="qty-input" value="1" min="1" max="${product.stock}">
    </div>
    
    <button id="modalAddToCart" class="modal-add-btn" data-id="${product.id}">Tambah ke Keranjang</button>
  `;
  
  modal.classList.remove("hidden-element");

  // Handle adding to cart from modal
  document.getElementById("modalAddToCart").onclick = function() {
    const qty = parseInt(document.getElementById("customQty").value);
    if(qty > 0 && qty <= product.stock) {
      addToCart(product.id, qty);
      modal.classList.add("hidden-element");
    } else {
      alert(`Jumlah tidak valid! Stok maksimal ${product.stock}`);
    }
  };
}
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden-element");


// Modal Keranjang
const cartModal = document.getElementById("cartModal");
const cartBody = document.getElementById("cartBody");
const cartActions = document.getElementById("cartActions");

document.getElementById("cartIcon").addEventListener("click", () => {
  const cart = getCart();
  cartBody.innerHTML = "";

  // Render cart items
  if (cart.length === 0) {
    cartBody.innerHTML = "<p style='text-align:center; color:#888;'>Keranjang Kosong</p>";
    cartActions.classList.add("hidden-element");
  } else {
    cartActions.classList.remove("hidden-element");
    let total = 0;
    cart.forEach(item => {
      total += (item.price * item.quantity);
      cartBody.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.title}</strong><br>
            <small>$${item.price} x ${item.quantity}</small>
          </div>
          <div class="cart-item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
    });
    cartBody.innerHTML += `<h3 style="text-align:right; margin-top:15px;">Total: $${total.toFixed(2)}</h3>`;
  }
  cartModal.classList.remove("hidden-element");
});

document.getElementById("closeCartModal").onclick = () => cartModal.classList.add("hidden-element");

// Checkout Order
document.getElementById("checkoutBtn").onclick = () => {
  alert("Pesanan berhasil dicheckout! Terima kasih.");
  localStorage.removeItem("cart");
  updateCartBadge();
  cartModal.classList.add("hidden-element");
};

// Cancel Order
document.getElementById("cancelOrderBtn").onclick = () => {
  if(confirm("Yakin ingin membatalkan dan mengosongkan keranjang?")) {
    localStorage.removeItem("cart");
    updateCartBadge();
    cartModal.classList.add("hidden-element");
  }
};

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden-element");
  if (e.target === cartModal) cartModal.classList.add("hidden-element");
});

// Init
loadProducts();