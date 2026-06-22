const container = document.getElementById('product-container');
const brandSelect = document.getElementById('brandFilter');

// Filter မှတ်သားထားရန်
let currentCondition = 'all';
let currentBrand = 'all';

// ၁။ Brand အမည်များကို products.js မှ အလိုအလျောက် ဆွဲထုတ်ပြီး Dropdown တွင်ထည့်ရန်
function loadBrands() {
    // Brand အမည်များကို ထပ်မနေအောင် (Unique) ယူပြီး A-Z အတိုင်း စီစဉ်ခြင်း
    const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
    
    uniqueBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}

// ၂။ Product များကို Filter စစ်ခြင်း နှင့် အလိုအလျောက် စီစဉ်ခြင်း (Auto Sort)
function renderProducts() {
    container.innerHTML = '';
    
    // မူရင်း Data ကိုမထိခိုက်စေရန် Copy ကူးယူခြင်း
    let filteredProducts = [...products];
    
    // Filter စစ်ထုတ်ခြင်း (အသစ်/အဟောင်း နှင့် Brand)
    if (currentCondition !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.type === currentCondition);
    }
    
    if (currentBrand !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.brand === currentBrand);
    }

    // 🌟 ဤနေရာသည် Auto Sort လုပ်ပေးသည့် အပိုင်းဖြစ်သည် 🌟
    filteredProducts.sort((a, b) => {
        // (က) Brand ကို A-Z အရင်စီမည်
        const brandA = a.brand.toLowerCase();
        const brandB = b.brand.toLowerCase();
        if (brandA < brandB) return -1;
        if (brandA > brandB) return 1;

        // (ခ) Brand တူနေပါက 'new' ကို 'used' ထက် အရင်လာစေမည် (n က u ထက် အက္ခရာစဉ်စောသောကြောင့်ဖြစ်သည်)
        const typeA = a.type.toLowerCase();
        const typeB = b.type.toLowerCase();
        if (typeA < typeB) return -1; 
        if (typeA > typeB) return 1;

        return 0; // အားလုံးတူနေပါက မူလအတိုင်းထားမည်
    });

    // ရှာမတွေ့ပါက ပြရန်
    if (filteredProducts.length === 0) {
        container.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center; color: #7f8c8d; padding: 40px;">ယခုအမျိုးအစားအတွက် ပစ္စည်းမရှိသေးပါ။</h3>`;
        return;
    }

    // ပစ္စည်းများကို Web ပေါ်တွင် ပုံဖော်ခြင်း
    filteredProducts.forEach(product => {
        const message = encodeURIComponent(`မင်္ဂလာပါ၊ ${product.name} (${product.condition}) - ${product.price} လေးကို ဝယ်ယူချင်လို့ပါ။`);
        const waLink = `https://wa.me/${whatsappNumber}?text=${message}`;
        const msgrLink = `https://m.me/${messengerId}`; 

        const productHTML = `
            <div class="product-card">
                <div class="badges">
                    <span class="badge badge-brand">${product.brand}</span>
                    <span class="badge badge-${product.type}">${product.condition}</span>
                </div>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h2 class="product-name">${product.name}</h2>
                <p class="specs">${product.specs}</p>
                <div class="price">${product.price}</div>
                <div class="buttons">
                    <a href="${waLink}" target="_blank" class="btn btn-whatsapp">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="${msgrLink}" target="_blank" class="btn btn-messenger">
                        <i class="fab fa-facebook-messenger"></i> Messenger
                    </a>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// ၃။ အသစ်/အဟောင်း ခလုတ်နှိပ်သောအခါ အလုပ်လုပ်မည့် Function
function filterCondition(condition) {
    currentCondition = condition;
    
    // ခလုတ်အရောင်ပြောင်းရန် (Active State)
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderProducts();
}

// ၄။ Brand Dropdown ရွေးသောအခါ အလုပ်လုပ်မည့် Function
function filterBrand(brand) {
    currentBrand = brand;
    renderProducts();
}

// Website စစဖွင့်ချင်း အလုပ်လုပ်စေရန်
loadBrands();
renderProducts();
