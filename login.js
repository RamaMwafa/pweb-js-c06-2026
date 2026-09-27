const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const Button =
    document.getElementById("loginButton");

const errorMessage =
    document.getElementById("errorMessage");


loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === "" || password === "") {
        errorMessage.textContent =
            "Username dan password harus diisi.";
        return;
    }

    Button.textContent = "Loading...";
    errorMessage.textContent = "";

    try {
        const response =
            await fetch("https://dummyjson.com/users");
        const data =
            await response.json();
        let userada = null;
        for (let i = 0; i < data.users.length; i++) {
            if(
                data.users[i].username === username && data.users[i].password === password
            ) {
                userada = data.users[i];
                break;
            }
        }

        if(userada !== null) {
            localStorage.setItem(
                "firstName", userada.firstName
            );
            window.location.href = "products.html";
        }else{
            errorMessage.textContent =
                "Username atau password salah";
        }

    } catch (error) {
        errorMessage.textContent = "Gagal terhubung ke API";
    }

    Button.textContent = "Login";
});