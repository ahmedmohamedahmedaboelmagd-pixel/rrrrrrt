// This file contains the main JavaScript functionality for the online store, including event listeners and general interactivity.

document.addEventListener('DOMContentLoaded', () => {
    // Add smooth hover effect for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.boxShadow = '0 2px 12px rgba(37,99,235,0.15)';
            link.style.transform = 'scale(1.07)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.boxShadow = '';
            link.style.transform = '';
        });
    });

    // Initialize event listeners for navigation links
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.dataset.category;
            loadCategoryPage(category);
        });
    });

    // Function to load category pages
    function loadCategoryPage(category) {
        window.location.href = `category/${category}.html`;
    }

    // Initialize shopping cart functionality
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            window.location.href = 'cart/cart.html';
        });
    }
});