// ==========================================
// BAGIAN 1: SUDAH SELESAI
// Logika dasar, Proteksi Halaman, & Render Produk
// ==========================================

// 1. Proteksi Halaman (Auth Guard)
function checkAuth() {
  // Mengecek keberadaan data 'user' di Local Storage
  const userStorage = localStorage.getItem("user");

  if (!userStorage) {
    // Jika belum login, redirect paksa kembali ke login.html
    window.location.href = "login.html";
  } else {
    // Jika sudah login, tampilkan ucapan selamat datang di Navigation Bar
    const userData = JSON.parse(userStorage);
    // Asumsi data user memiliki properti 'username' atau 'name'
    const namaPengguna = userData.username || "Pengguna";
    document.getElementById("welcomeMessage").innerText = `Selamat datang, ${namaPengguna}!`;
  }
}

// 2. Fetch dan Render Data Produk
async function loadProducts() {
  const productContainer = document.getElementById("productContainer");

  try {
    // Mengambil data produk (Misal menggunakan dummyjson API seperti di iframe dokumenmu)
    const response = await fetch("https://dummyjson.com/products?limit=12");
    const data = await response.json();

    // Render produk ke HTML
    productContainer.innerHTML = ""; // Kosongkan container dulu
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

// Jalankan fungsi saat halaman dimuat
/* checkAuth(); */
loadProducts();

// ==========================================
// BAGIAN 2: SETENGAHNYA LAGI UNTUK REKANMU
// ==========================================

// TODO 1: Fitur Pencarian Produk (Search Bar)
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  console.log("Kata kunci pencarian:", keyword);
  // REKANMU: Tambahkan logika untuk memfilter elemen produk yang tampil di layar
  // berdasarkan 'keyword' yang diketik.
});

// TODO 2: Fitur Tambah ke Keranjang
const productContainer = document.getElementById("productContainer");
productContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = e.target.getAttribute("data-id");
    console.log("ID Produk yang diklik:", productId);
    // REKANMU: Tambahkan logika untuk menyimpan produk ini ke Local Storage (keranjang)
    // dan berikan alert/notifikasi sukses.
    alert("Fitur tambah ke keranjang sedang dikerjakan oleh rekanku!");
  }
});

// TODO 3: Fitur Logout
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  // REKANMU: Tambahkan logika untuk menghapus data 'user' dari Local Storage
  // lalu arahkan (redirect) kembali ke halaman login.html
  console.log("Tombol logout ditekan");
});
