// This file handles the functionality related to product details, such as displaying product information and managing user interactions.

document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromURL();
    // ابدأ بجلب تفاصيل المنتج
    fetchProductDetails(productId); 
});

// استخراج معرف المنتج من الرابط (Query String)
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// الدالة المسؤولة عن جلب المنتج من ملف JSON والبحث عنه
function fetchProductDetails(productId) {
    // المسار من صفحة detail.html (الموجودة في product/) إلى products.json (الموجود في المجلد الرئيسي)
    const jsonPath = '../products.json'; 
    
    fetch(jsonPath) 
        .then(response => {
            if (!response.ok) {
                // رسالة خطأ واضحة في حالة فشل الاتصال
                throw new Error('فشل جلب ملف المنتجات (products.json).');
            }
            return response.json();
        })
        .then(productsByCat => {
            let product = null;

            // البحث عن المنتج في جميع الفئات المُخزنة في JSON
            for (const category in productsByCat) {
                if (Array.isArray(productsByCat[category])) {
                    // نستخدم .find() للبحث عن المنتج المطابق للمعرف
                    const foundProduct = productsByCat[category].find(p => p.id === productId); 
                    if (foundProduct) {
                        product = foundProduct;
                        break; // تم العثور على المنتج
                    }
                }
            }

            if (product) {
                displayProductDetails(product);
            } else {
                displayNotFound('عفواً، لا يوجد منتج بهذا المعرف في المتجر.');
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            // عرض رسالة خطأ واضحة في حالة فشل الجلب (CORS)
            displayNotFound(
                `فشل في تحميل المنتجات: ${error.message}. <br>الرجاء التأكد من تشغيل الموقع عبر **خادم محلي** (مثل Live Server).`
            );
        });
}

function displayProductDetails(product) {
    const productContainer = document.getElementById('product-details');

    const name = product.name || "اسم المنتج غير متوفر";
    // عرض السعر بوحدة الجنيه المصري (ج.م)
    const price = product.price ? parseFloat(product.price).toFixed(2) + ' ج.م' : "السعر غير متوفر";
    const description = product.desc || "لا يوجد وصف متوفر لهذا المنتج حالياً.";
    const imagePath = product.image || 'https://via.placeholder.com/400x400?text=Image+Not+Found';

    productContainer.innerHTML = `
        <div class="product-detail product-detail-container">
            <img src="${imagePath}" alt="${name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x400?text=Image+Not+Found'">
            
            <h1>${name}</h1>
            <p class="price-display">${price}</p>
            
            <div class="description-box">
                <h3>الوصف</h3>
                <p>${description}</p>
            </div>

            <button id="addToCartBtn" class="add-to-cart-btn">أضف إلى السلة</button>
        </div>
    `;
    
    // منطق الإضافة إلى السلة 
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        };

        addBtn.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existing = cart.find(item => item.id === cartProduct.id);

            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                cartProduct.quantity = 1;
                cart.push(cartProduct);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            
            addBtn.textContent = "تمت الإضافة!";
            addBtn.style.background = "#059669";
            setTimeout(() => {
                addBtn.textContent = "أضف إلى السلة";
                addBtn.style.background = "#2563eb";
            }, 1200);
        });
    }
}

function displayNotFound(message) {
    const productContainer = document.getElementById('product-details');
    productContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h2 style="color:#dc2777;">المنتج غير موجود</h2>
            <p style="color:#334155; max-width: 500px; margin: 15px auto; line-height: 1.6;">${message}</p>
        </div>
    `;
}