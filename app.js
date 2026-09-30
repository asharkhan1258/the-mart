const KEY = 'theMartCart';
let cart = JSON.parse(localStorage.getItem(KEY) || '[]');

const money = n => '$' + Number(n).toFixed(2);

function save() {
    localStorage.setItem(KEY, JSON.stringify(cart));
    renderCart();
}

function addItem(name, price, image) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price: Number(price), image, qty: 1 });
    }

    save();
}

function renderCart() {
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    });

    const box = document.getElementById('cartItems');
    if (!box) return;

    if (!cart.length) {
        box.innerHTML = '<div class="text-center text-secondary py-5"><i class="bi bi-cart-x fs-1"></i><p>Your cart is empty.</p></div>';
    } else {
        box.innerHTML = cart.map((item, index) => `
            <div class="cart-row d-flex gap-3">
                <img class="cart-thumb" src="${item.image}" alt="">
                <div class="flex-grow-1">
                    <strong>${item.name}</strong>
                    <div class="small text-secondary">${money(item.price)} each</div>
                    <div class="d-flex align-items-center gap-2 mt-2">
                        <button class="btn btn-outline-secondary qty-btn" onclick="changeQty(${index},-1)">−</button>
                        <span>${item.qty}</span>
                        <button class="btn btn-outline-secondary qty-btn" onclick="changeQty(${index},1)">+</button>
                        <button class="btn btn-link text-danger btn-sm ms-auto" onclick="removeItem(${index})">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    document.getElementById('cartTotal').textContent = money(total);
}

window.changeQty = (index, difference) => {
    cart[index].qty += difference;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    save();
};

window.removeItem = index => {
    cart.splice(index, 1);
    save();
};

document.addEventListener('click', event => {
    const button = event.target.closest('.add-cart');

    if (button) {
        addItem(button.dataset.name, button.dataset.price, button.dataset.image);
        button.textContent = 'Added ✓';
        setTimeout(() => button.textContent = 'Add to Cart', 700);
    }

    if (event.target.closest('.slider-next')) {
        document.querySelector('.product-slider')?.scrollBy({ left: 600, behavior: 'smooth' });
    }

    if (event.target.closest('.slider-prev')) {
        document.querySelector('.product-slider')?.scrollBy({ left: -600, behavior: 'smooth' });
    }
});

document.getElementById('clearCart')?.addEventListener('click', () => {
    cart = [];
    save();
});

document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!cart.length) return alert('Your cart is empty.');

    alert(
        'Checkout is ready for payment integration. Your order total is ' +
        document.getElementById('cartTotal').textContent +
        '.'
    );
});

document.querySelector('.contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    alert('Thank you. Your message form is ready to connect to your email/backend service.');
    event.target.reset();
});

renderCart();
