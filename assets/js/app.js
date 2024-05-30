document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product-card-div1');
    const searchInput = document.querySelector('.search-input');
    const filters = document.querySelectorAll('.list-input-main');
    const cartBadge = document.querySelector('.nav-header-menu-icon-badge');
    let cartCount = 0;

    // Load cart count from local storage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount = storedCart.length;
    cartBadge.textContent = cartCount;

    // Search Functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        products.forEach(product => {
            const name = product.querySelector('.product-card-div2-name').textContent.toLowerCase();
            const isMatch = name.includes(query);
            product.style.display = isMatch ? 'block' : 'none';
        });
    });

    // Filter Functionality
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const activeFilters = getActiveFilters();
            products.forEach(product => {
                const productColor = getProductColor(product);
                const productGender = getProductGender(product);
                const productPrice = getProductPrice(product);
                const productType = getProductType(product);

                const isVisible =
                    (activeFilters.colors.length === 0 || activeFilters.colors.includes(productColor)) &&
                    (activeFilters.genders.length === 0 || activeFilters.genders.includes(productGender)) &&
                    (activeFilters.prices.length === 0 || activeFilters.prices.some(priceRange => isPriceInRange(productPrice, priceRange))) &&
                    (activeFilters.types.length === 0 || activeFilters.types.includes(productType));

                product.style.display = isVisible ? 'block' : 'none';
            });
        });
    });

    function getActiveFilters() {
        const colors = [];
        const genders = [];
        const prices = [];
        const types = [];

        filters.forEach(filter => {
            if (filter.checked) {
                const filterLabel = filter.nextElementSibling.textContent.toLowerCase();
                const filterId = filter.id;

                if (['red', 'blue', 'green'].includes(filterId)) {
                    colors.push(filterLabel);
                } else if (['men', 'women'].includes(filterId)) {
                    genders.push(filterLabel);
                } else if (['initial-cost', 'second-range', 'third-range'].includes(filterId)) {
                    prices.push(filterLabel);
                } else if (['polo', 'hoodie', 'basic'].includes(filterId)) {
                    types.push(filterLabel);
                }
            }
        });

        return { colors, genders, prices, types };
    }

    function getProductColor(product) {
        const productName = product.querySelector('.product-card-div2-name').textContent.toLowerCase();
        if (productName.includes('red')) return 'red';
        if (productName.includes('blue')) return 'blue';
        if (productName.includes('green')) return 'green';
        return '';
    }

    function getProductGender(product) {
        if (product.classList.contains('men') && product.classList.contains('women')) return 'unisex';
        if (product.classList.contains('men')) return 'men';
        if (product.classList.contains('women')) return 'women';
        return '';
    }

    function getProductPrice(product) {
        const priceText = product.querySelector('.product-card-div3-price').textContent;
        const price = parseInt(priceText.replace('Rs:', '').trim());
        return price;
    }

    function getProductType(product) {
        const productName = product.querySelector('.product-card-div2-name').textContent.toLowerCase();
        if (productName.includes('polo')) return 'polo';
        if (productName.includes('hoodie')) return 'hoodie';
        if (productName.includes('basic')) return 'basic';
        return '';
    }

    function isPriceInRange(price, rangeLabel) {
        if (rangeLabel === '0-rs250') return price >= 0 && price <= 250;
        if (rangeLabel === 'rs251-450') return price > 250 && price <= 450;
        if (rangeLabel === 'rs450 & above') return price > 450;
        return false;
    }

    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.product-card-div3-addtocart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card-div1');
            const productName = productCard.querySelector('.product-card-div2-name').textContent;
            const productPrice = productCard.querySelector('.product-card-div3-price').textContent;
            const productImageSrc = productCard.querySelector('.product-card-div2-img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImageSrc,
                quantity: 1 // Initialize quantity
            };

            // Save to local storage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(p => p.name === productName);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update cart count
            cartCount = cart.length;
            cartBadge.textContent = cartCount;
        });
    });
});
