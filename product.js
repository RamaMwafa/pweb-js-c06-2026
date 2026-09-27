function checkAuth() {
  const userStorage = localStorage.getItem("user");

  if (!userStorage) {
    window.location.href = "login.html";
  } else {
    const userData = JSON.parse(userStorage);
    const namaPengguna = userData.username || "Pengguna";
    document.getElementById("welcomeMessage").innerText = `Selamat datang, ${namaPengguna}!`;
  }
}

async function loadProducts() {
  const productContainer = document.getElementById("productContainer");

  try {
    const response = await fetch("https://dummyjson.com/products?limit=12");
    const data = await response.json();

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

/* checkAuth(); */
loadProducts();

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  console.log("Kata kunci pencarian:", keyword);
});

const productContainer = document.getElementById("productContainer");
productContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = e.target.getAttribute("data-id");
    console.log("ID Produk yang diklik:", productId);
    alert("Fitur tambah ke keranjang sedang dikerjakan oleh rekanku!");
  }
});

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  console.log("Tombol logout ditekan");
});
