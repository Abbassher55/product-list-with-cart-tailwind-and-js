document.addEventListener("DOMContentLoaded", function () {
  loadCartFromLocalStorage();
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      displayDesserts(data);
    })
    .catch((error) => console.error("Error fetching the JSON data:", error));

  updateCartDisplay();
});

let cart = [];

function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

function displayDesserts(desserts) {
  const container = document.getElementById("desserts-products");

  desserts.forEach((dessert, index) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.index = index;

    const isInCart = cart.find((p) => p.name === dessert.name);
    const quantity = isInCart ? isInCart.quantity : 1;

    productCard.innerHTML = `
      <img src="${dessert.image.desktop}" class="hidden p-0 border-4 ${isInCart ? "border-red" : "border-transparent"} h-60 w-full rounded-lg object-cover lg:block product-image" alt="${dessert.name} Image" />
      <img src="${dessert.image.tablet}" class="hidden p-0 border-4 ${isInCart ? "border-red" : "border-transparent"} h-52 w-full rounded-lg object-cover sm:max-lg:block product-image" alt="${dessert.name} Image" />
      <img src="${dessert.image.mobile}" class="hidden p-0 border-4 ${isInCart ? "border-red" : "border-transparent"} h-52 w-full rounded-lg object-cover max-sm:block product-image" alt="${dessert.name} Image" />
      
      <button class="mx-auto flex -translate-y-1/2 rounded-full border border-rose-400 bg-rose-50 px-7 py-3 hover:bg-rose-100 add-to-cart-btn ${isInCart ? "hidden" : ""}">
        <span class="cart-icon">
          <img src="../assets/images/icon-add-to-cart.svg" alt="add to cart icon" />
        </span>
        <span class="cart-text pl-1 text-sm font-semibold">Add to Cart</span>
      </button>
      
      <div class="quantity-control ${isInCart ? "" : "hidden"} mx-auto flex w-fit -translate-y-1/2 items-center rounded-full border border-rose-400 bg-red px-7 py-3 text-white">
        <span class="decrement-icon hover:cursor-pointer">
          <img src="../assets/images/icon-decrement-quantity.svg" class="h-7 w-7 rounded-full border border-white p-2" alt="decrement-icon" />
        </span>
        <span class="cart-text mx-11 pl-1 text-sm font-bold" id="quantity-number">${quantity}</span>
        <span class="increment-icon hover:cursor-pointer">
          <img src="../assets/images/icon-increment-quantity.svg" class="h-7 w-7 rounded-full border border-white p-2" alt="increment-icon" />
        </span>
      </div>
      
      <h3 class="text-sm text-rose-500">${dessert.category}</h3>
      <h2 class="my-1 font-semibold text-rose-900">${dessert.name}</h2>
      <p class="price font-semibold text-red">$${dessert.price.toFixed(2)}</p>
    `;

    container.appendChild(productCard);

    // Add event listener for Add to Cart button
    const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", function () {
      addToCart(dessert, productCard);
    });

    // Add event listener for increment button
    const incrementBtn = productCard.querySelector(".increment-icon");
    incrementBtn.addEventListener("click", function () {
      updateQuantity(productCard, 1);
    });

    // Add event listener for decrement button
    const decrementBtn = productCard.querySelector(".decrement-icon");
    decrementBtn.addEventListener("click", function () {
      updateQuantity(productCard, -1);
    });
  });
}

function addToCart(product, productCard) {
  const existingProduct = cart.find((p) => p.name === product.name);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
  const quantityControl = productCard.querySelector(".quantity-control");
  const productImages = productCard.querySelectorAll(".product-image");

  addToCartBtn.classList.add("hidden");
  quantityControl.classList.remove("hidden");
  productImages.forEach((image) => {
    image.classList.add("border-4", "border-red");
    image.classList.remove("border-transparent");
  });

  updateCartDisplay();
  saveCartToLocalStorage();
}

function updateQuantity(productCard, change) {
  const index = productCard.dataset.index;
  const productName = productCard.querySelector("h2").innerText;
  const productInCart = cart.find((p) => p.name === productName);

  if (productInCart) {
    productInCart.quantity += change;
    if (productInCart.quantity < 1) {
      productInCart.quantity = 1;
    }
    const quantityNumber = productCard.querySelector("#quantity-number");
    quantityNumber.textContent = productInCart.quantity;
  }

  updateCartDisplay();
  saveCartToLocalStorage(); // Save the updated cart to localStorage
}

function updateCartDisplay() {
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");
  const totalAmountElem = document.getElementById("total-amount");
  const noOfProductsElem = document.getElementById("noOfProducts");
  const confirmOrderBtn = document.getElementById("confirm-order"); // Get the confirm order button

  cartItemsContainer.innerHTML = "";
  let totalAmount = 0;
  let totalQuantity = 0;

  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden");
    cartTotalContainer.classList.add("hidden");
    noOfProductsElem.textContent = totalQuantity;
    confirmOrderBtn.disabled = true; // Disable the confirm order button
    return;
  } else {
    emptyCartMessage.classList.add("hidden");
    cartTotalContainer.classList.remove("hidden");
    confirmOrderBtn.disabled = false; // Enable the confirm order button
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    const lineHr = document.createElement("hr");
    lineHr.className = "my-4 bg-rose-100";
    cartItem.className = "cart-item flex items-center justify-between";

    cartItem.innerHTML = `
      <div class="flex flex-col">
        <h3 class="cart-product-name text-sm font-bold text-rose-900">${item.name}</h3>
        <div class="product-details mt-2 flex items-center gap-2">
          <div class="font-bold text-red">
            <span class="quantity">${item.quantity}</span>x
          </div>
          <div class="text-sm text-rose-500">
            @ $<span class="price">${item.price.toFixed(2)}</span>
          </div>
          <div class="text-sm font-semibold text-rose-900">
             $<span class="price">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <span
        class="item-remover hover:cursor-pointer flex h-5 w-5 items-center justify-center rounded-full border border-rose-400 p-2 text-rose-400"
        data-index="${index}"
      >
        X
      </span>
    `;

    cartItemsContainer.appendChild(cartItem);
    cartItemsContainer.appendChild(lineHr);
    totalAmount += item.price * item.quantity;
    totalQuantity += item.quantity; // Calculate total quantity
  });

  totalAmountElem.textContent = totalAmount.toFixed(2);
  noOfProductsElem.textContent = totalQuantity; // Update the total items quantity

  // Add event listeners for item removers
  const removeButtons = cartItemsContainer.querySelectorAll(".item-remover");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  const removedItem = cart.splice(index, 1)[0];

  // Update the cart display
  updateCartDisplay();
  saveCartToLocalStorage(); // Save the updated cart to localStorage

  const productCards = document.querySelectorAll(".product-card");

  // Reset product states
  productCards.forEach((productCard) => {
    const productName = productCard.querySelector("h2").innerText;

    // Check if the removed item matches the product card
    if (productName === removedItem.name) {
      const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
      const quantityControl = productCard.querySelector(".quantity-control");
      const quantityNumber = productCard.querySelector("#quantity-number");
      const productImages = productCard.querySelectorAll(".product-image");

      // Show Add to Cart button and hide quantity control
      addToCartBtn.classList.remove("hidden");
      quantityControl.classList.add("hidden");

      // Reset quantity number to 1
      quantityNumber.textContent = 1;

      // Remove border from images
      productImages.forEach((image) => {
        image.classList.remove("border-red");
        image.classList.add("border-transparent");
      });
    }
  });

  // If the cart is empty, show the "Add to Cart" button for all products
  if (cart.length === 0) {
    productCards.forEach((productCard) => {
      const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
      const quantityControl = productCard.querySelector(".quantity-control");

      // Show Add to Cart button
      addToCartBtn.classList.remove("hidden");
      quantityControl.classList.add("hidden"); // Ensure quantity control is hidden
    });
  }

  console.log(
    `Removed: ${removedItem.name}. Current cart length: ${cart.length}`,
  );
}
function populateOrderModal() {
  const modalContent = document.getElementById("ordered-products");
  modalContent.innerHTML = ""; // Clear previous content
  let total = 0; // Initialize total

  cart.forEach((item, index) => {
    const orderItem = document.createElement("div");
    orderItem.className = "order-item flex items-center justify-between";
    orderItem.innerHTML = `
      <div class="item flex gap-4">
        <img
          src="${item.image.desktop || "fallback-image-url.jpg"}"
          class="size-12 rounded"
          alt="${item.name}"
        />
        <div class="flex flex-col">
          <h3 class="cart-product-name text-sm font-bold text-rose-900">
            ${item.name}
          </h3>
          <div class="product-details mt-2 flex items-center gap-2">
            <div class="font-bold text-red">
              <span class="quantity">${item.quantity}</span>x
            </div>
            <div class="text-sm text-rose-500">
              @ $<span class="price">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="text-sm font-semibold text-rose-900">
        $<span class="price">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    modalContent.appendChild(orderItem);

    total += item.price * item.quantity; // Calculate total here

    const hr = document.createElement("hr");
    hr.className = "my-6 bg-rose-100";
    modalContent.appendChild(hr);
  });

  // Update the total amount in the modal after all items have been added
  const totalAmountElement = document.getElementById("order-total-amount");
  if (totalAmountElement) {
    totalAmountElement.textContent = total.toFixed(2); // Ensure correct formatting
  } else {
    console.error("Element with ID 'total-amount' not found.");
  }
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
document.getElementById("confirm-order").addEventListener("click", function () {
  populateOrderModal();
  document.getElementById("modal").classList.remove("hidden");
});

document
  .getElementById("start-new-order")
  .addEventListener("click", function () {
    cart = [];
    saveCartToLocalStorage();
    const modal = document.getElementById("modal");
    if (modal) {
      modal.classList.add("hidden");
    }
    updateCartDisplay();
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((productCard) => {
      const quantityControl = productCard.querySelector(".quantity-control");
      const quantityNumber = productCard.querySelector("#quantity-number");
      const productImages = productCard.querySelectorAll(".product-image");

      if (quantityControl) {
        quantityControl.classList.add("hidden");
      }
      if (quantityNumber) {
        quantityNumber.textContent = 1; // Reset quantity to 1
      }

      productImages.forEach((image) => {
        image.classList.remove("border-red");
        image.classList.add("border-transparent");
      });

      // Show the "Add to Cart" button again for each product
      const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
      if (addToCartBtn) {
        addToCartBtn.classList.remove("hidden");
      }
    });
  });

document.getElementById("backdrop").addEventListener("click", function () {
  document.getElementById("modal").classList.add("hidden");
});
