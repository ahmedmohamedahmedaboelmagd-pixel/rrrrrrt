// This file contains the main JavaScript functionality for the online store, including event listeners and general interactivity.

document.addEventListener('DOMContentLoaded', () => {

    // 1. منطق فتح وإغلاق القائمة الجانبية (Sidebar Menu Toggle Logic)
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');
    
    // تعريف الدالة عالمياً لتتمكن من استدعائها من HTML (من زر "الكل" وزر الإغلاق)
    window.toggleSidebarMenu = function(event) {
        // منع السلوك الافتراضي للرابط (إذا تم الضغط على زر "الكل")
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        
        // تبديل حالة الفتح/الإغلاق
        const isOpen = sidebar.classList.toggle('open');
        
        // إظهار/إخفاء التعتيم
        overlay.style.display = isOpen ? 'block' : 'none';
        
        // منع تمرير محتوى الصفحة أثناء فتح القائمة
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // إغلاق القائمة عند الضغط على أي رابط داخلها
    if (sidebar) {
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // تأخير بسيط لمنح المتصفح وقتاً لمعالجة الانتقال
                setTimeout(() => {
                    toggleSidebarMenu();
                }, 100); 
            });
        });
    }

    // 2. منطق التمرير الأفقي للمنتجات المميزة (Horizontal Scrolling Logic)
    const scrollContainer = document.getElementById('featuredProducts');
    if (scrollContainer) {
        window.scrollFeatured = function(direction) {
            
            // حساب عرض العنصر الأول + المسافة بين العناصر (20px)
            const firstItem = scrollContainer.querySelector('.featured-item');
            if (!firstItem) return;
            
            const scrollAmount = firstItem.offsetWidth + 20; 
            
            // *** تم عكس الإشارة هنا لتتوافق مع الاتجاه المرئي للسهم ***
            // direction: 1 (لليمين، السهم &#9654;) يجب أن يمرر لليسار في RTL (أي قيمة سالبة)
            // direction: -1 (لليسار، السهم &#9664;) يجب أن يمرر لليمين في RTL (أي قيمة موجبة)
            
            const scrollDistance = direction * scrollAmount * -1;
            
            scrollContainer.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        };
    }
    
    // (يمكن إضافة أي أكواد JavaScript أخرى لديك هنا)
    
});