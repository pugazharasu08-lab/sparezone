/* ==========================================================================
   AUTHENTICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});

function checkSession() {
    const sessionActive = localStorage.getItem('sz_session') === 'active';
    if (sessionActive) {
        document.getElementById('auth-wrapper').classList.add('hidden');
        document.getElementById('animated-bg').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        filterProducts('All'); // Load all products initially
    }
}

function handleLogout() {
    localStorage.removeItem('sz_session');
    window.location.reload();
}

function toggleAuthForms(target) {
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    clearAllInputsAndErrors();

    if (target === 'signup') {
        loginSection.classList.add('hidden');
        signupSection.classList.remove('hidden');
    } else {
        signupSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    }
}

function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
}

function clearError(inputId, errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.innerText = '';
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
        const container = inputEl.closest('.input-container');
        if (container) container.classList.remove('input-error');
    }
}

function showError(inputId, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.innerText = message;
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
        const container = inputEl.closest('.input-container');
        if (container) container.classList.add('input-error');
    }
}

function clearAllInputsAndErrors() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.innerText = '');
    const containers = document.querySelectorAll('.input-container');
    containers.forEach(c => c.classList.remove('input-error'));
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    let isValid = true;
    ['signup-name', 'signup-email', 'signup-password', 'signup-confirm-password'].forEach(id => clearError(id, id+'-error'));
    
    if (!name) { showError('signup-name', 'signup-name-error', 'Full Name is required'); isValid = false; }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email) { showError('signup-email', 'signup-email-error', 'Email is required'); isValid = false; } 
    else if (!emailRegex.test(email)) { showError('signup-email', 'signup-email-error', 'Must be a valid @gmail.com address'); isValid = false; }
    
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password) { showError('signup-password', 'signup-password-error', 'Password is required'); isValid = false; } 
    else if (!pwdRegex.test(password)) { showError('signup-password', 'signup-password-error', 'Password does not meet requirements'); isValid = false; }
    
    if (!confirmPassword) { showError('signup-confirm-password', 'signup-confirm-password-error', 'Please confirm password'); isValid = false; } 
    else if (password !== confirmPassword) { showError('signup-confirm-password', 'signup-confirm-password-error', 'Passwords do not match'); isValid = false; }
    
    if (isValid) {
        localStorage.setItem('sz_user', JSON.stringify({ name, email, password }));
        alert("Account created successfully! Please login.");
        toggleAuthForms('login');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    let isValid = true;
    clearError('login-email', 'login-email-error');
    clearError('login-password', 'login-password-error');
    document.getElementById('login-main-error').innerText = '';
    
    if (!email) { showError('login-email', 'login-email-error', 'Email is required'); isValid = false; }
    if (!password) { showError('login-password', 'login-password-error', 'Password is required'); isValid = false; }
    
    if (!isValid) return;
    
    const storedUserStr = localStorage.getItem('sz_user');
    if (!storedUserStr) {
        document.getElementById('login-main-error').innerText = 'User cannot login without signup first.';
        return;
    }
    
    const storedUser = JSON.parse(storedUserStr);
    if (email === storedUser.email && password === storedUser.password) {
        localStorage.setItem('sz_session', 'active');
        checkSession();
    } else {
        document.getElementById('login-main-error').innerText = 'Invalid email or password';
    }
}

/* ==========================================================================
   PRODUCT CATALOG & FILTERING
   ========================================================================== */

const products = [
    // --- TWO WHEELER (12 Items) ---
    { id: 1, category: "Two Wheeler", name: "Bike Chain Sprocket Kit", seller: "Velan Motors Parts Shop", phone: "+91 9123456780", price: "850", img: "images/sprocket.png", rating: 4.5, reviews: 128 },
    { id: 2, category: "Two Wheeler", name: "Premium Brake Pad Set", seller: "Sri Amman Auto Spares", phone: "+91 9876543210", price: "250", img: "images/brakepad.png", rating: 4.8, reviews: 214 },
    { id: 3, category: "Two Wheeler", name: "Two Wheeler Battery 12V", seller: "Sakthi Auto Components", phone: "+91 8877665544", price: "1200", img: "images/battery.png", rating: 4.3, reviews: 89 },
    { id: 4, category: "Two Wheeler", name: "Halogen Headlight Bulb", seller: "Chennai Auto Traders", phone: "+91 7766554433", price: "150", img: "images/headlight.png", rating: 4.1, reviews: 176 },
    { id: 5, category: "Two Wheeler", name: "TVS Apache Clutch Wire", seller: "Murugan Spare Hub", phone: "+91 9988776655", price: "180", img: "images/cable.png", rating: 4.6, reviews: 53 },
    { id: 6, category: "Two Wheeler", name: "Scooter Rear View Mirror", seller: "Vinayaga Garage Parts", phone: "+91 6655443322", price: "300", img: "images/accessory.png", rating: 3.9, reviews: 41 },
    { id: 7, category: "Two Wheeler", name: "Pulsar 150 Air Filter", seller: "Raja Workshop Supplies", phone: "+91 9789012345", price: "220", img: "images/filter.png", rating: 4.7, reviews: 302 },
    { id: 8, category: "Two Wheeler", name: "Bike Carburetor Assembly", seller: "Velan Motors Parts Shop", phone: "+91 9123456780", price: "1450", img: "images/engine_part.png", rating: 4.4, reviews: 67 },
    { id: 9, category: "Two Wheeler", name: "Front Fork Oil Seal Set", seller: "MM Workshop Spares", phone: "+91 8899001122", price: "120", img: "images/bearing.png", rating: 4.2, reviews: 95 },
    { id: 10, category: "Two Wheeler", name: "Spark Plug Single", seller: "Sri Amman Auto Spares", phone: "+91 9876543210", price: "90", img: "images/engine_part.png", rating: 4.9, reviews: 511 },
    { id: 11, category: "Two Wheeler", name: "Engine Oil 10W-30 (1L)", seller: "Chennai Auto Traders", phone: "+91 7766554433", price: "350", img: "images/fluid.png", rating: 4.5, reviews: 238 },
    { id: 12, category: "Two Wheeler", name: "Rear Brake Shoe", seller: "Sakthi Auto Components", phone: "+91 8877665544", price: "280", img: "images/brakepad.png", rating: 4.3, reviews: 74 },

    // --- THREE WHEELER (11 Items) ---
    { id: 13, category: "Three Wheeler", name: "Auto Rickshaw Brake Liner", seller: "MM Workshop Spares", phone: "+91 8899001122", price: "450", img: "images/brakepad.png", rating: 4.6, reviews: 143 },
    { id: 14, category: "Three Wheeler", name: "Bajaj RE Clutch Cable", seller: "Vinayaga Garage Parts", phone: "+91 6655443322", price: "150", img: "images/cable.png", rating: 4.2, reviews: 88 },
    { id: 15, category: "Three Wheeler", name: "Three Wheeler Headlight Assembly", seller: "Murugan Spare Hub", phone: "+91 9988776655", price: "850", img: "images/headlight.png", rating: 4.5, reviews: 62 },
    { id: 16, category: "Three Wheeler", name: "Ape Engine Mount Rubber", seller: "Raja Workshop Supplies", phone: "+91 9789012345", price: "320", img: "images/bearing.png", rating: 3.8, reviews: 29 },
    { id: 17, category: "Three Wheeler", name: "Auto Horn 12V High Tone", seller: "Sri Amman Auto Spares", phone: "+91 9876543210", price: "250", img: "images/accessory.png", rating: 4.7, reviews: 199 },
    { id: 18, category: "Three Wheeler", name: "Wiper Motor Assm.", seller: "Velan Motors Parts Shop", phone: "+91 9123456780", price: "1100", img: "images/engine_part.png", rating: 4.1, reviews: 35 },
    { id: 19, category: "Three Wheeler", name: "Passenger Seat Cover", seller: "Chennai Auto Traders", phone: "+91 7766554433", price: "500", img: "images/seat.png", rating: 4.4, reviews: 117 },
    { id: 20, category: "Three Wheeler", name: "Rickshaw Axle Shaft", seller: "Sakthi Auto Components", phone: "+91 8877665544", price: "1850", img: "images/bearing.png", rating: 4.3, reviews: 48 },
    { id: 21, category: "Three Wheeler", name: "Starter Motor Drive", seller: "MM Workshop Spares", phone: "+91 8899001122", price: "950", img: "images/engine_part.png", rating: 4.0, reviews: 56 },
    { id: 22, category: "Three Wheeler", name: "CNG Filter Element", seller: "Murugan Spare Hub", phone: "+91 9988776655", price: "120", img: "images/filter.png", rating: 4.6, reviews: 83 },
    { id: 23, category: "Three Wheeler", name: "Tail Light Lens", seller: "Vinayaga Garage Parts", phone: "+91 6655443322", price: "90", img: "images/headlight.png", rating: 3.9, reviews: 22 },

    // --- FOUR WHEELER (12 Items) ---
    { id: 24, category: "Four Wheeler", name: "Car Front Brake Pad Set", seller: "Chennai Auto Traders", phone: "+91 7766554433", price: "1550", img: "images/brakepad.png", rating: 4.8, reviews: 421 },
    { id: 25, category: "Four Wheeler", name: "Engine Oil Filter (Maruti)", seller: "Sakthi Auto Components", phone: "+91 8877665544", price: "250", img: "images/filter.png", rating: 4.5, reviews: 367 },
    { id: 26, category: "Four Wheeler", name: "Wiper Blade 22 Inch", seller: "Sri Amman Auto Spares", phone: "+91 9876543210", price: "350", img: "images/wiper.png", rating: 4.3, reviews: 189 },
    { id: 27, category: "Four Wheeler", name: "Car Battery 40Ah", seller: "Velan Motors Parts Shop", phone: "+91 9123456780", price: "4200", img: "images/battery.png", rating: 4.6, reviews: 94 },
    { id: 28, category: "Four Wheeler", name: "Clutch Plate Assembly", seller: "Raja Workshop Supplies", phone: "+91 9789012345", price: "3800", img: "images/bearing.png", rating: 4.2, reviews: 58 },
    { id: 29, category: "Four Wheeler", name: "Cabin AC Filter", seller: "Murugan Spare Hub", phone: "+91 9988776655", price: "400", img: "images/filter.png", rating: 4.7, reviews: 276 },
    { id: 30, category: "Four Wheeler", name: "Wheel Hub Bearing Front", seller: "MM Workshop Spares", phone: "+91 8899001122", price: "1250", img: "images/bearing.png", rating: 4.4, reviews: 132 },
    { id: 31, category: "Four Wheeler", name: "Suspension Lower Arm", seller: "Vinayaga Garage Parts", phone: "+91 6655443322", price: "2100", img: "images/shock.png", rating: 4.1, reviews: 45 },
    { id: 32, category: "Four Wheeler", name: "Power Steering Fluid (1L)", seller: "Chennai Auto Traders", phone: "+91 7766554433", price: "450", img: "images/fluid.png", rating: 4.5, reviews: 203 },
    { id: 33, category: "Four Wheeler", name: "Car Fog Lamp Set", seller: "Sakthi Auto Components", phone: "+91 8877665544", price: "1600", img: "images/headlight.png", rating: 4.3, reviews: 77 },
    { id: 34, category: "Four Wheeler", name: "Radiator Coolant (3L)", seller: "Sri Amman Auto Spares", phone: "+91 9876543210", price: "650", img: "images/fluid.png", rating: 4.6, reviews: 154 },
    { id: 35, category: "Four Wheeler", name: "Alternator Belt", seller: "Velan Motors Parts Shop", phone: "+91 9123456780", price: "800", img: "images/cable.png", rating: 4.0, reviews: 61 },
];

let currentCategory = 'All';

function filterProducts(category) {
    currentCategory = category;
    
    // Clear search input when switching categories
    const searchInput = document.getElementById('nav-search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Update active button state
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.innerText === category || (category === 'All' && btn.innerText === 'All Parts')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    applyFilters();
}

function handleSearch() { applyFilters(); }
function handleNavSearch() {
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('nav-search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    let filtered = products;
    
    // 1. Apply category filter
    if (currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // 2. Apply text search filter
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.seller.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    renderGrid(filtered);
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += '<i class="fa-solid fa-star" style="color:#F97316;"></i>';
        } else if (rating >= i - 0.5) {
            stars += '<i class="fa-solid fa-star-half-stroke" style="color:#F97316;"></i>';
        } else {
            stars += '<i class="fa-regular fa-star" style="color:#F97316; opacity:0.4;"></i>';
        }
    }
    return stars;
}

function renderGrid(productArray) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    productArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='images/engine_part.png'">
                <button class="tutorial-btn" onclick="openTutorialModal('${product.name}')">
                    <i class="fa-solid fa-play"></i> Fitting Guide
                </button>
            </div>
            
            <h3 class="product-title">${product.name}</h3>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase;">${product.category}</div>
            <div class="product-rating">
                ${renderStars(product.rating)}
                <span class="rating-score">${product.rating.toFixed(1)}</span>
                <span class="rating-count">(${product.reviews})</span>
            </div>
            <div class="product-price">â‚¹${product.price}</div>
            
            <div class="seller-info-card">
                <div class="seller-header">
                    <div class="seller-icon"><i class="fa-solid fa-store"></i></div>
                    <div>
                        <span class="seller-name">${product.seller}</span>
                        <i class="fa-solid fa-circle-check seller-verified" title="Verified Seller"></i>
                        <span class="seller-phone"><i class="fa-solid fa-phone"></i> ${product.phone}</span>
                    </div>
                </div>
                
                <div class="contact-actions">
                    <a href="tel:${product.phone.replace(/\s+/g, '')}" class="btn btn-outline" style="flex:1; padding: 0.5rem; text-decoration: none; text-align: center;"><i class="fa-solid fa-phone"></i> Call</a>
                    <button class="btn btn-whatsapp" onclick="openChatModal('${product.seller}')"><i class="fa-brands fa-whatsapp"></i> Message</button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-outline" style="flex:1;" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-shopping"></i> Add</button>
                <button class="btn btn-gradient" style="flex:1;" onclick="addToCart(${product.id}); showPage('cart');">Buy Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* ==========================================================================
   MODAL LOGIC & CHAT SIMULATION
   ========================================================================== */

function openTutorialModal(productName) {
    document.getElementById('tutorial-product-name').innerText = productName;
    document.getElementById('tutorial-modal').classList.remove('hidden');
}

function closeTutorialModal() {
    document.getElementById('tutorial-modal').classList.add('hidden');
}

let currentSeller = '';

function openChatModal(sellerName) {
    currentSeller = sellerName;
    document.getElementById('chat-seller-name').innerText = sellerName;
    document.getElementById('chat-welcome-seller').innerText = sellerName;
    
    // Reset chat messages (keep only the first welcome message)
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = `
        <div class="message received">
            <p>Hello! Welcome to <span>${sellerName}</span>. How can we help you today?</p>
            <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    `;
    
    document.getElementById('chat-modal').classList.remove('hidden');
}

function closeChatModal() {
    document.getElementById('chat-modal').classList.add('hidden');
}

function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msgText = input.value.trim();
    if (!msgText) return;
    
    const messagesContainer = document.getElementById('chat-messages');
    
    // Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'message sent';
    userMsg.innerHTML = `
        <p>${msgText}</p>
        <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    `;
    messagesContainer.appendChild(userMsg);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate Seller Typing
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.classList.remove('hidden');
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Auto Reply logic
    setTimeout(() => {
        typingIndicator.classList.add('hidden');
        
        const autoReplies = [
            "Yes sir, the product is available in stock.",
            "Please share your vehicle model to confirm compatibility.",
            "We can deliver it to you by tomorrow.",
            "Yes, installation support is available."
        ];
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        const sellerMsg = document.createElement('div');
        sellerMsg.className = 'message received';
        sellerMsg.innerHTML = `
            <p>${replyText}</p>
            <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        messagesContainer.appendChild(sellerMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
    }, 1500);
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function showPage(pageId) {
    ['home', 'cart', 'tracking'].forEach(p => {
        document.getElementById(p + '-page').classList.add('hidden');
    });
    document.getElementById(pageId + '-page').classList.remove('hidden');
    if (pageId === 'cart') renderCart();
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    const icons = [document.getElementById('theme-icon'), document.getElementById('theme-icon-auth')];
    
    icons.forEach(icon => {
        if (!icon) return;
        if (isLight) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });
    
    localStorage.setItem('sparezone-theme', isLight ? 'light' : 'dark');
    
    // Sync with tutorial iframe if open
    const iframe = document.getElementById('fitting-demo-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'theme', theme: isLight ? 'light' : 'dark' }, '*');
    }
}

// Initialize Theme on Load
(function initTheme() {
    const savedTheme = localStorage.getItem('sparezone-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        setTimeout(() => {
            const icons = [document.getElementById('theme-icon'), document.getElementById('theme-icon-auth')];
            icons.forEach(icon => {
                if (icon) icon.className = 'fa-solid fa-sun';
            });
        }, 100);
    }
})();

/* ==========================================================================
   TOAST
   ========================================================================== */
function showToast(message) {
    const toast = document.getElementById('toast-container');
    document.getElementById('toast-message').innerText = message;
    toast.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

/* ==========================================================================
   CART LOGIC
   ========================================================================== */
let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.product.id === productId);
    if (existing) { existing.quantity += 1; }
    else { cart.push({ product, quantity: 1 }); }
    updateCartBadge();
    showToast(product.name + ' added to cart');
}

function updateCartBadge() {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cart-badge').innerText = count;
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:4rem 2rem;color:var(--text-muted);">
            <i class="fa-solid fa-cart-shopping" style="font-size:3rem;margin-bottom:1rem;display:block;"></i>
            <p>Your cart is empty. Go add some parts!</p></div>`;
        updateSummary(0); return;
    }
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseInt(item.product.price) * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item-card';
        div.innerHTML = `
            <img src="${item.product.img}" class="cart-item-img" alt="${item.product.name}" onerror="this.src='images/engine_part.png'">
            <div class="cart-item-details">
                <h4>${item.product.name}</h4>
                <div style="font-size:0.8rem;color:var(--text-muted);">${item.product.seller}</div>
                <div style="font-weight:700;margin-top:0.3rem;">&#8377;${item.product.price}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-ctrl">
                    <button class="quantity-btn" onclick="updateQuantity(${item.product.id},-1)">âˆ’</button>
                    <span class="quantity-val">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.product.id},1)">+</button>
                </div>
                <span class="remove-btn" onclick="removeFromCart(${item.product.id})"><i class="fa-solid fa-trash-can"></i></span>
            </div>`;
        container.appendChild(div);
    });
    updateSummary(subtotal);
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.product.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else { renderCart(); updateCartBadge(); }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.product.id !== id);
    renderCart(); updateCartBadge();
}

function updateSummary(subtotal) {
    const gst = Math.round(subtotal * 0.18);
    const delivery = subtotal > 0 ? 50 : 0;
    document.getElementById('summary-subtotal').innerText = 'â‚¹' + subtotal;
    document.getElementById('summary-gst').innerText = 'â‚¹' + gst;
    document.getElementById('summary-delivery').innerText = 'â‚¹' + delivery;
    document.getElementById('summary-total').innerText = 'â‚¹' + (subtotal + gst + delivery);
}

function proceedToCheckout() {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const id = 'SZ-IN-' + Math.floor(1000000 + Math.random() * 9000000);
    document.getElementById('tracking-id-display').innerText = 'Tracking ID: ' + id;
    cart = []; updateCartBadge();
    showPage('tracking');
}

/* ==========================================================================
   EXTENDED NAVIGATION (replaces basic showPage)
   ========================================================================== */
const ALL_PAGES = ['home','cart','checkout','confirmation','track','orders'];

function showPage(pageId) {
    ALL_PAGES.forEach(p => {
        const el = document.getElementById(p + '-page');
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(pageId + '-page');
    if (target) target.classList.remove('hidden');

    if (pageId === 'cart')         renderCart();
    if (pageId === 'checkout')     renderCheckout();
    if (pageId === 'orders')       renderOrders();
    if (pageId === 'track')        renderTracking();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   CHECKOUT LOGIC
   ========================================================================== */
let selectedPayment = 'cod';

function selectPayment(method) {
    selectedPayment = method;
    ['cod','upi','debit','credit','netbanking'].forEach(m => {
        const card = document.getElementById('pcard-' + m);
        if (card) card.classList.remove('payment-selected');
    });
    const sel = document.getElementById('pcard-' + method);
    if (sel) sel.classList.add('payment-selected');

    document.getElementById('upi-input-section').classList.add('hidden');
    document.getElementById('card-input-section').classList.add('hidden');
    if (method === 'upi') document.getElementById('upi-input-section').classList.remove('hidden');
    if (method === 'debit' || method === 'credit') document.getElementById('card-input-section').classList.remove('hidden');
}

function renderCheckout() {
    const list = document.getElementById('co-items-list');
    if (!list) return;
    list.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseInt(item.product.price) * item.quantity;
        list.innerHTML += `
            <div class="co-item-row">
                <img src="${item.product.img}" onerror="this.src='images/engine_part.png'" class="co-item-img">
                <div class="co-item-info">
                    <div class="co-item-name">${item.product.name}</div>
                    <div class="co-item-meta">Qty: ${item.quantity} &nbsp;|&nbsp; ${item.product.seller}</div>
                </div>
                <div class="co-item-price">&#8377;${parseInt(item.product.price) * item.quantity}</div>
            </div>`;
    });
    const gst = Math.round(subtotal * 0.18);
    const delivery = subtotal > 0 ? 50 : 0;
    document.getElementById('co-subtotal').innerHTML = '&#8377;' + subtotal;
    document.getElementById('co-gst').innerHTML = '&#8377;' + gst;
    document.getElementById('co-delivery').innerHTML = '&#8377;' + delivery;
    document.getElementById('co-total').innerHTML = '&#8377;' + (subtotal + gst + delivery);

    // Pre-fill user info
    const user = JSON.parse(localStorage.getItem('sz_user') || '{}');
    if (user.name && !document.getElementById('co-name').value)
        document.getElementById('co-name').value = user.name;
}

/* ==========================================================================
   PLACE ORDER
   ========================================================================== */
let orderHistory = JSON.parse(localStorage.getItem('sz_orders') || '[]');
let lastOrder = null;

function placeOrder() {
    const name = document.getElementById('co-name').value.trim();
    const addr1 = document.getElementById('co-addr1').value.trim();
    const city = document.getElementById('co-city').value.trim();
    const pin = document.getElementById('co-pin').value.trim();

    if (!name || !addr1 || !city || !pin) {
        showToast('Please fill in all required delivery details');
        return;
    }
    if (cart.length === 0) { showToast('Your cart is empty!'); return; }

    // Animate Place Order button
    const btn = document.querySelector('.place-order-btn');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
    }

    setTimeout(() => {
        const trackId = 'SZ-IN-' + Math.floor(1000000 + Math.random() * 9000000);
        const orderNum = 'SPZ' + Date.now().toString().slice(-8);
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 2);
        const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
        const addr2 = document.getElementById('co-addr2').value.trim();
        const state = document.getElementById('co-state').value.trim();
        const fullAddr = [name, addr1, addr2, city, state, pin].filter(Boolean).join(', ');

        const payLabels = { cod:'Cash on Delivery', upi:'UPI', debit:'Debit Card', credit:'Credit Card', netbanking:'Net Banking' };

        let subtotal = cart.reduce((s, i) => s + parseInt(i.product.price) * i.quantity, 0);
        const gst = Math.round(subtotal * 0.18);
        const total = subtotal + gst + 50;

        lastOrder = {
            id: orderNum,
            trackId,
            date: new Date().toLocaleDateString('en-IN'),
            items: [...cart],
            subtotal, gst, total,
            payment: payLabels[selectedPayment] || 'COD',
            address: fullAddr,
            deliveryDate: deliveryStr,
            status: 'Shipped'
        };

        orderHistory.unshift(lastOrder);
        localStorage.setItem('sz_orders', JSON.stringify(orderHistory));

        // Fill confirmation page
        document.getElementById('conf-order-num').innerText = orderNum;
        document.getElementById('conf-tracking-id').innerText = trackId;
        document.getElementById('conf-payment').innerText = payLabels[selectedPayment];
        document.getElementById('conf-delivery-date').innerText = deliveryStr;
        document.getElementById('conf-address').innerText = fullAddr;

        // Countdown (48 hrs)
        let secsLeft = 48 * 3600;
        clearInterval(window._cdTimer);
        window._cdTimer = setInterval(() => {
            if (secsLeft <= 0) { clearInterval(window._cdTimer); return; }
            const h = Math.floor(secsLeft / 3600);
            const m = Math.floor((secsLeft % 3600) / 60);
            const el = document.getElementById('conf-countdown');
            if (el) el.innerText = h + 'h ' + m + 'm';
            secsLeft--;
        }, 1000);

        // Update tracking page
        document.getElementById('tracking-id-display').innerText = 'Tracking ID: ' + trackId;
        document.getElementById('track-id-display').innerText = trackId;
        document.getElementById('track-order-num').innerText = orderNum;
        document.getElementById('track-est-date').innerText = deliveryStr;

        const now = new Date();
        const fmt = t => t.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
        const fs1 = document.getElementById('fs-time-1');
        const fs2 = document.getElementById('fs-time-2');
        const fs3 = document.getElementById('fs-time-3');
        if (fs1) fs1.innerText = fmt(new Date(now - 7200000));
        if (fs2) fs2.innerText = fmt(new Date(now - 3600000));
        if (fs3) fs3.innerText = fmt(now);

        cart = [];
        updateCartBadge();

        if (btn) { btn.innerHTML = '<i class="fa-solid fa-lock"></i> Place Order Securely'; btn.disabled = false; }

        showPage('confirmation');
    }, 1800);
}

/* ==========================================================================
   MY ORDERS
   ========================================================================== */
function renderOrders() {
    orderHistory = JSON.parse(localStorage.getItem('sz_orders') || '[]');
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    if (orderHistory.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:4rem 2rem;color:var(--text-muted);">
            <i class="fa-solid fa-box-open" style="font-size:4rem;margin-bottom:1rem;display:block;opacity:0.3;"></i>
            <h3>No Orders Yet</h3>
            <p style="margin-top:0.5rem;">Browse products and place your first order!</p>
            <button class="btn btn-gradient" style="margin-top:1.5rem;" onclick="showPage('home')">Shop Now</button>
        </div>`;
        return;
    }

    const statusColor = { Confirmed:'#10b981', Packed:'#3b82f6', Shipped:'#F97316', 'Out for Delivery':'#8b5cf6', Delivered:'#10b981' };

    container.innerHTML = orderHistory.map(order => `
        <div class="order-card glass-card">
            <div class="order-card-header">
                <div>
                    <div class="order-num">${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <div>
                    <span class="order-status-badge" style="background:${statusColor[order.status] || '#F97316'}20;color:${statusColor[order.status] || '#F97316'};">
                        <i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> ${order.status}
                    </span>
                </div>
                <div class="order-total-display">&#8377;${order.total}</div>
            </div>

            <div class="order-items-preview">
                ${order.items.slice(0,3).map(i => `
                    <div class="order-item-row">
                        <img src="${i.product.img}" onerror="this.src='images/engine_part.png'" class="order-item-img">
                        <div>
                            <div class="order-item-name">${i.product.name}</div>
                            <div class="order-item-meta">Qty: ${i.quantity} &nbsp;·&nbsp; &#8377;${i.product.price} each</div>
                        </div>
                    </div>`).join('')}
                ${order.items.length > 3 ? `<div style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem;">+${order.items.length - 3} more items</div>` : ''}
            </div>

            <div class="order-mini-stepper">
                ${['Confirmed','Packed','Shipped','Out for Delivery','Delivered'].map((s,i) => {
                    const stages = ['Confirmed','Packed','Shipped','Out for Delivery','Delivered'];
                    const cur = stages.indexOf(order.status);
                    const cls = i <= cur ? 'mini-step done' : 'mini-step';
                    return `<div class="${cls}"><div class="mini-dot"></div><div class="mini-label">${s}</div></div>`;
                }).join('')}
            </div>

            <div class="order-tracking-row">
                <span style="color:var(--text-muted);font-size:0.85rem;"><i class="fa-solid fa-barcode"></i> ${order.trackId}</span>
                <div class="order-actions">
                    <button class="btn btn-outline" style="padding:0.4rem 1rem;font-size:0.85rem;" onclick="viewTracking('${order.trackId}','${order.id}','${order.deliveryDate}')">
                        <i class="fa-solid fa-truck"></i> Track
                    </button>
                    <button class="btn btn-outline" style="padding:0.4rem 1rem;font-size:0.85rem;" onclick="downloadInvoice('${order.id}')">
                        <i class="fa-solid fa-file-invoice"></i> Invoice
                    </button>
                    <button class="btn btn-gradient" style="padding:0.4rem 1rem;font-size:0.85rem;" onclick="reorder('${order.id}')">
                        <i class="fa-solid fa-rotate-right"></i> Reorder
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function viewTracking(trackId, orderNum, deliveryDate) {
    document.getElementById('track-id-display').innerText = trackId;
    document.getElementById('track-order-num').innerText = orderNum;
    document.getElementById('track-est-date').innerText = deliveryDate;
    showPage('track');
}

function downloadInvoice(orderId) {
    showToast('Invoice for ' + orderId + ' downloaded!');
}

function reorder(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    order.items.forEach(item => {
        const ex = cart.find(i => i.product.id === item.product.id);
        if (ex) ex.quantity += item.quantity;
        else cart.push({ product: item.product, quantity: item.quantity });
    });
    updateCartBadge();
    showToast('Items added to cart! Ready to reorder.');
    showPage('cart');
}

/* ==========================================================================
   TRACKING RENDER
   ========================================================================== */
function renderTracking() {
    // Animate truck across bar
    const truck = document.getElementById('truck-icon');
    if (truck) {
        truck.style.left = '5%';
        setTimeout(() => { truck.style.left = '55%'; }, 300);
    }
}

/* ==========================================================================
   PROCEEDTOCHECKOUT (override old one)
   ========================================================================== */
function proceedToCheckout() {
    if (cart.length === 0) { showToast('Your cart is empty!'); return; }
    showPage('checkout');
}

// Initialize payment selection on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => selectPayment('cod'), 500);
});

// ==============================================
// TUTORIAL DATA — Product-specific info
// ==============================================
const tutorialData = {
    brake: {
        tools: '10mm Spanner, C-Clamp, Brake Cleaner, Clean Cloth',
        duration: '20 Mins',
        difficulty: 'Medium',
        steps: [
            'Remove old brake pads from caliper',
            'Clean the caliper mounting area',
            'Insert new brake pads into position',
            'Reassemble the caliper properly',
            'Test braking performance on the vehicle'
        ]
    },
    chain: {
        tools: 'Chain Breaker Tool, Pliers, Chain Lubricant',
        duration: '25 Mins',
        difficulty: 'Medium',
        steps: [
            'Remove old chain from sprocket set',
            'Clean the sprocket teeth thoroughly',
            'Loop new chain around sprockets',
            'Adjust chain tension to specification',
            'Test chain movement with wheel rotation'
        ]
    },
    filter: {
        tools: 'Screwdriver, Air Blower, Clean Cloth',
        duration: '10 Mins',
        difficulty: 'Easy',
        steps: [
            'Locate and remove the filter housing cover',
            'Pull out the old air filter element',
            'Clean the housing from dust and debris',
            'Insert the new filter into place',
            'Secure the cover and check fitment'
        ]
    },
    clutch: {
        tools: '10mm Spanner, Pliers, Cable Lubricant',
        duration: '15 Mins',
        difficulty: 'Medium',
        steps: [
            'Loosen the clutch cable adjuster nut',
            'Remove the old clutch wire carefully',
            'Route the new cable through guides',
            'Reconnect at lever and engine side',
            'Adjust free play and test clutch action'
        ]
    },
    mirror: {
        tools: '12mm Spanner, Screwdriver',
        duration: '10 Mins',
        difficulty: 'Easy',
        steps: [
            'Remove the old mirror mounting bolt',
            'Clean the mounting surface area',
            'Position the new mirror correctly',
            'Tighten the mounting bolt firmly',
            'Adjust mirror angle for visibility'
        ]
    },
    battery: {
        tools: '10mm Spanner, Terminal Cleaner, Grease',
        duration: '15 Mins',
        difficulty: 'Easy',
        steps: [
            'Disconnect the negative terminal first',
            'Remove the old battery from holder',
            'Clean battery tray and terminals',
            'Place new battery and secure it',
            'Connect positive then negative terminals'
        ]
    },
    headlight: {
        tools: 'Screwdriver, Clean Gloves',
        duration: '10 Mins',
        difficulty: 'Easy',
        steps: [
            'Remove the headlight unit or bulb cover',
            'Disconnect the bulb wiring harness',
            'Insert the new bulb without touching glass',
            'Reconnect wiring and secure the cover',
            'Test headlight beam and alignment'
        ]
    },
    spark: {
        tools: 'Spark Plug Wrench, Gap Gauge, Clean Cloth',
        duration: '10 Mins',
        difficulty: 'Easy',
        steps: [
            'Remove the spark plug cap carefully',
            'Unscrew old spark plug with wrench',
            'Check gap on new plug with gauge',
            'Screw in new plug hand-tight then wrench',
            'Reattach cap and test engine start'
        ]
    },
    oil: {
        tools: 'Drain Pan, Funnel, 17mm Socket Wrench',
        duration: '20 Mins',
        difficulty: 'Medium',
        steps: [
            'Warm up engine then switch off',
            'Place drain pan and remove drain plug',
            'Let old oil drain completely',
            'Replace plug and pour in new engine oil',
            'Check oil level with dipstick'
        ]
    },
    default: {
        tools: '10mm Spanner, Screwdriver, Clean Cloth',
        duration: '15 Mins',
        difficulty: 'Medium',
        steps: [
            'Remove old damaged part carefully',
            'Clean the fitting area thoroughly',
            'Install the new spare part',
            'Tighten all screws and connectors',
            'Test vehicle performance'
        ]
    }
};

// ==============================================
// TUTORIAL PLAYER CONTROLLER
// ==============================================
let tutorialPlaying = false;
let tutorialMuted = false;
let tutorialVolume = 80;
let currentTutorialProduct = '';
let completedSteps = [];

function getTutorialCategory(productName) {
    const name = (productName || '').toLowerCase();
    if (name.includes('brake') || name.includes('disc'))   return 'brake';
    if (name.includes('chain') || name.includes('sprocket'))return 'chain';
    if (name.includes('filter'))                            return 'filter';
    if (name.includes('clutch') || name.includes('cable'))  return 'clutch';
    if (name.includes('mirror'))                            return 'mirror';
    if (name.includes('battery'))                           return 'battery';
    if (name.includes('headlight') || name.includes('bulb') || name.includes('fog') || name.includes('lamp') || name.includes('tail light')) return 'headlight';
    if (name.includes('spark'))                             return 'spark';
    if (name.includes('oil') || name.includes('fluid') || name.includes('coolant')) return 'oil';
    return 'default';
}

function updateTutorialDetails(productName) {
    const category = getTutorialCategory(productName);
    const data = tutorialData[category] || tutorialData.default;

    // Update tools, duration, difficulty
    const toolsEl = document.getElementById('tutorial-tools');
    const durationEl = document.getElementById('tutorial-duration');
    const difficultyEl = document.getElementById('tutorial-difficulty');
    const subtitleEl = document.getElementById('tutorial-product-subtitle');

    if (toolsEl) toolsEl.textContent = data.tools;
    if (durationEl) durationEl.textContent = data.duration;
    if (difficultyEl) {
        difficultyEl.textContent = data.difficulty + ' Difficulty';
        difficultyEl.className = 'badge';
        if (data.difficulty === 'Easy') difficultyEl.classList.add('badge-easy');
        else if (data.difficulty === 'Hard') difficultyEl.classList.add('badge-hard');
        else difficultyEl.classList.add('badge-medium');
    }
    if (subtitleEl) subtitleEl.textContent = `Watch a real mechanic install this part step by step`;

    // Update step list
    const stepList = document.getElementById('tutorial-step-list');
    if (stepList) {
        stepList.innerHTML = data.steps.map((step, i) =>
            `<li id="step-${i}"><span class="step-num">${i + 1}</span> ${step}</li>`
        ).join('');
    }

    completedSteps = [];
}

function toggleTutorialPlay() {
    const iframe = document.getElementById('fitting-demo-iframe');
    const playBtn = document.getElementById('tutorial-play-pause');
    tutorialPlaying = !tutorialPlaying;
    
    if (tutorialPlaying) {
        iframe.contentWindow.postMessage({ type: 'play' }, '*');
        playBtn.className = 'fa-solid fa-pause';
    } else {
        iframe.contentWindow.postMessage({ type: 'pause' }, '*');
        playBtn.className = 'fa-solid fa-play';
    }
}

function restartTutorial() {
    const iframe = document.getElementById('fitting-demo-iframe');
    iframe.contentWindow.postMessage({ type: 'restart' }, '*');
    tutorialPlaying = true;
    document.getElementById('tutorial-play-pause').className = 'fa-solid fa-pause';
    completedSteps = [];
    // Reset step highlights
    const steps = document.querySelectorAll('#tutorial-step-list li');
    steps.forEach(li => {
        li.classList.remove('active', 'completed');
    });
}

function toggleTutorialMute() {
    const iframe = document.getElementById('fitting-demo-iframe');
    const muteBtn = document.getElementById('tutorial-mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    tutorialMuted = !tutorialMuted;
    
    iframe.contentWindow.postMessage({ type: 'mute', value: tutorialMuted }, '*');
    
    if (tutorialMuted) {
        muteBtn.className = 'fa-solid fa-volume-xmark';
        volumeSlider.value = 0;
    } else {
        muteBtn.className = 'fa-solid fa-volume-high';
        volumeSlider.value = tutorialVolume;
    }
}

function changeTutorialVolume(val) {
    const iframe = document.getElementById('fitting-demo-iframe');
    const muteBtn = document.getElementById('tutorial-mute-btn');
    tutorialVolume = parseInt(val);
    
    iframe.contentWindow.postMessage({ type: 'setVolume', value: tutorialVolume / 100 }, '*');
    
    if (tutorialVolume === 0) {
        tutorialMuted = true;
        muteBtn.className = 'fa-solid fa-volume-xmark';
    } else if (tutorialVolume < 50) {
        tutorialMuted = false;
        muteBtn.className = 'fa-solid fa-volume-low';
        iframe.contentWindow.postMessage({ type: 'mute', value: false }, '*');
    } else {
        tutorialMuted = false;
        muteBtn.className = 'fa-solid fa-volume-high';
        iframe.contentWindow.postMessage({ type: 'mute', value: false }, '*');
    }
}

function seekTutorial(e) {
    const bar = document.getElementById('tutorial-progress-bar');
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    
    const iframe = document.getElementById('fitting-demo-iframe');
    iframe.contentWindow.postMessage({ type: 'seek', percent: percent }, '*');
}

function toggleTutorialFullscreen() {
    const container = document.querySelector('.video-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            // Try webkit fallback
            if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            }
        });
    } else {
        document.exitFullscreen();
    }
}

// Listen for messages from the tutorial iframe
window.addEventListener('message', (e) => {
    const data = e.data;
    
    if (data.type === 'progress') {
        // Hide loader once we get progress (video is playing)
        const loader = document.getElementById('tutorial-loader');
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }
    
    if (data.type === 'stepChange') {
        highlightStep(data.step);
    }

    if (data.type === 'stepsUpdate') {
        // Iframe sent updated steps — update the step list
        const stepList = document.getElementById('tutorial-step-list');
        if (stepList && data.steps) {
            stepList.innerHTML = data.steps.map((step, i) =>
                `<li id="step-${i}"><span class="step-num">${i + 1}</span> ${step}</li>`
            ).join('');
        }
    }

    if (data.type === 'ended') {
        tutorialPlaying = false;
        // Mark all steps as completed
        const steps = document.querySelectorAll('#tutorial-step-list li');
        steps.forEach(li => {
            li.classList.remove('active');
            li.classList.add('completed');
        });
    }
});

function highlightStep(stepIndex) {
    const steps = document.querySelectorAll('#tutorial-step-list li');
    steps.forEach((li, idx) => {
        li.classList.remove('active');
        if (idx < stepIndex) {
            li.classList.add('completed');
            li.classList.remove('active');
        } else if (idx === stepIndex) {
            li.classList.add('active');
            li.classList.remove('completed');
        } else {
            li.classList.remove('completed');
        }
    });
}

// ==============================================
// OPEN TUTORIAL MODAL (Enhanced)
// ==============================================
function openTutorialModal(productName) {
    currentTutorialProduct = productName;
    document.getElementById('tutorial-product-name').innerText = productName;
    document.getElementById('tutorial-modal').classList.remove('hidden');
    
    // Update product-specific tutorial details
    updateTutorialDetails(productName);
    
    // Reset UI state
    tutorialPlaying = false;
    completedSteps = [];
    document.getElementById('tutorial-loader').style.display = 'flex';
    document.getElementById('tutorial-loader').style.opacity = '1';
    
    // Refresh iframe and tell it which product to load
    const iframe = document.getElementById('fitting-demo-iframe');
    iframe.src = 'fitting_demo.html';
    
    // Wait for iframe to load then send product name
    iframe.onload = function() {
        setTimeout(() => {
            iframe.contentWindow.postMessage({ type: 'loadProduct', productName: productName }, '*');
            // Sync theme
            const isLight = document.body.classList.contains('light-theme');
            iframe.contentWindow.postMessage({ type: 'theme', theme: isLight ? 'light' : 'dark' }, '*');
            // Set volume
            iframe.contentWindow.postMessage({ type: 'setVolume', value: tutorialVolume / 100 }, '*');
            if (tutorialMuted) {
                iframe.contentWindow.postMessage({ type: 'mute', value: true }, '*');
            }
        }, 300);
    };
}

function closeTutorialModal() {
    document.getElementById('tutorial-modal').classList.add('hidden');
    
    // Pause the video when closing
    const iframe = document.getElementById('fitting-demo-iframe');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.postMessage({ type: 'pause' }, '*');
        } catch(e) {}
    }
    tutorialPlaying = false;
}
