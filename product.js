// Cek autentikasi pengguna
function checkAuth() {
  const userStorage = localStorage.getItem("user");

  if (!userStorage) {
    window.location.href = "index.html";
  } else {
    const userData = JSON.parse(userStorage);
    const namaPengguna = userData.username || "Pengguna";
    document.getElementById("welcomeMessage").innerText = `Selamat datang, ${namaPengguna}!`;
  }
}
// checkAuth(); 

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

// State Management
let allProducts = [];
let filteredProducts = [];
let currentIndex = 0;
const itemsPerPage = 12; // Untuk limit dan load more (Array Slicing)

const productContainer = document.getElementById("productContainer");

// Fetch data produk dari API
async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=12");
    const data = await response.json();

    allProducts = data.products;

    productContainer.innerHTML = ""; 
    data.products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                <h4 style="margin: 0 0 10px 0; font-size:16px;">${product.title}</h4>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
            `;
      productContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    productContainer.innerHTML = "<p>Gagal memuat data produk.</p>";
  }
}

loadProducts();

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  console.log("Kata kunci pencarian:", keyword);
});

// Fungsi untuk mendapatkan keranjang dari localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (product) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1; // Update (CRUD)
        } else {
            cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 }); // Create
        }
        
        saveCart(cart);
        alert(`"${product.title}" berhasil ditambahkan ke keranjang!`);
    }
}

// Modal untuk detail produk
const modal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

// Event listener untuk tombol "Tambah ke Keranjang"
productContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    console.log("ID Produk yang diklik:", productId);
    addToCart(productId);
  }
  else if (e.target.classList.contains("detail-btn")) {
        const productId = parseInt(e.target.getAttribute("data-id"));
        showModal(productId);
    }
});

function showModal(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    modalBody.innerHTML = `
        <h2 style="font-size: 18px; margin-bottom: 10px;">${product.title}</h2>
        <img src="${product.thumbnail}" style="width:100%; max-height:200px; object-fit:contain; margin-bottom:15px;">
        <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
        <p><strong>Stok Tersedia:</strong> ${product.stock}</p>
        <p><strong>Kategori:</strong> ${product.category}</p>
        <p><strong>Harga:</strong> $${product.price}</p>
        <p style="margin-top: 10px; font-size: 13px;">${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}" style="margin-top: 20px;">Tambah ke Keranjang</button>
    `;
    modal.classList.remove("hidden");
}

// Event Delegation dalam Modal jika user klik beli di dalam modal
modalBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
        const productId = parseInt(e.target.getAttribute("data-id"));
        addToCart(productId);
        modal.classList.add("hidden");
    }
});

// Tutup Modal
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
});


loadProducts();