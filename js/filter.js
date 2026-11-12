/**
 * Shared filter logic for the catalog.
 * Pure function: no DOM, no global state. Mirrors app.js filtering so the
 * UI and the runnable assertion check stay in sync.
 *
 * @param {Array} products
 * @param {{category?: string, query?: string, maxPrice?: number, stockOnly?: boolean, sort?: string}} options
 * @returns {Array}
 */
function filterCatalog(products, options = {}) {
  const category = options.category || 'all';
  const query = (options.query || '').trim().toLowerCase();
  const maxPrice = Number.isFinite(options.maxPrice) ? options.maxPrice : Infinity;
  const stockOnly = !!options.stockOnly;
  const sort = options.sort || 'popular';

  const pool = products.filter(p => {
    const matchesCategory = category === 'all' || p.category === category;
    const haystack = [p.name, p.brand, p.category, p.id, ...(p.specs || [])].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesPrice = p.price <= maxPrice;
    const matchesStock = !stockOnly || p.stock > 0;
    return matchesCategory && matchesQuery && matchesPrice && matchesStock;
  });

  const sorted = [...pool];
  switch (sort) {
    case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
    case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
    case 'stock': sorted.sort((a, b) => b.stock - a.stock); break;
    default: break; // 'popular' keeps catalog order
  }
  return sorted;
}

if (typeof module !== 'undefined') module.exports = { filterCatalog };
