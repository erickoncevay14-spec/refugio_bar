class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.cartIcon = document.getElementById('cartIcon');
        this.cartDropdown = document.getElementById('cartDropdown');
        this.cartCount = document.getElementById('cartCount');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');

        this.bindEvents();
        this.loadFromStorage();
    }

    bindEvents() {
        // Toggle carrito
        this.cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCart();
        });

        // Cerrar carrito al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.cartDropdown.contains(e.target) && !this.cartIcon.contains(e.target)) {
                this.closeCart();
            }
        });

        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            this.checkout();
        });
    }

    toggleCart() {
        this.cartDropdown.classList.toggle('active');
    }

    closeCart() {
        this.cartDropdown.classList.remove('active');
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.updateCart();
        this.animateCartIcon();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.updateCart();
            }
        }
    }

    updateCart() {
        this.updateCartCount();
        this.updateCartTotal();
        this.renderCartItems();
        this.saveToStorage();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    updateCartTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotal.textContent = `Total: $${this.total.toFixed(2)}`;
    }

    renderCartItems() {
        if (this.items.length === 0) {
            this.cartItems.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
            return;
        }

        this.cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="cart.removeItem(${item.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    animateCartIcon() {
        this.cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.cartIcon.style.transform = 'scale(1)';
        }, 200);
    }

    saveToStorage() {
        // En lugar de localStorage, usar variables globales
        window.cartData = {
            items: this.items,
            total: this.total
        };
    }

    loadFromStorage() {
        // Cargar de variables globales en lugar de localStorage
        if (window.cartData) {
            this.items = window.cartData.items || [];
            this.total = window.cartData.total || 0;
            this.updateCart();
        }
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        alert(`Procesando pedido por $${this.total.toFixed(2)}`);
        // Aquí puedes integrar con tu sistema de pagos
        this.clearCart();
    }

    clearCart() {
        this.items = [];
        this.total = 0;
        this.updateCart();
        this.closeCart();
    }
}

// Inicializar carrito
const cart = new ShoppingCart();

// Función para agregar productos (úsala en tus botones de productos)
function addToCart(id, name, price, image = '') {
    cart.addItem({ id, name, price, image });
}

// Ejemplo de uso:
// <button onclick="addToCart(1, 'Cerveza Corona', 5.50, 'imagen.jpg')">Agregar al Carrito</button>