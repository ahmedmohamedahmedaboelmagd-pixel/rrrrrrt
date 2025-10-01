// This file handles the functionality related to product details, such as displaying product information and managing user interactions.

// This file handles the functionality related to product details, such as displaying product information and managing user interactions.

document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromURL();
    fetchProductDetails(productId);
});

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchProductDetails(productId) {
    // *** 1. مصدر البيانات الموحد لجميع المنتجات (Unified Product Data Source) ***
    // نستخدم IDs نصية متوافقة مع الروابط الجديدة في ملفات HTML
    const productsMap = {
        'tefal-pot-5l': { 
            id: 'tefal-pot-5l', 
            name: 'حلة تيفال بطوط 5 لتر', 
            description: 'حلة تيفال بطوط سعة 5 لتر، جودة عالية ومناسبة للطهي اليومي.', 
            price: 55.00, 
            // **NOTE:** تم استخدام مسار نسبي إفتراضي. يجب تحديثه ليتطابق مع مكان حفظ صورتك.
            image: '../images/electronics/tefal-pot-5l/image-1.png' 
        },
        // منتجات أقسام الصفحة الرئيسية
        'p1': { id: 'p1', name: 'Product 1', description: 'Description of Product 1.', price: 10.00, image: 'images/product1.jpg' },
        'p2': { id: 'p2', name: 'Product 2', description: 'Description of Product 2.', price: 20.00, image: 'images/product2.jpg' },
        'p3': { id: 'p3', name: 'Product 3', description: 'Description of Product 3.', price: 30.00, image: 'images/product3.jpg' },
        
        // منتجات قسم الإلكترونيات
        'e2': { id: 'e2', name: 'Electronic Product 2', description: 'Description of Electronic Product 2.', price: 150.00, image: 'path/to/electronic-product2.jpg' },
        'e3': { id: 'e3', name: 'Electronic Product 3', description: 'Description of Electronic Product 3.', price: 250.00, image: 'path/to/electronic-product3.jpg' },
        
        // منتجات قسم التجميل
        'b1': { id: 'b1', name: 'Beauty Product 1', description: 'Description of Beauty Product 1.', price: 25.00, image: 'path/to/beauty-product1.jpg' },
        'b2': { id: 'b2', name: 'Beauty Product 2', description: 'Description of Beauty Product 2.', price: 35.00, image: 'path/to/beauty-product2.jpg' },
        'b3': { id: 'b3', name: 'Beauty Product 3', description: 'Description of Beauty Product 3.', price: 45.00, image: 'path/to/beauty-product3.jpg' },
        
        // منتجات قسم الملابس
        'c1': { id: 'c1', name: 'Clothing Item 1', description: 'Description of clothing item 1.', price: 50.00, image: 'path/to/clothing1.jpg' },
        'c2': { id: 'c2', name: 'Clothing Item 2', description: 'Description of clothing item 2.', price: 60.00, image: 'path/to/clothing2.jpg' },
        'c3': { id: 'c3', name: 'Clothing Item 3', description: 'Description of clothing item 3.', price: 70.00, image: 'path/to/clothing3.jpg' },

        // منتجات قسم الصحة
        'h1': { id: 'h1', name: 'Health Product 1', description: 'Description of Health Product 1.', price: 15.00, image: 'path/to/health-product1.jpg' },
        'h2': { id: 'h2', name: 'Health Product 2', description: 'Description of Health Product 2.', price: 25.00, image: 'path/to/health-product2.jpg' },
    'h3': { id: 'h3', name: 'Health Product 3', description: 'Description of Health Product 3.', price: 35.00, image: 'path/to/health-product3.jpg' },
    'h4': { id: 'h4', name: 'Health Product 4', description: 'Description of Health Product 4.', price: 305.00, image: 'path/to/health-product4.jpg' }, 
    'h5': { id: 'h5', name: 'Health Product 5', description: 'Description of Health Product 5.', price: 38.00, image: 'path/to/health-product5.jpg' } 
    
    };

    const product = productsMap[productId];
    if (product) {
        displayProductDetails(product);
    } else {
        displayNotFound();
    }
}

function displayProductDetails(product) {
    const productContainer = document.getElementById('product-details');
    // استخدمنا نمط عرض مرن لدعم الاتجاه من اليمين لليسار (RTL)
    productContainer.innerHTML = `
        <div class="product-detail" style="display:flex; flex-direction: column; align-items: center; text-align: center;">
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="max-width: 600px; text-align: right; padding: 20px;">
                <h1 style="color:#2563eb; font-size:2em; margin-bottom:18px;">${product.name}</h1>
                <p style="color:#475569; font-size:1.1em; line-height: 1.6;">${product.description}</p>
                <p id="product-price" style="font-size: 1.5em; font-weight: bold; color: #dc2626; margin-top: 20px;">السعر: $${product.price.toFixed(2)}</p>
                <button id="add-to-cart" style="background: #2563eb; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; font-size: 1.1em; cursor: pointer; transition: background 0.2s, transform 0.2s; margin-top: 20px;">أضف إلى السلة</button>
            </div>
        </div>
    `;
    setupAddToCart(product);
}

function setupAddToCart(product) {
    const addBtn = document.getElementById('add-to-cart');
    // إضافة تأثير التمرير
    addBtn.addEventListener('mouseenter', () => {
        addBtn.style.background = '#1e40af';
        addBtn.style.transform = 'scale(1.05)';
    });
    addBtn.addEventListener('mouseleave', () => {
        addBtn.style.background = '#2563eb';
        addBtn.style.transform = '';
    });

    addBtn.addEventListener('click', () => {
        addToCart(product);
        addBtn.textContent = "تمت الإضافة!";
        addBtn.style.background = "#059669";
        setTimeout(() => {
            addBtn.textContent = "أضف إلى السلة";
            addBtn.style.background = "#2563eb";
        }, 1200);
    });
}

function displayNotFound() {
    const productContainer = document.getElementById('product-details');
    productContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h2 style="color:#db2777;">المنتج غير موجود</h2>
            <p style="color:#334155;">عذراً، المنتج الذي تبحث عنه غير متوفر حالياً.</p>
        </div>
    `;

}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        product.quantity = 1; // الكمية تبدأ بـ 1 عند أول إضافة
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    console.log(`Product ${product.name} added to cart!`);
}