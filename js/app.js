// Initialize Icons
lucide.createIcons();

let currentActiveTab = 'home';
let filteredProducts = [...catalogProducts];
let currentCategory = 'all';

// Showroom Carousel State
let showroomIndex = 0;

// Escape user-provided strings before injecting into innerHTML templates.
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ==================== MODAL ACCESSIBILITY HELPERS ====================
let lastFocusedElement = null;

function openModal(id, focusSelector) {
  const modal = document.getElementById(id);
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  document.querySelector('.app-shell').inert = true;
  modal.classList.remove('hidden');
  const target = focusSelector
    ? modal.querySelector(focusSelector)
    : modal.querySelector('button, [href], input, select, textarea');
  if (target) target.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('hidden');
  document.querySelector('.app-shell').inert = false;
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

// Close topmost open dialog on Escape; trap Tab focus inside it.
document.addEventListener('keydown', (e) => {
  const ids = ['add-prod-modal', 'detail-modal', 'showroom-modal'];
  const open = ids.map(id => document.getElementById(id)).find(m => m && !m.classList.contains('hidden'));

  if (e.key === 'Escape' && open) {
    closeModal(open.id);
    return;
  }

  if (e.key !== 'Tab' || !open) return;
  const focusables = [...open.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

// Function to Switch Main Menus with Animation & Locked Dimensions
function switchTab(tabId) {
  if (currentActiveTab === tabId) return;

  // Update Nav Button Morphs
  const allNavBtns = document.querySelectorAll('.nav-btn');
  allNavBtns.forEach(btn => {
    btn.classList.remove('bg-brand-navy', 'text-white', 'px-5', 'shadow-md', 'active-tab');
    btn.classList.add('bg-white', 'text-brand-navy', 'w-[42px]');
    const label = btn.querySelector('.tab-label');
    if (label) label.classList.add('hidden');
  });

  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'w-[42px]');
    activeBtn.classList.add('bg-brand-navy', 'text-white', 'px-5', 'shadow-md', 'active-tab');
    const activeLabel = activeBtn.querySelector('.tab-label');
    if (activeLabel) activeLabel.classList.remove('hidden');
  }

  // Hide all panels
  const allPanels = document.querySelectorAll('.view-panel');
  allPanels.forEach(panel => {
    panel.classList.add('hidden', 'opacity-0');
  });

  // Show Selected Panel
  const targetPanel = document.getElementById(`view-${tabId}`);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
    setTimeout(() => {
      targetPanel.classList.remove('opacity-0');
    }, 30);
  }

  currentActiveTab = tabId;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.setAttribute('aria-current', btn.id === `nav-${tabId}` ? 'page' : 'false'));

  // Trigger Specific View Renders
  if (tabId === 'katalog') renderCatalogGrid();
  if (tabId === 'spesifikasi') renderComparison();
  if (tabId === 'pencarian') performGlobalSearch();
}

// Dynamic Render for Catalog Products Grid
function renderCatalogGrid() {
  const grid = document.getElementById('catalog-products-grid');
  if (!grid) return;

  grid.innerHTML = filteredProducts.map(prod => `
    <div class="bg-white rounded-[20px] p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div class="relative overflow-hidden rounded-[14px] bg-slate-100 h-40 mb-3">
          <img src="${escapeHtml(prod.img)}" alt="${escapeHtml(prod.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-2 left-2 ${prod.badgeColor} text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            ${escapeHtml(prod.badge)}
          </span>
        </div>
        <div class="text-[10px] font-bold text-brand-muted uppercase">${escapeHtml(prod.brand)} • ${escapeHtml((prod.category || '').toUpperCase())}</div>
        <h4 class="text-sm font-bold text-brand-navy mt-0.5 leading-snug">${escapeHtml(prod.name)}</h4>

        <div class="flex flex-wrap gap-1 my-2">
          ${prod.specs.map(s => `<span class="bg-brand-shell text-brand-navy text-[10px] font-semibold px-2 py-0.5 rounded-md">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div class="text-[10px] text-slate-400">Harga Katalog</div>
          <div class="text-sm font-extrabold text-brand-navy">Rp ${(prod.price / 1000000).toFixed(1)} Jt</div>
        </div>
        <button onclick="viewProductDetail('${prod.id}')" class="bg-brand-navy hover:bg-brand-navyHover text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
          Detail <i data-lucide="arrow-right" class="w-3 h-3"></i>
        </button>
      </div>
    </div>
  `).join('') || '<p class="p-5">Tidak ada produk yang cocok. Coba kata kunci lain atau reset filter.</p>';

  lucide.createIcons();
}

// Shared category state + combined filter pipeline (search, specs, SKU,
// category, price, stock, sort, reset all routed through js/filter.js).
function highlightCategory(cat) {
  document.querySelectorAll('.cat-filter-btn').forEach(b => {
    const active = b.dataset.category === cat;
    b.classList.toggle('bg-brand-navy', active);
    b.classList.toggle('text-white', active);
    b.classList.toggle('text-brand-navy', !active);
    b.classList.toggle('hover:bg-slate-100', !active);
  });
}

// Category Filter Handler
function filterCategory(cat) {
  currentCategory = cat;
  highlightCategory(cat);
  filterProducts();
}

// Filter Products by Search, Specs, SKU, Category, Price, Stock & Sort
function filterProducts() {
  const searchVal = document.getElementById('katalog-search-input')?.value || '';
  const maxPrice = parseFloat(document.getElementById('price-slider')?.value || 50) * 1000000;
  const stockOnly = document.getElementById('stock-only-toggle')?.checked;
  const sort = document.getElementById('sort-select')?.value || 'popular';

  filteredProducts = filterCatalog(catalogProducts, {
    category: currentCategory,
    query: searchVal,
    maxPrice,
    stockOnly,
    sort
  });

  renderCatalogGrid();
}

function updatePriceFilter(val) {
  const label = document.getElementById('price-val-label');
  if (label) label.innerText = `Rp ${val} Juta`;
  filterProducts();
}

function resetFilters() {
  const slider = document.getElementById('price-slider');
  const search = document.getElementById('katalog-search-input');
  const stock = document.getElementById('stock-only-toggle');
  const sort = document.getElementById('sort-select');
  const priceLabel = document.getElementById('price-val-label');

  if (slider) slider.value = 50;
  if (search) search.value = '';
  if (stock) stock.checked = false;
  if (sort) sort.value = 'popular';
  if (priceLabel) priceLabel.innerText = 'Rp 50 Juta';

  currentCategory = 'all';
  highlightCategory('all');
  filterProducts();
}

// Specification Comparison Matrix Logic
function renderComparison() {
  const id1 = document.getElementById('comp-prod-1')?.value || 'laptop-ai';
  const id2 = document.getElementById('comp-prod-2')?.value || 'phone-5g';

  const p1 = catalogProducts.find(p => p.id.toLowerCase().includes(id1.split('-')[0])) || catalogProducts[1];
  const p2 = catalogProducts.find(p => p.id.toLowerCase().includes(id2.split('-')[0])) || catalogProducts[2];

  document.getElementById('th-prod-1').innerText = p1.name;
  document.getElementById('th-prod-2').innerText = p2.name;

  const matrix = [
    { label: 'Brand & Manufaktur', v1: p1.brand, v2: p2.brand },
    { label: 'Kategori Produk', v1: p1.category.toUpperCase(), v2: p2.category.toUpperCase() },
    { label: 'Harga Katalog Resmi', v1: `Rp ${p1.price.toLocaleString('id-ID')}`, v2: `Rp ${p2.price.toLocaleString('id-ID')}` },
    { label: 'Fitur Unggulan', v1: p1.specs.join(', '), v2: p2.specs.join(', ') },
    { label: 'Ketersediaan Stok', v1: `${p1.stock} Unit Ready`, v2: `${p2.stock} Unit Ready` },
    { label: 'Garansi Distributor', v1: '24 Bulan Resmi', v2: '12 Bulan Resmi' }
  ];

  const tbody = document.getElementById('comp-table-body');
  if (tbody) {
    tbody.innerHTML = matrix.map(row => `
      <tr>
        <td class="py-3 px-2 font-bold text-slate-500">${escapeHtml(row.label)}</td>
        <td class="py-3 px-2">${escapeHtml(row.v1)}</td>
        <td class="py-3 px-2 text-brand-teal">${escapeHtml(row.v2)}</td>
      </tr>
    `).join('');
  }
}

// Interactive Bundle Calculator
function calculateBundleTotal() {
  let total = 0;
  if (document.getElementById('bundle-1')?.checked) total += 31900000;
  if (document.getElementById('bundle-2')?.checked) total += 34500000;
  if (document.getElementById('bundle-3')?.checked) total += 46800000;

  const label = document.getElementById('bundle-total-price');
  if (label) label.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Global Search Page Live Search
function performGlobalSearch() {
  const q = (document.getElementById('global-search-input')?.value || '').toLowerCase();
  const resultsContainer = document.getElementById('search-results-list');
  const countLabel = document.getElementById('search-count-label');

  const matches = filterCatalog(catalogProducts, { query: q });

  if (countLabel) countLabel.innerText = `Menampilkan ${matches.length} hasil pencarian`;

  if (resultsContainer) {
    resultsContainer.innerHTML = matches.map(p => `
      <div class="p-4 bg-brand-shell rounded-[18px] border border-slate-200/60 hover:border-brand-teal transition-all flex items-center gap-4 cursor-pointer" role="button" tabindex="0" onclick="viewProductDetail('${p.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();viewProductDetail('${p.id}')}">
        <img src="${escapeHtml(p.img)}" class="w-16 h-16 rounded-xl object-cover" alt="${escapeHtml(p.name)}">
        <div>
          <span class="text-[10px] font-bold text-brand-teal uppercase">${escapeHtml(p.brand)}</span>
          <h4 class="text-xs font-bold text-brand-navy">${escapeHtml(p.name)}</h4>
          <div class="text-xs font-extrabold text-brand-navy mt-1">Rp ${(p.price / 1000000).toFixed(1)} Jt</div>
        </div>
      </div>
    `).join('') || '<p class="p-4">Tidak ada hasil. Coba nama, spesifikasi, atau SKU lain.</p>';
  }
}

function quickSearch(tag) {
  const input = document.getElementById('global-search-input');
  if (input) {
    input.value = tag;
    performGlobalSearch();
  }
}

// Showroom Fullscreen Modal Logic
function launchShowroomFullscreen() {
  openModal('showroom-modal');
  renderShowroomSlide();
}

function closeShowroomFullscreen() {
  closeModal('showroom-modal');
}

function renderShowroomSlide() {
  const slide = showroomSlides[showroomIndex];
  document.getElementById('showroom-title').innerText = slide.title;
  document.getElementById('showroom-desc').innerText = slide.desc;
  document.getElementById('showroom-price').innerText = slide.price;
  document.getElementById('showroom-badge').innerText = slide.badge;
  document.getElementById('showroom-img').src = slide.img;
  document.getElementById('showroom-slide-num').innerText = `Slide ${showroomIndex + 1} dari ${showroomSlides.length}`;
}

function nextShowroomSlide() {
  showroomIndex = (showroomIndex + 1) % showroomSlides.length;
  renderShowroomSlide();
}

function prevShowroomSlide() {
  showroomIndex = (showroomIndex - 1 + showroomSlides.length) % showroomSlides.length;
  renderShowroomSlide();
}

// Add Product Modal Logic
function openAddProductModal() {
  openModal('add-prod-modal', '#new-prod-name');
}

function closeAddProductModal() {
  closeModal('add-prod-modal');
}

function saveNewProduct() {
  const name = document.getElementById('new-prod-name')?.value.trim();
  const cat = document.getElementById('new-prod-cat')?.value;
  const priceRaw = document.getElementById('new-prod-price')?.value;
  const specsRaw = document.getElementById('new-prod-specs')?.value || '';
  const price = parseFloat(priceRaw);

  if (!name || name.length > 120) {
    showToast('Nama produk wajib diisi, maksimal 120 karakter.');
    return;
  }
  if (!['laptop', 'phone', 'tv', 'iot', 'camera'].includes(cat)) {
    showToast('Pilih kategori produk.');
    return;
  }
  if (!Number.isSafeInteger(price) || price <= 0 || price > 1000000000) {
    showToast('Harga harus bilangan bulat antara Rp 1 dan Rp 1 miliar.');
    return;
  }

  const specs = specsRaw.split(',').map(s => s.trim()).filter(Boolean);
  if (specs.length === 0 || specs.length > 10 || specsRaw.length > 500 || specs.some(s => s.length > 100)) {
    showToast('Isi 1–10 spesifikasi, maksimal 100 karakter per item dan 500 karakter total.');
    return;
  }

  catalogProducts.unshift({
    id: `PROD-${Date.now()}`,
    name,
    category: cat,
    brand: 'Mitra Baru',
    price,
    stock: 10,
    badge: 'BARU',
    badgeColor: 'bg-brand-lime text-brand-navy',
    img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80',
    specs
  });

  closeAddProductModal();
  showToast('Produk baru berhasil ditambahkan ke katalog!');
  resetFilters();
  switchTab('katalog');
}

// View Detailed Spec Drawer Modal
function viewProductDetail(prodId) {
  const prod = catalogProducts.find(p => p.id === prodId) || catalogProducts[0];
  const card = document.getElementById('detail-modal-card');
  if (!card) return;

  card.innerHTML = `
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div>
        <span class="text-[10px] font-bold text-brand-teal uppercase">${escapeHtml(prod.brand)} OFFICIAL</span>
        <h3 class="text-lg font-bold text-brand-navy">${escapeHtml(prod.name)}</h3>
      </div>
      <button onclick="closeDetailModal()" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200" aria-label="Tutup detail produk">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <img src="${escapeHtml(prod.img)}" alt="${escapeHtml(prod.name)}" class="w-full h-56 object-cover rounded-2xl border border-slate-100">

    <div class="grid grid-cols-2 gap-3 text-xs my-2">
      <div class="bg-brand-shell p-3 rounded-xl">
        <div class="text-slate-400">Harga Resmi</div>
        <div class="text-lg font-extrabold text-brand-navy mt-0.5">Rp ${prod.price.toLocaleString('id-ID')}</div>
      </div>
      <div class="bg-brand-shell p-3 rounded-xl">
        <div class="text-slate-400">Status Ketersediaan</div>
        <div class="text-lg font-extrabold text-emerald-600 mt-0.5">${prod.stock} Unit Ready</div>
      </div>
    </div>

    <div>
      <div class="text-xs font-bold text-brand-navy mb-1">Spesifikasi Kunci:</div>
      <div class="flex flex-wrap gap-1.5">
        ${prod.specs.map(s => `<span class="bg-brand-ice text-brand-navy text-xs font-semibold px-3 py-1 rounded-full">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
      <button onclick="closeDetailModal()" class="px-4 py-2 rounded-full text-xs font-bold text-brand-muted hover:bg-slate-100">Tutup</button>
      <button onclick="showToast('Demo: permintaan brosur hanya simulasi, tidak ada file dikirim.'); closeDetailModal();" class="px-5 py-2 rounded-full bg-brand-navy text-white text-xs font-bold hover:bg-brand-navyHover shadow-md">Minta Brosur Resmi</button>
    </div>
  `;

  openModal('detail-modal', 'button');
  lucide.createIcons();
}

function closeDetailModal() {
  closeModal('detail-modal');
}

// Home Interactive Metric Updates
function updateHomeMetrics(tf) {
  const readyEl = document.getElementById('metric-active-sku');
  const valInden = document.getElementById('val-inden');
  const valReady = document.getElementById('val-ready');
  const valPromo = document.getElementById('val-promo');
  const valHabis = document.getElementById('val-habis');

  if (tf === 'week') {
    if (readyEl) readyEl.innerText = '148';
    if (valInden) valInden.innerText = '18';
    if (valReady) valReady.innerText = '148';
    if (valPromo) valPromo.innerText = '62';
    if (valHabis) valHabis.innerText = '22';
  } else if (tf === 'month') {
    if (readyEl) readyEl.innerText = '195';
    if (valInden) valInden.innerText = '12';
    if (valReady) valReady.innerText = '195';
    if (valPromo) valPromo.innerText = '30';
    if (valHabis) valHabis.innerText = '13';
  } else {
    if (readyEl) readyEl.innerText = '230';
    if (valInden) valInden.innerText = '5';
    if (valReady) valReady.innerText = '230';
    if (valPromo) valPromo.innerText = '10';
    if (valHabis) valHabis.innerText = '5';
  }
}

function toggleArchiveVisibility(checked) {
  const archivedItem = document.getElementById('archived-item-1');
  if (archivedItem) {
    archivedItem.classList.toggle('hidden', !checked);
  }
}

function dismissNotice() {
  const banner = document.getElementById('notice-banner');
  if (banner) {
    banner.style.display = 'none';
    showToast('Demo: arsip hanya contoh — tidak ada sinkronisasi nyata.');
  }
}

// Backend-only actions: this is a static site with no server. Each action is
// an honest in-page demo (toast) rather than a fake "sent/saved" message.
function sendTeamReminder() {
  showToast('Demo: pengingat hanya tampil di sini, tidak ada notifikasi yang dikirim.');
}

function openBrochureModal(title) {
  showToast(`Demo: brosur "${title}" hanya pratinjau lokal, tidak ada file dihasilkan.`);
}

function printSpecSheet() {
  // Native print dialog lets the user "Save as PDF".
  window.print();
}

function requestOfficialQuote() {
  showToast('Demo: penawaran tidak dikirim — situs statis tanpa backend.');
}

function toggleNotifications() {
  showToast('Demo: 3 update stok adalah contoh, tidak ada notifikasi real-time.');
}

function toggleSettings() {
  showToast('Demo: pengaturan tidak tersimpan karena situs statis.');
}

function showProfileModal() {
  showToast('Demo: profil Anna M hanyalah contoh akun.');
}

function showBrandFormDemo() {
  showToast('Demo: formulir kemitraan tidak dikirim — backend tidak tersedia.');
}

function filterByBrand(brandName) {
  currentCategory = 'all';
  highlightCategory('all');
  switchTab('katalog');
  const input = document.getElementById('katalog-search-input');
  if (input) {
    input.value = brandName;
    filterProducts();
  }
}

function exportCatalogPDF() {
  // Native print dialog lets the user "Save as PDF".
  window.print();
}

// Helper Toast System
function showToast(msg) {
  const toast = document.getElementById('toast-notify');
  const label = document.getElementById('toast-msg');
  if (toast && label) {
    label.innerText = msg;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 3200);
  }
}

// Live Countdown Timer logic for Promo tab
setInterval(() => {
  const secsEl = document.getElementById('timer-secs');
  if (secsEl) {
    let s = parseInt(secsEl.innerText);
    if (s > 0) {
      secsEl.innerText = (s - 1).toString().padStart(2, '0');
    } else {
      secsEl.innerText = '59';
    }
  }
}, 1000);

// Initial load
window.onload = function() {
  const categories = ['all', 'laptop', 'phone', 'tv', 'iot', 'camera'];
  document.querySelectorAll('.cat-filter-btn').forEach((btn, i) => {
    btn.dataset.category = categories[i];
    btn.lastElementChild.textContent = catalogProducts.filter(p => i === 0 || p.category === categories[i]).length;
  });
  document.querySelectorAll('div[onclick]').forEach(el => {
    el.setAttribute('role', 'button');
    el.tabIndex = 0;
    el.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); el.click(); }
    });
  });
  document.querySelectorAll('button[title]').forEach(el => el.setAttribute('aria-label', el.title));
  document.querySelectorAll('[role="dialog"] button').forEach(el => {
    if (!el.textContent.trim()) el.setAttribute('aria-label', 'Tutup dialog');
  });
  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (!el.hasAttribute('aria-label')) {
      const label = el.previousElementSibling;
      el.setAttribute('aria-label', label?.textContent.trim() || ({ 'stock-only-toggle': 'Hanya stok ready', 'archive-toggle': 'Tampilkan SKU arsip', 'timeframe-select': 'Periode stok', 'bundle-1': 'Paket WFH', 'bundle-2': 'Paket Smart Living', 'bundle-3': 'Paket Creator' }[el.id]) || el.id);
    }
  });
  document.getElementById('nav-home').setAttribute('aria-current', 'page');
  filterProducts();
};
