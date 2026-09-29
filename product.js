// Cek autentikasi pengguna
function checkAuth() {
  const userStorage = localStorage.getItem("user");

  // Jika Anda sedang mengetes tanpa file login, matikan komentar (//) pada baris if di bawah ini
  if (!userStorage) {
    // window.location.href = "index.html";
  } else {
    const userData = JSON.parse(userStorage);
    const namaPengguna = userData.username || "Pengguna";
    document.getElementById("welcomeMessage").innerText = `Welcome to Mini Shopee, ${namaPengguna}!`;
  }
}
checkAuth();

// Logout
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "index.html";
});

// State Management
let allProducts = [];
const productContainer = document.getElementById("productContainer");

// Fetch data produk dari API
async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=12");
    const data = await response.json();
    allProducts = data.products;
    renderProducts(allProducts);
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    productContainer.innerHTML = "<p>Gagal memuat data produk.</p>";
  }
}

// Fungsi Render Produk
function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
          <h4 class="product-title">${product.title}</h4>
          <p class="product-price">$${product.price}</p>
          <button class="add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
          <button class="detail-btn" data-id="${product.id}" style="margin-top:10px; background:rgba(255,255,255,0.2); color:white; border:1px solid white; padding:10px; width:100%; border-radius:25px; cursor:pointer;">Detail</button>
      `;
    productContainer.appendChild(productCard);
  });
}

loadProducts();

// Search Bar
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filteredProducts = allProducts.filter((product) => product.title.toLowerCase().includes(keyword));

  renderProducts(filteredProducts);
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (product) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
    }

    saveCart(cart);
    alert(`"${product.title}" masuk ke keranjang!`);
  }
}

// Modal Keranjang
const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const closeCartModal = document.getElementById("closeCartModal");
const cartBody = document.getElementById("cartBody");

if (cartIcon && cartModal && cartBody) {
  cartIcon.addEventListener("click", () => {
    const currentCart = getCart();
    cartBody.innerHTML = "";

    if (currentCart.length === 0) {
      cartBody.innerHTML = "<p>Keranjang Anda masih kosong.</p>";
    } else {
      let totalHarga = 0;
      currentCart.forEach((item) => {
        totalHarga += item.price * item.quantity;
        cartBody.innerHTML += `
                <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                    <p style="margin:0; font-weight:bold;">${item.title}</p>
                    <p style="margin:0; font-size:14px;">Harga: $${item.price} x ${item.quantity}</p>
                </div>
            `;
      });
      cartBody.innerHTML += `<h3 style="text-align:right;">Total: $${totalHarga}</h3>`;
    }
    cartModal.style.display = "flex";
  });

  closeCartModal.addEventListener("click", () => (cartModal.style.display = "none"));
}

// --- LOGIKA MODAL DETAIL PRODUK ---
const modal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

// Event Delegation di dalam Product Container
productContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    addToCart(productId);
  } else if (e.target.classList.contains("detail-btn")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    showModal(productId);
  }
});

function showModal(id) {
  if (!modal || !modalBody) {
    alert("Elemen modal belum ditambahkan ke HTML Anda!");
    return;
  }
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  modalBody.innerHTML = `
        <h2 style="font-size: 18px; margin-bottom: 10px; color:#333;">${product.title}</h2>
        <img src="${product.thumbnail}" style="width:100%; max-height:200px; object-fit:contain; margin-bottom:15px;">
        <div style="color:#333;">
          <p><strong>Brand:</strong> ${product.brand || "-"}</p>
          <p><strong>Kategori:</strong> ${product.category}</p>
          <p><strong>Harga:</strong> $${product.price}</p>
          <p style="margin-top: 10px; font-size: 13px;">${product.description}</p>
        </div>
        <button class="add-to-cart" data-id="${product.id}" style="margin-top: 20px; padding:10px; background:#1d406d; color:white; border:none; border-radius: 20px; width:100%; cursor:pointer;">Tambah ke Keranjang</button>
    `;
  modal.style.display = "flex";
}

if (modal && modalBody) {
  modalBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = parseInt(e.target.getAttribute("data-id"));
      addToCart(productId);
      modal.style.display = "none";
    }
  });

  closeModal.addEventListener("click", () => (modal.style.display = "none"));
}

// Menutup modal dengan klik area luar
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
  if (e.target === cartModal) cartModal.style.display = "none";
});
