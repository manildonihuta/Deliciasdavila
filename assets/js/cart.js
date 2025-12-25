(function () {
  "use strict";

  // State
  let cart = [];
  const PHONE_NUMBER = "258868856210";

  // Selectors
  const cartBtn = document.createElement("button");
  const cartOverlay = document.createElement("div");

  // Initialize Cart UI Elements in DOM
  function initCartElements() {
    // 1. Create Floating Button
    cartBtn.className = "cart-floating-btn";
    cartBtn.innerHTML = `
      <i class="bi bi-cart"></i>
      <span class="cart-counter">0</span>
    `;
    document.body.appendChild(cartBtn);

    // 2. Create Modal Overlay
    cartOverlay.className = "cart-modal-overlay";
    cartOverlay.innerHTML = `
      <div class="cart-modal">
        <div class="cart-header">
          <h3>Seu Pedido</h3>
          <button class="close-cart-btn">&times;</button>
        </div>
        <div class="cart-items">
          <!-- Items will be injected here -->
          <div class="empty-cart-msg">Seu carrinho está vazio.</div>
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="total-price">0 MZN</span>
          </div>
          <button class="checkout-btn">
            <i class="bi bi-whatsapp"></i> Finalizar Pedido
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(cartOverlay);

    // Event Listeners for UI
    cartBtn.addEventListener("click", toggleCart);
    cartOverlay
      .querySelector(".close-cart-btn")
      .addEventListener("click", toggleCart);
    cartOverlay.addEventListener("click", (e) => {
      if (e.target === cartOverlay) toggleCart();
    });

    const checkoutBtn = cartOverlay.querySelector(".checkout-btn");
    checkoutBtn.addEventListener("click", checkout);
  }

  // Setup "Add to Cart" buttons
  function setupMenuButtons() {
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach((item, index) => {
      // Create button
      const btn = document.createElement("button");
      btn.className = "add-to-cart-btn";
      btn.innerText = "Adicionar";

      // Extract data
      const titleEl = item.querySelector(".menu-content a");
      const priceEl = item.querySelector(".menu-content span");

      if (titleEl && priceEl) {
        const name = titleEl.innerText.trim();
        // Parse price: remove "MZN" and whitespace
        const priceStr = priceEl.innerText.replace("MZN", "").trim();
        const price = parseFloat(priceStr);

        btn.addEventListener("click", () => {
          addToCart(name, price);
          // Optional interaction: shake cart icon or show toast
          cartBtn.style.transform = "scale(1.2)";
          setTimeout(() => (cartBtn.style.transform = "scale(1)"), 200);
        });

        // Append button below ingredients
        const ingredients = item.querySelector(".menu-ingredients");
        if (ingredients) {
          ingredients.parentNode.insertBefore(btn, ingredients.nextSibling);
        } else {
          item.appendChild(btn);
        }
      }
    });
  }

  // Logic
  function addToCart(name, price) {
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
  }

  function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      updateCartUI();
    }
  }

  function updateCartUI() {
    // Update Counter
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counterEl = cartBtn.querySelector(".cart-counter");
    if (counterEl) counterEl.innerText = totalCount;

    // Render Items
    const itemsContainer = cartOverlay.querySelector(".cart-items");
    const totalPriceEl = cartOverlay.querySelector(".total-price");

    if (cart.length === 0) {
      itemsContainer.innerHTML =
        '<div class="empty-cart-msg">Seu carrinho está vazio.</div>';
      totalPriceEl.innerText = "0 MZN";
      return;
    }

    itemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-price">${item.price} MZN x ${item.quantity}</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn minus">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus">+</button>
        </div>
      `;

      el.querySelector(".minus").addEventListener("click", () =>
        changeQuantity(index, -1)
      );
      el.querySelector(".plus").addEventListener("click", () =>
        changeQuantity(index, 1)
      );

      itemsContainer.appendChild(el);
    });

    totalPriceEl.innerText = `${total} MZN`;
  }

  function toggleCart() {
    const isOpen = cartOverlay.classList.contains("open");
    if (isOpen) {
      cartOverlay.classList.remove("open");
    } else {
      cartOverlay.classList.add("open");
    }
  }

  function checkout() {
    if (cart.length === 0) return;

    let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      message += `- *${item.quantity}x ${item.name}*: ${itemTotal} MZN\n`;
      total += itemTotal;
    });

    message += `\n*Total: ${total} MZN*`;
    message += `\n\nPor favor, confirmem a disponibilidade. Obrigado!`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  }

  // Initialize on load
  window.addEventListener("load", () => {
    initCartElements();
    setupMenuButtons();
  });
})();
