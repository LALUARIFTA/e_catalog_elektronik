const assert = require('node:assert/strict');
const { filterCatalog } = require('../js/filter.js');
const products = [
  { id: 'SKU-A', name: 'Laptop', brand: 'A', category: 'laptop', price: 10, stock: 2, specs: ['RAM 16GB'] },
  { id: 'SKU-B', name: 'Laptop', brand: 'B', category: 'laptop', price: 20, stock: 0, specs: ['RAM 32GB'] },
  { id: 'SKU-C', name: 'Phone', brand: 'A', category: 'phone', price: 5, stock: 5, specs: ['RAM 16GB'] }
];
const options = { category: 'laptop', query: 'ram 16gb', maxPrice: 15, stockOnly: true, sort: 'popular' };
assert.deepEqual(filterCatalog(products, options).map(p => p.id), ['SKU-A']);
assert.deepEqual(filterCatalog(products, { ...options, query: 'sku-b', maxPrice: 30, stockOnly: false }).map(p => p.id), ['SKU-B']);
assert.deepEqual(filterCatalog(products, { category: 'all', query: '', maxPrice: Infinity, stockOnly: false, sort: 'price-low' }).map(p => p.id), ['SKU-C', 'SKU-A', 'SKU-B']);
assert.deepEqual(filterCatalog(products, { category: 'all', query: '', maxPrice: Infinity, stockOnly: false, sort: 'stock' }).map(p => p.id), ['SKU-C', 'SKU-A', 'SKU-B']);
console.log('Filter assertions passed');
