// This file handles the functionality related to product details, including displaying product information, 
// adding to cart, showing related products, and managing reviews.

let currentProductCategory = null; // لتخزين فئة المنتج الحالي (electronics, clothing, etc.)

document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromURL();
    fetchProductDetails(productId); 
    initializeReviews(); // تفعيل نظام التقييم
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
                throw new Error('فشل جلب ملف المنتجات (products.json).');
            }
            return response.json();
        })
        .then(productsByCat => {
            let product = null;
            let categoryKey = null;

            // البحث عن المنتج في جميع الفئات
            for (const category in productsByCat) {
                if (Array.isArray(productsByCat[category])) {
                    // نستخدم .find() للبحث عن المنتج المطابق للمعرف
                    const foundProduct = productsByCat[category].find(p => p.id === productId); 
                    if (foundProduct) {
                        product = foundProduct;
                        categoryKey = category; // حفظ مفتاح الفئة
                        break;
                    }
                }
            }

            if (product) {
                currentProductCategory = categoryKey; // تحديث فئة المنتج الحالي
                displayProductDetails(product);
                renderRelatedProducts(productsByCat, productId); // عرض المنتجات ذات الصلة
            } else {
                displayNotFound('عفواً، لا يوجد منتج بهذا المعرف في المتجر.');
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            displayNotFound(
                `فشل في تحميل المنتجات: ${error.message}. <br>الرجاء التأكد من تشغيل الموقع عبر **خادم محلي** (مثل Live Server).`
            );
        });
}

function displayProductDetails(product) {
    const productContainer = document.getElementById('product-details');

    const name = product.name || "اسم المنتج غير متوفر";
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
    
    // منطق الإضافة إلى السلة (مع تحسين تأثير الزر)
    const addBtn = document.getElementById('addToCartBtn');
    const originalShadow = "0 4px 15px rgba(37, 99, 235, 0.4)";
    const successShadow = "0 4px 15px rgba(5, 150, 105, 0.4)";

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
            
            // التأثير البصري عند الإضافة الناجحة
            addBtn.textContent = "✅ تمت الإضافة!";
            addBtn.style.background = "#059669"; // لون أخضر
            addBtn.style.boxShadow = successShadow; // ظل أخضر
            
            setTimeout(() => {
                addBtn.textContent = "أضف إلى السلة";
                addBtn.style.background = "#2563eb"; // العودة إلى اللون الأصلي
                addBtn.style.boxShadow = originalShadow; // العودة للظل الأصلي
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

// -------------------------------------------------------------
// وظيفة عرض المنتجات ذات الصلة
// -------------------------------------------------------------
function renderRelatedProducts(productsByCat, currentProductId) {
    const listContainer = document.getElementById('related-products-list');
    
    if (!currentProductCategory || !productsByCat[currentProductCategory]) {
        listContainer.innerHTML = '<p style="text-align:center; color:#64748b;">لا يمكن تحديد منتجات ذات صلة.</p>';
        return;
    }

    // تصفية المنتجات ذات الصلة لاستبعاد المنتج الحالي
    const relatedProducts = productsByCat[currentProductCategory].filter(p => p.id !== currentProductId);
    
    if (relatedProducts.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#64748b;">لا توجد منتجات أخرى في هذه الفئة.</p>';
        return;
    }

    let html = '';
    // عرض أول 4 منتجات ذات صلة فقط
    relatedProducts.slice(0, 4).forEach(p => {
        const price = p.price ? parseFloat(p.price).toFixed(2) + ' ج.م' : "السعر غير متوفر";
        const imagePath = p.image || 'https://via.placeholder.com/400x400?text=Image+Not+Found';

        html += `
            <div class="product-item" style="width: 200px; text-align: center;">
                <img src="${imagePath}" alt="${p.name}" style="max-width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
                <h3 style="font-size: 1.1em; color: #2563eb; margin: 10px 0 5px;">${p.name}</h3>
                <div style="color:#059669; font-weight:600; margin-bottom:15px;">${price}</div>
                <a href="detail.html?id=${p.id}" class="add-to-cart-btn" style="background: #2563eb; padding: 8px 15px; text-decoration: none; display: inline-block; border-radius: 6px; box-shadow: none;">عرض التفاصيل</a>
            </div>
        `;
    });

    listContainer.innerHTML = html;
}


// -------------------------------------------------------------
// وظيفة نظام التقييم والتعليق (تستخدم localStorage للحفظ)
// -------------------------------------------------------------

// دالة لجلب جميع المراجعات من localStorage
function getReviews(productId) {
    const allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    return allReviews[productId] || [];
}

// دالة لحفظ مراجعة جديدة
function saveReview(productId, review) {
    const allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    if (!allReviews[productId]) {
        allReviews[productId] = [];
    }
    allReviews[productId].push(review);
    localStorage.setItem('productReviews', JSON.stringify(allReviews));
}

function renderReviewsList(productId) {
    const reviews = getReviews(productId);
    const list = document.getElementById('comments-list');
    const totalReviewsTitle = document.getElementById('review-count');
    
    if (!list) return;

    if (reviews.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #64748b;">لا توجد مراجعات حتى الآن. كن أول من يقيّم هذا المنتج!</p>';
        totalReviewsTitle.textContent = '0';
        return;
    }

    let html = '';
    reviews.reverse().forEach(review => { // عرض الأحدث أولاً
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const userName = review.name || 'عميل';
        const date = review.date || 'اليوم';

        html += `
            <div class="comment-item">
                <strong>${userName}</strong>
                <span class="comment-rating">${stars}</span>
                <small style="color:#94a3b8; font-size:0.9em;">- ${date}</small>
                <p>${review.comment}</p>
            </div>
        `;
    });
    
    totalReviewsTitle.textContent = `${reviews.length}`;
    list.innerHTML = html;
}


function initializeReviews() {
    const productId = getProductIdFromURL();
    if (!productId) return;

    // 1. تفعيل النجوم
    const ratingStars = document.getElementById('rating-stars');
    const ratingInput = document.getElementById('user-rating');
    const spans = ratingStars ? ratingStars.querySelectorAll('span') : [];

    spans.forEach(star => {
        // تأثير عند المرور بالماوس
        star.addEventListener('mouseenter', () => {
            let rating = parseInt(star.dataset.rating);
            spans.forEach(s => s.classList.remove('hover'));
            // تلوين النجوم التي هي أقل من أو تساوي التقييم
            spans.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add('hover');
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            spans.forEach(s => s.classList.remove('hover'));
        });

        // تأثير عند النقر
        star.addEventListener('click', () => {
            let rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            
            // تلوين النجوم بشكل دائم (active)
            spans.forEach(s => s.classList.remove('active'));
            spans.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add('active');
                }
            });
        });
    });

    // 2. معالجة إرسال النموذج
    const reviewForm = document.getElementById('review-form');
    const reviewComment = document.getElementById('review-comment');
    const reviewMessage = document.getElementById('review-message');

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const rating = parseInt(ratingInput.value);
            const comment = reviewComment.value.trim();

            if (rating === 0 || comment.length < 5) {
                reviewMessage.innerHTML = '<div style="color:#dc2626;">الرجاء اختيار تقييم وكتابة تعليق لا يقل عن 5 أحرف.</div>';
                return;
            }

            const newReview = {
                id: Date.now(),
                rating: rating,
                comment: comment,
                name: 'زائر', 
                date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
            };

            saveReview(productId, newReview);
            reviewMessage.innerHTML = '<div style="color:#059669;">شكرًا لك! تم إرسال تقييمك بنجاح.</div>';
            reviewForm.reset();
            ratingInput.value = 0;
            spans.forEach(s => s.classList.remove('active')); // إزالة تلوين النجوم
            
            // تحديث قائمة المراجعات فوراً
            renderReviewsList(productId);
        });
    }


    // 3. عرض المراجعات الموجودة عند التحميل
    renderReviewsList(productId);
}