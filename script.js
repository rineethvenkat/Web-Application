(function () {
    function showMessage(id, message, type) {
        const element = document.getElementById(id);
        if (!element) return;
        element.className = `mt-3 ${type}`;
        element.textContent = message;
    }

    function getCart() {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function getStoredUser(email) {
        const direct = localStorage.getItem(email);
        const keyed = localStorage.getItem(`user:${email}`);
        if (keyed) return JSON.parse(keyed);
        if (direct) return JSON.parse(direct);
        return null;
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelectorAll(".cart-count").forEach((node) => {
            node.textContent = count;
        });
    }

    function getCurrentUser() {
        const email = localStorage.getItem("loggedInUser");
        if (!email) return null;
        return getStoredUser(email);
    }

    function updateAuthLink() {
        const user = getCurrentUser();
        document.querySelectorAll(".guest-only").forEach((node) => {
            node.classList.toggle("d-none", !!user);
        });
        document.querySelectorAll(".user-only").forEach((node) => {
            node.classList.toggle("d-none", !user);
        });

        const userNameLabel = document.getElementById("userNameLabel");
        if (userNameLabel) {
            userNameLabel.textContent = user ? `Hi, ${user.name || user.email}` : "";
        }

        const logoutLink = document.getElementById("logoutLink");
        if (logoutLink) {
            logoutLink.onclick = (event) => {
                event.preventDefault();
                localStorage.removeItem("loggedInUser");
                updateAuthLink();
                showMessage("loginMsg", "You have been logged out.", "text-info");
                window.location.href = "index.html";
            };
        }
    }

    function register() {
        const name = document.getElementById("regName")?.value.trim() || "";
        const email = document.getElementById("regEmail")?.value.trim() || "";
        const pass = document.getElementById("regPass")?.value || "";

        if (!name || !email || !pass) {
            showMessage("regMsg", "Please complete all fields.", "text-danger");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage("regMsg", "Please enter a valid email address.", "text-danger");
            return;
        }

        if (getStoredUser(email)) {
            showMessage("regMsg", "An account with this email already exists.", "text-danger");
            return;
        }

        const user = { name, email, pass };
        localStorage.setItem(`user:${email}`, JSON.stringify(user));
        localStorage.setItem(email, JSON.stringify(user));
        showMessage("regMsg", "Registration successful! Redirecting to login...", "text-success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 700);
    }

    function login() {
        const email = document.getElementById("loginEmail")?.value.trim() || "";
        const pass = document.getElementById("loginPass")?.value || "";

        if (!email || !pass) {
            showMessage("loginMsg", "Please enter your email and password.", "text-danger");
            return;
        }

        const user = getStoredUser(email);
        if (user && user.pass === pass) {
            localStorage.setItem("loggedInUser", user.email);
            updateAuthLink();
            showMessage("loginMsg", `Welcome back, ${user.name || user.email}!`, "text-success");
            setTimeout(() => {
                window.location.href = "menu.html";
            }, 500);
        } else {
            showMessage("loginMsg", "Invalid email or password.", "text-danger");
        }
    }

    function showPopup(message) {
        let popup = document.getElementById("toastPopup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "toastPopup";
            popup.className = "toast-popup";
            document.body.appendChild(popup);
        }

        popup.textContent = message;
        popup.classList.add("show");
        clearTimeout(showPopup.timeout);
        showPopup.timeout = setTimeout(() => popup.classList.remove("show"), 1800);
    }

    function changeQtyFromMenu(name, value) {
        const qtyElement = document.getElementById(`qty-${name}`);
        if (!qtyElement) return;

        const currentQty = Number(qtyElement.textContent || 1);
        const nextQty = Math.max(1, currentQty + value);
        qtyElement.textContent = nextQty;
    }

    function addToCart(name, price) {
        const cart = getCart();
        const item = cart.find((entry) => entry.name === name);
        const qtyElement = document.getElementById(`qty-${name}`);
        const quantity = qtyElement ? Number(qtyElement.textContent || 1) : 1;

        if (item) {
            item.qty += quantity;
        } else {
            cart.push({ name, price, qty: quantity });
        }

        saveCart(cart);
        showMessage("cartNotice", `${name} added to your cart.`, "text-success");
        showPopup(`${name} added to cart`);

        if (qtyElement) {
            qtyElement.textContent = 1;
        }
    }

    function loadCart() {
        const cart = getCart();
        const table = document.getElementById("cartTable");
        const totalElement = document.getElementById("grandTotal");
        const orderMessage = document.getElementById("orderMsg");

        if (!table) {
            updateCartCount();
            return;
        }

        table.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            table.innerHTML = `<tr><td colspan="5" class="text-center py-4">Your cart is empty. Start with a delicious meal!</td></tr>`;
        } else {
            cart.forEach((item, index) => {
                const rowTotal = item.price * item.qty;
                total += rowTotal;
                table.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-danger" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="changeQty(${index}, 1)">+</button>
              </div>
            </td>
            <td>₹${rowTotal}</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Remove</button></td>
          </tr>`;
            });
        }

        if (totalElement) {
            totalElement.textContent = total;
        }

        if (orderMessage) {
            orderMessage.textContent = "";
        }

        updateCartCount();
    }

    function changeQty(index, value) {
        const cart = getCart();
        const item = cart[index];

        if (!item) return;

        item.qty += value;
        if (item.qty <= 0) {
            cart.splice(index, 1);
        }

        saveCart(cart);
        loadCart();
    }

    function removeItem(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        loadCart();
    }

    function getOrderHistory() {
        return JSON.parse(localStorage.getItem("orderHistory") || "[]");
    }

    function renderOrderHistory() {
        const historyContainer = document.getElementById("orderHistory");
        if (!historyContainer) return;

        const history = getOrderHistory();
        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="text-muted">No orders yet.</p>';
            return;
        }

        historyContainer.innerHTML = history.map((order) => `
            <div class="border rounded p-3 mb-2">
                <div class="d-flex justify-content-between">
                    <strong>${order.date}</strong>
                    <span class="text-success">Delivered</span>
                </div>
                <div class="small text-muted">${order.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}</div>
            </div>
        `).join("");
    }

    function placeOrder() {
        const orderMessage = document.getElementById("orderMsg");
        if (!localStorage.getItem("loggedInUser")) {
            showMessage("orderMsg", "Please log in before placing an order.", "text-danger");
            return;
        }

        const cart = getCart();
        if (cart.length === 0) {
            showMessage("orderMsg", "Your cart is empty. Add some tasty items first.", "text-warning");
            return;
        }

        const history = getOrderHistory();
        history.unshift({
            date: new Date().toLocaleString(),
            items: cart.map((item) => ({ name: item.name, qty: item.qty }))
        });
        localStorage.setItem("orderHistory", JSON.stringify(history));

        showMessage("orderMsg", "Order placed successfully! Your food is on the way.", "text-success");
        showPopup("Order placed successfully");
        localStorage.removeItem("cart");
        loadCart();
        renderOrderHistory();
    }

    function submitContactForm(event) {
        event.preventDefault();
        const name = document.getElementById("contactName")?.value.trim() || "";
        const email = document.getElementById("contactEmail")?.value.trim() || "";
        const message = document.getElementById("contactMessage")?.value.trim() || "";

        if (!name || !email || !message) {
            showMessage("contactMsg", "Please fill in all fields so we can reach you.", "text-danger");
            return;
        }

        showMessage("contactMsg", "Thanks for reaching out! We will get back to you soon.", "text-success");
        event.target.reset();
    }

    function initApp() {
        loadCart();
        updateAuthLink();
        renderOrderHistory();

        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();
                login();
            });
        }

        const contactForm = document.getElementById("contactForm");
        if (contactForm) {
            contactForm.addEventListener("submit", submitContactForm);
        }
    }

    document.addEventListener("DOMContentLoaded", initApp);

    window.register = register;
    window.login = login;
    window.addToCart = addToCart;
    window.loadCart = loadCart;
    window.changeQty = changeQty;
    window.changeQtyFromMenu = changeQtyFromMenu;
    window.removeItem = removeItem;
    window.placeOrder = placeOrder;
    window.submitContactForm = submitContactForm;
})();
