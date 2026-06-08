const cart = JSON.parse(localStorage.getItem('sokolCart')) || [];
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function saveCart() {
  localStorage.setItem('sokolCart', JSON.stringify(cart));
}

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">Корзина пустая</p>';
  }

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div>
        <b>${item.name}</b>
        <p>₴${item.price} × ${item.qty}</p>
      </div>
      <div class="qty">
        <button data-action="minus" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button data-action="plus" data-id="${item.id}">+</button>
        <button data-action="remove" data-id="${item.id}">🗑️</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartCount.textContent = count;
  cartTotal.textContent = `₴${total}`;
  saveCart();
}

function addToCart(product) {
  const found = cart.find(item => item.id === product.id);
  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  openCart();
}

function openCart() {
  cartPanel.classList.add('active');
  overlay.classList.add('active');
}

function closeCart() {
  cartPanel.classList.remove('active');
  overlay.classList.remove('active');
}

document.querySelectorAll('.add-cart').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    addToCart({
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price)
    });
  });
});

document.querySelectorAll('.fav').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '♥' : '♡';
  });
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  const item = cart.find(product => product.id === id);

  if (action === 'plus') item.qty += 1;
  if (action === 'minus') item.qty -= 1;
  if (action === 'remove' || item.qty <= 0) {
    const index = cart.findIndex(product => product.id === id);
    cart.splice(index, 1);
  }

  renderCart();
});

document.getElementById('cartOpen').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Корзина пустая');
    return;
  }

  const order = cart.map(item => `${item.name} — ${item.qty} шт. — ₴${item.price * item.qty}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = encodeURIComponent(`Здравствуйте! Хочу оформить заказ:\n\n${order}\n\nИтого: ₴${total}`);

  window.open(`https://t.me/share/url?url=&text=${message}`, '_blank');
});

renderCart();
