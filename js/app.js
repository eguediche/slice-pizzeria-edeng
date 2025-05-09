async function fetchPizzas() {
  const res = await fetch("http://51.38.232.174:3001/products");
  return await res.json();
}

let cart = [];

document.addEventListener("DOMContentLoaded", async () => {
  const pizzas = await fetchPizzas();
  renderBasketAside();
  renderPizzas(pizzas);
  createOrderModal();
  updateBasket();
});

/* le panier vide */
function renderBasketAside() {
  const aside = document.createElement("aside");
  aside.className = "basket-aside";

  const title = document.createElement("h2");
  title.textContent = "Votre panier (0)";

  const emptyDiv = document.createElement("div");
  emptyDiv.className = "empty-basket";

  const img = document.createElement("img");
  img.src = "../images/pizza.png";
  img.alt = "";

  const text = document.createElement("p");
  text.textContent = "Votre panier est vide...";

  emptyDiv.appendChild(img);
  emptyDiv.appendChild(text);
  aside.appendChild(title);
  aside.appendChild(emptyDiv);

  const mainWrapper = document.querySelector(".main-wrapper");
  mainWrapper.appendChild(aside);
}

/* afficher les pizzas en js */
function renderPizzas(pizzaList) {
  const container = document.querySelector(".pizzas-wrapper");
  container.innerHTML = "";

  pizzaList.forEach((pizza) => {
    const div = document.createElement("div");
    div.className = "pizza-item";
    div.innerHTML = `
      <img class="pizza-picture" src="${pizza.image}" alt="${pizza.name}" />
      <span class="add-to-cart-btn">
        <img src="../images/carbon_shopping-cart-plus.svg" alt="" />
        Ajouter au panier
      </span>
      <ul class="pizza-infos">
        <li class="pizza-name">${pizza.name}</li>
        <li class="pizza-price">$${pizza.price.toFixed(2)}</li>
        <li class="pizza-description">${pizza.description || ""}</li>
      </ul>
    `;

    div.querySelector(".add-to-cart-btn").addEventListener("click", () => {
      const existing = cart.find((p) => p.name === pizza.name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...pizza, quantity: 1 });
      }
      updateBasket();
    });

    container.appendChild(div);
  });
}

/* commander des pizzas */
function updateBasket() {
  const aside = document.querySelector(".basket-aside");
  aside.innerHTML = "";

  const title = document.createElement("h2");
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  title.textContent = `Votre panier (${totalCount})`;
  aside.appendChild(title);

  if (cart.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-basket";
    const img = document.createElement("img");
    img.src = "../images/pizza.png";
    const text = document.createElement("p");
    text.textContent = "Votre panier est vide...";
    emptyDiv.appendChild(img);
    emptyDiv.appendChild(text);
    aside.appendChild(emptyDiv);
    return;
  }

  const basketDiv = document.createElement("div");
  basketDiv.className = "baskets-with-pizza";
  const ul = document.createElement("ul");
  ul.className = "basket-products";

  let totalPrice = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "basket-product-item";

    const name = document.createElement("span");
    name.className = "basket-product-item-name";
    name.textContent = item.name;

    const details = document.createElement("span");
    details.className = "basket-product-details";

    const quantity = document.createElement("span");
    quantity.className = "basket-product-details-quantity";
    quantity.textContent = `${item.quantity}x`;

    const unit = document.createElement("span");
    unit.className = "basket-product-details-unit-price";
    unit.textContent = `@ $${item.price.toFixed(2)}`;

    const total = document.createElement("span");
    total.className = "basket-product-details-total-price";
    const itemTotal = item.quantity * item.price;
    total.textContent = `$${itemTotal.toFixed(2)}`;

    details.append(quantity, unit, total);

    const removeBtn = document.createElement("img");
    removeBtn.src = "../images/remove-icon.svg";
    removeBtn.className = "basket-product-remove-icon";
    removeBtn.alt = "remove";
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", () => {
      cart = cart.filter((p) => p.name !== item.name);
      updateBasket();
    });

    li.append(name, details, removeBtn);
    ul.appendChild(li);
    totalPrice += itemTotal;
  });

  basketDiv.appendChild(ul);

  const totalP = document.createElement("p");
  totalP.className = "total-order";
  totalP.innerHTML = `
    <span class="total-order-title">Order total</span>
    <span class="total-order-price">$${totalPrice.toFixed(2)}</span>
  `;

  const deliveryInfo = document.createElement("p");
  deliveryInfo.className = "delivery-info";
  deliveryInfo.innerHTML = `This is a <span>carbon neutral</span> delivery`;

  const confirmBtn = document.createElement("a");
  confirmBtn.href = "#";
  confirmBtn.className = "confirm-order-btn";
  confirmBtn.textContent = "Confirm order";

  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showOrderModal();
  });

  basketDiv.append(totalP, deliveryInfo, confirmBtn);
  aside.appendChild(basketDiv);
}

/* crer le résultat de la commande */
function createOrderModal() {
  const wrapper = document.createElement("div");
  wrapper.className = "order-modal-wrapper";
  wrapper.style.display = "none";

  const modal = document.createElement("div");
  modal.className = "order-modal";

  modal.innerHTML = `
    <img src="../images/carbon_checkmark-outline.svg" alt="">
    <p class="order-modal-title">Order Confirmed</p>
    <p class="order-modal-subtitle">We hope you enjoy your food!</p>
    <ul class="order-detail"></ul>
    <a class="new-order-btn" href="#">Start new order</a>
  `;

  wrapper.appendChild(modal);
  document.body.appendChild(wrapper);

  modal.querySelector(".new-order-btn").addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.style.display = "none";
  });
}

/* nous montre le résumer de la commande */
function showOrderModal() {
  const wrapper = document.querySelector(".order-modal-wrapper");
  const detailList = wrapper.querySelector(".order-detail");
  detailList.innerHTML = "";

  let totalPrice = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "order-detail-product-item";
    li.innerHTML = `
      <img class="order-detail-product-image" src="${item.image}" alt="">
      <span class="order-detail-product-name">${item.name}</span>
      <span class="order-detail-product-quantity">${item.quantity}x</span>
      <span class="order-detail-product-unit-price">@ $${item.price.toFixed(2)}</span>
      <span class="order-detail-product-total-price">$${(item.quantity * item.price).toFixed(2)}</span>
    `;
    detailList.appendChild(li);
    totalPrice += item.quantity * item.price;
  });

  const totalLi = document.createElement("li");
  totalLi.className = "order-detail-total-price";
  totalLi.innerHTML = `
    <span class="total-order-title">Order total</span>
    <span class="total-order-price">$${totalPrice.toFixed(2)}</span>
  `;

  detailList.appendChild(totalLi);

  wrapper.style.display = "flex";
  cart = [];
  updateBasket();
}