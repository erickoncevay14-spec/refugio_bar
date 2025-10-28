// Variables globales
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera carrito si existe
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartIcon = document.getElementById("cartIcon");
const cartDropdown = document.getElementById("cartDropdown");

// Mostrar/ocultar carrito
cartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle("active");
});

// Botones "Agregar al carrito"
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        // 💡 NUEVO CÓDIGO: Encontrar la imagen del producto
        const productContainer = button.closest(".tequilas");
        const imgElement = productContainer.querySelector("img");
        const img = imgElement ? imgElement.src : null; // Obtener la URL de la imagen

        addToCart(name, price, img);

        // Mantener abierto al agregar
        cartDropdown.classList.add("active");
    });
});

// Función para agregar al carrito
function addToCart(name, price, img) {
    const item = cart.find(p => p.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    updateCart();
}

// Actualizar carrito
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        count += item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-img">
            <div class="cart-info">
                <span class="cart-name">${item.name}</span>
                <div class="cart-qty">
                    <button class="qty-btn" data-index="${index}" data-action="minus">➖</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-index="${index}" data-action="plus">➕</button>
                </div>
                <span class="cart-price">S/${subtotal.toFixed(2)}</span>
            </div>
            <button class="remove-btn" data-index="${index}">❌</button>
        `;
        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = `Total: S/${total.toFixed(2)}`;

    // Guardar carrito en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Eventos delegados para los botones ➕ ➖ y ❌
cartItems.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("qty-btn")) {
        e.stopPropagation();
        const index = target.getAttribute("data-index");
        const action = target.getAttribute("data-action");
        if (action === "plus") {
            cart[index].quantity++;
        } else if (action === "minus" && cart[index].quantity > 1) {
            cart[index].quantity--;
        }
        updateCart();
    } else if (target.classList.contains("remove-btn")) {
        e.stopPropagation();
        const index = target.getAttribute("data-index");
        cart.splice(index, 1);
        updateCart();
    }
});

// Función para finalizar el pedido
function finalizarPedido() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    let mensaje = "Gracias por su compra. Detalles del pedido:\n\n";
    cart.forEach(item => {
        mensaje += `${item.name} x${item.quantity} - S/${(item.price * item.quantity).toFixed(2)}\n`;
    });
    mensaje += `\nTotal: S/${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
    alert(mensaje);
    cart = [];
    updateCart();
}

// Cerrar carrito si se hace clic fuera
document.addEventListener("click", (e) => {
    if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
        cartDropdown.classList.remove("active");
    }
});

// Evitar que clics dentro lo cierren
cartDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
});

// 🔹 Al cargar la página, dibujar carrito guardado
updateCart();