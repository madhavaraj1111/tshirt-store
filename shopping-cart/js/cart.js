document.addEventListener('DOMContentLoaded', () => {
    const cartWrap = document.querySelector('.cart-wrap');
    const totalAmountElement = document.querySelector('.cart-amount-totalname-rs-price');
    const cartBadge = document.querySelector('.nav-header-menu-icon-badge');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize cart badge
    cartBadge.textContent = cart.length;

    let totalAmount = 0;

    // Function to render cart items
    function renderCart() {
        cartWrap.innerHTML = ''; // Clear previous content
        totalAmount = 0;

        cart.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('cart-product');
            productElement.innerHTML = `
                <div class="cart-product-tshirt">
                    <img src="${product.image}" alt="tshirt" width="120px" />
                    <div class="cart-product-desc">
                        <p class="cart-product-name">${product.name}</p>
                        <h5 class="cart-product-price"><span>Rs:</span>${product.price.replace('Rs:', '').trim()}</h5>
                    </div>
                </div>
                <div class="cart-product-quantity">
                    <div class="cart-product-quantity-wrap">
                        <button class="cart-product-quantity-decrement"><span>-</span></button>
                        <input type="text" value="${product.quantity}" class="cart-product-quantity-input" />
                        <button class="cart-product-quantity-increment"><span>+</span></button>
                    </div>
                    <button class="cart-product-quantity-delete">Remove</button>
                </div>
            `;

            const decrementButton = productElement.querySelector('.cart-product-quantity-decrement');
            const incrementButton = productElement.querySelector('.cart-product-quantity-increment');
            const deleteButton = productElement.querySelector('.cart-product-quantity-delete');
            const quantityInput = productElement.querySelector('.cart-product-quantity-input');

            decrementButton.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity;
                    product.quantity = quantity;
                } else {
                    cart.splice(cart.indexOf(product), 1);
                    productElement.remove();
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalAmount();
                updateCartBadge();
            });

            incrementButton.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                quantity++;
                quantityInput.value = quantity;
                product.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalAmount();
            });

            deleteButton.addEventListener('click', () => {
                cart.splice(cart.indexOf(product), 1);
                productElement.remove();
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalAmount();
                updateCartBadge();
            });

            cartWrap.appendChild(productElement);

            totalAmount += parseInt(product.price.replace('Rs:', '').trim()) * product.quantity;
        });

        totalAmountElement.textContent = totalAmount;
    }

    function updateTotalAmount() {
        let newTotalAmount = 0;
        cartWrap.querySelectorAll('.cart-product').forEach(productElement => {
            const price = parseInt(productElement.querySelector('.cart-product-price').textContent.replace('Rs:', '').trim());
            const quantity = parseInt(productElement.querySelector('.cart-product-quantity-input').value);
            newTotalAmount += price * quantity;
        });
        totalAmountElement.textContent = newTotalAmount;
    }

    function updateCartBadge() {
        cartBadge.textContent = cart.length;
    }

    renderCart();
});
