// This file manages the shopping cart functionality, including adding and removing items from the cart and updating the cart total.
// This file manages the shopping cart functionality, including adding and removing items from the cart and updating the cart total.

// 1. Load cart from localStorage or initialize as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart (Used by product.js)
// Note: product.js handles the logic to save to localStorage now.
function addToCart(product) {
    // This function is mostly here for compatibility, the main saving logic is in product.js
    // It can be removed if not used elsewhere, but we'll keep it simple for now.
}

// Function to remove item from cart
function removeFromCart(productId) {
    // Ensure that productId is handled as string since we use string IDs now
    cart = cart.filter(item => item.id !== String(productId));
    updateCart(); // Update display and save to localStorage
}

// Function to update cart total and save to localStorage
function updateCart() {
    const cartTotal = cart.reduce((total, item) => total + item.price, 0);
    
    // Targeting #total-price element from cart.html
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.innerText = `الإجمالي: $${cartTotal.toFixed(2)}`;
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    displayCartItems();
}

// Function to display cart items
function displayCartItems() {
    // Targeting the list element from cart.html: <ul id="cart-list">
    const cartListContainer = document.getElementById('cart-list');
    
    if (!cartListContainer) return;

    cartListContainer.innerHTML = '';

    const checkoutButton = document.getElementById('checkout-button');
    
    if (cart.length === 0) {
        cartListContainer.innerHTML = '<li style="text-align: center; color: #64748b; padding: 20px;">سلة التسوق فارغة حالياً.</li>';
        if (checkoutButton) checkoutButton.disabled = true;
    } else {
        if (checkoutButton) checkoutButton.disabled = false;
        
        cart.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.className = 'cart-item';
            // Note: We use the item.id as a string in the removeFromCart function call.
            itemElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                    <div style="flex-grow: 1;">
                        <h4 style="margin: 0; color: #0f172a;">${item.name}</h4>
                        <p style="margin: 5px 0 0 0; color: #475569;">السعر: $${item.price.toFixed(2)}</p>
                    </div>
                    <button 
                        onclick="removeFromCart('${item.id}')" 
                        style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                        إزالة
                    </button>
                </div>
            `;
            cartListContainer.appendChild(itemElement);
        });
    }
}

// مثال: السلة مخزنة في localStorage باسم "cart"
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const totalPriceDiv = document.getElementById('total-price');
    const cart = getCart();
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li>السلة فارغة.</li>';
        totalPriceDiv.textContent = 'الإجمالي: $0.00';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="cart-item">
                <span>${item.name}</span>
                <div>
                    <button onclick="decreaseQuantity('${item.id}')">-</button>
                    <span style="margin:0 8px;">${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.id}')">+</button>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        cartList.appendChild(li);
    });

    totalPriceDiv.textContent = `الإجمالي: $${total.toFixed(2)}`;
}

window.increaseQuantity = function(id) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        renderCart();
    }
};

window.decreaseQuantity = function(id) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart(cart);
        renderCart();
    } else if (item && item.quantity === 1) {
        // حذف المنتج إذا وصلت الكمية للصفر
        const newCart = cart.filter(i => i.id !== id);
        saveCart(newCart);
        renderCart();
    }
};

// Event listener for checkout button
const checkoutButton = document.getElementById('checkout-button');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('سلة التسوق فارغة!');
        } else {
            // Proceed to checkout logic here
            alert('تم المتابعة إلى صفحة الدفع!');
            // clearCart(); // Optional: clear cart after successful checkout
        }
    });
}

// Call updateCart on page load to display initial items from localStorage
document.addEventListener('DOMContentLoaded', renderCart);