// Data Produk dihandle oleh data-produk.js (window.productsData)
const products = window.productsData || [];

let cart = JSON.parse(localStorage.getItem('sbba_cart')) || [];
let displayCount = 12;
let currentFilter = 'Semua';
let searchQuery = '';

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
    setupEventListeners();
    setupScrollEffects();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: false, // Set to false to allow exit/entrance animations on scroll
            offset: 100,
            mirror: true // Allow animations to trigger when scrolling back up
        });
    }
});

function setupScrollEffects() {
    const nav = document.getElementById('main-nav');
    const navContainer = document.getElementById('nav-container');
    const navText = document.getElementById('nav-text');
    const navLinks = document.getElementById('nav-links');
    const cartBtn = document.getElementById('cart-btn');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const isMobile = window.innerWidth < 768;
        const scrollThreshold = 80;

        // Navbar scroll effect
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
            navContainer.classList.replace(isMobile ? 'h-20' : 'h-24', isMobile ? 'h-16' : 'h-20');
            if (navText) navText.classList.replace('text-white', 'text-[#1A1A1A]');
            if (navLinks) navLinks.classList.replace('text-white', 'text-[#1A1A1A]');
            if (cartBtn) {
                cartBtn.classList.replace('text-white', 'text-[#1A1A1A]');
                cartBtn.classList.replace('bg-white/10', 'bg-black/5');
                cartBtn.classList.replace('border-white/20', 'border-black/5');
            }
            if (mobileBtn) mobileBtn.classList.replace('text-white', 'text-[#1A1A1A]');
        } else {
            nav.classList.remove('scrolled');
            navContainer.classList.replace(isMobile ? 'h-16' : 'h-20', isMobile ? 'h-20' : 'h-24');
            if (navText) navText.classList.replace('text-[#1A1A1A]', 'text-white');
            if (navLinks) navLinks.classList.replace('text-[#1A1A1A]', 'text-white');
            if (cartBtn) {
                cartBtn.classList.replace('text-[#1A1A1A]', 'text-white');
                cartBtn.classList.replace('bg-black/5', 'bg-white/10');
                cartBtn.classList.replace('border-black/5', 'border-white/20');
            }
            if (mobileBtn) mobileBtn.classList.replace('text-[#1A1A1A]', 'text-white');
        }

        // Scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";
    }, { passive: true });
}

function openLightbox(element) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const title = document.getElementById('lightbox-title');
    const desc = document.getElementById('lightbox-desc');
    
    const sourceImg = element.querySelector('img');
    const sourceTitle = element.querySelector('h4');
    const sourceDesc = element.querySelector('p');

    img.src = sourceImg.src;
    title.textContent = sourceTitle.textContent;
    desc.textContent = sourceDesc.textContent;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
}

function setupEventListeners() {
    // Search & Filter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderProducts();
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('bg-gold', 'text-white'));
            btn.classList.add('bg-gold', 'text-white');
            currentFilter = btn.dataset.category;
            renderProducts();
        });
    });

    // Load More
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayCount += 12;
            renderProducts();
        });
    }

    // Cart Sidebar Toggle
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Checkout Form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Product Modal Close
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    if (closeModal) closeModal.addEventListener('click', toggleModal);
    if (modalOverlay) modalOverlay.addEventListener('click', toggleModal);
    
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('mobile-active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navLinks.classList.add('hidden');
                    navLinks.classList.remove('mobile-active');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                navLinks.classList.add('hidden');
                navLinks.classList.remove('mobile-active');
            }
        });
    }
}

function renderProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;

    const filtered = products.filter(p => {
        const matchesFilter = currentFilter === 'Semua' || p.category === currentFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery);
        return matchesFilter && matchesSearch;
    }).sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));

    const toDisplay = filtered.slice(0, displayCount);
    
    container.innerHTML = toDisplay.map(p => `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-md group cursor-pointer" data-aos="fade-up" onclick="openProductModal(${p.id})">
            <div class="relative overflow-hidden h-64 img-container">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" referrerPolicy="no-referrer">
                ${p.bestSeller ? '<span class="absolute top-4 left-4 bg-gold text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Best Seller</span>' : ''}
                <div class="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-100 md:opacity-0">
                    <button onclick="event.stopPropagation(); addToCart(${p.id})" class="bg-white text-charcoal px-6 py-2 rounded-full font-semibold transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform hover:bg-gold hover:text-white">
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
            <div class="p-5">
                <p class="text-xs text-gold font-bold uppercase tracking-widest mb-1">${p.category}</p>
                <h3 class="text-lg font-bold mb-2">${p.name}</h3>
                <p class="text-xl font-serif text-charcoal">Rp ${p.price.toLocaleString('id-ID')}<span class="text-sm font-sans text-gray-400 font-normal"> /m²</span></p>
            </div>
        </div>
    `).join('');

    // Update Load More visibility
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        if (displayCount >= filtered.length) {
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.classList.remove('hidden');
        }
    }
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
    renderCart();
    showNotification(`${product.name} ditambahkan!`);
    
    // Open cart sidebar immediately
    toggleCart(true);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('sbba_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = total;
        badge.classList.toggle('hidden', total === 0);
    }
}

function toggleCart(forceOpen = null) {
    const overlay = document.getElementById('cart-overlay');
    if (forceOpen === true) {
        document.body.classList.add('cart-open');
        if (overlay) overlay.classList.remove('hidden');
    } else if (forceOpen === false) {
        document.body.classList.remove('cart-open');
        if (overlay) overlay.classList.add('hidden');
    } else {
        document.body.classList.toggle('cart-open');
        if (overlay) overlay.classList.toggle('hidden');
    }
    renderCart();
}

function toggleModal() {
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    }
    if (overlay) overlay.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
}

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalContent = document.getElementById('modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="relative h-80 md:h-full min-h-[300px]">
                    <img src="${product.image}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer">
                    ${product.bestSeller ? '<span class="absolute top-4 left-4 bg-gold text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Best Seller</span>' : ''}
                </div>
                <div class="flex flex-col justify-center">
                    <p class="text-xs text-gold font-bold uppercase tracking-[0.2em] mb-2">${product.category}</p>
                    <h2 class="text-3xl font-bold mb-4">${product.name}</h2>
                    <p class="text-2xl font-serif text-charcoal mb-6">Rp ${product.price.toLocaleString('id-ID')}<span class="text-sm font-sans text-gray-400 font-normal"> /m²</span></p>
                    <div class="prose prose-sm text-gray-500 mb-8">
                        <p>${product.description}</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button onclick="addToCart(${product.id}); toggleModal();" class="flex-1 bg-gold hover:bg-gold-dark text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-gold/20">
                            Tambah ke Keranjang
                        </button>
                        <a href="https://wa.me/6285364551484?text=Halo Admin, saya ingin bertanya tentang produk: ${product.name}" target="_blank" class="flex-1 border-2 border-gray-100 hover:border-gold hover:text-gold py-4 rounded-xl font-bold text-center transition-all">
                            Tanya Admin
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    toggleModal();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p>Keranjang Anda masih kosong</p>
            </div>
        `;
        totalEl.textContent = 'Rp 0';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 py-4 border-bottom border-gray-100">
            <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer">
            <div class="flex-1">
                <h4 class="font-bold text-sm">${item.name}</h4>
                <p class="text-gold text-sm font-serif">Rp ${item.price.toLocaleString('id-ID')}</p>
                <div class="flex items-center gap-3 mt-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100">-</button>
                    <span class="text-sm font-bold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-gray-300 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) return alert('Keranjang kosong!');

    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;

    let message = `*PESANAN BARU - SUMBER BERKAH BATU ALAM*\n\n`;
    message += `*Nama:* ${name}\n`;
    message += `*Alamat:* ${address}\n\n`;
    message += `*Daftar Pesanan:*\n`;

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. ${item.name} (${item.quantity} m²) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Estimasi:* Rp ${total.toLocaleString('id-ID')}\n`;
    message += `\n_Catatan: Admin akan menghitungkan ongkir berdasarkan berat total._`;

    const waUrl = `https://wa.me/6285364551484?text=${encodeURIComponent(message)}`;
    
    // Clear cart and redirect
    cart = [];
    saveCart();
    window.open(waUrl, '_blank');
    toggleCart();
}

function showNotification(text) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-charcoal text-white px-6 py-3 rounded-full shadow-2xl z-[200] flex items-center gap-3 transition-opacity duration-300';
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gold" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>${text}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
