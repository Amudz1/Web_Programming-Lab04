// Cart functionality
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-3"></i>
                <h4>Корзина пуста</h4>
                <p class="text-muted">Добавьте товары из каталога</p>
                <a href="products.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
        updateTotals();
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item mb-3 p-3 border-bottom">
            <div class="row align-items-center">
                <div class="col-md-2 text-center">
                    <i class="fas fa-tshirt fa-3x text-primary"></i>
                </div>
                <div class="col-md-4">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted small mb-0">Размер: M</p>
                </div>
                <div class="col-md-2">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                        </div>
                        <input type="text" class="form-control text-center" value="${item.quantity || 1}" readonly>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <strong>${item.price}</strong>
                </div>
                <div class="col-md-2 text-center">
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateTotals();
}

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace(/[^\d]/g, ''));
        const quantity = item.quantity || 1;
        subtotal += price * quantity;
    });

    const shipping = cart.length > 0 ? 300 : 0;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString()} ₽`;
    if (shippingEl) shippingEl.textContent = `${shipping.toLocaleString()} ₽`;
    if (totalEl) totalEl.textContent = `${total.toLocaleString()} ₽`;
}

// Clear cart
const clearCartBtn = document.getElementById('clearCart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            localStorage.setItem('cart', JSON.stringify([]));
            loadCart();
            updateCartCount();
        }
    });
}

// Load cart on page load
if (document.getElementById('cartItems')) {
    loadCart();
}