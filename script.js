// script.js (Refactored and Improved)

// Utility Functions
const safeParseLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error(`Error parsing key "${key}" from localStorage.`, e);
    return defaultValue;
  }
};

const safeSaveLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key "${key}" to localStorage.`, e);
  }
};

// Frequency Arrays
let whiteFreq = safeParseLocalStorage('whiteFreq', new Array(70).fill(0));
let megaFreq = safeParseLocalStorage('megaFreq', new Array(25).fill(0));

// DOM Validation Helper
const getValidatedElement = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
};

// DOM Elements
const generateBtn = getValidatedElement('#generateBtn');
const whiteContainer = getValidatedElement('.white-numbers');
const megaContainer = getValidatedElement('.mega-number');
const whiteFreqList = getValidatedElement('#whiteFreqList');
const megaFreqList = getValidatedElement('#megaFreqList');
const resetBtn = getValidatedElement('#resetBtn');

// Number Generation
const pickNumbers = () => {
  const whites = [];
  while (whites.length < 5) {
    const n = Math.floor(Math.random() * 70) + 1;
    if (!whites.includes(n)) whites.push(n);
  }
  whites.sort((a, b) => a - b);
  const mega = Math.floor(Math.random() * 25) + 1;
  return { whites, mega };
};

// Rendering Functions
const renderNumbers = ({ whites, mega }) => {
  whiteContainer.innerHTML = whites
    .map((n) => `<div class="ball" aria-label="White ball ${n}">${n}</div>`)
    .join('');
  megaContainer.innerHTML = `<div class="ball mega" aria-label="Mega ball ${mega}">${mega}</div>`;
};

const renderFrequencyLists = () => {
  const createFreqHTML = (item, isMega) =>
    `<div class="freq-item ${isMega ? 'mega' : ''}" aria-label="${item.num} appeared ${item.count} times">
       ${item.num} – ${item.count}
     </div>`;

  const topWhite = whiteFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  whiteFreqList.innerHTML = topWhite.map((item) => createFreqHTML(item, false)).join('');

  const topMega = megaFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  megaFreqList.innerHTML = topMega.map((item) => createFreqHTML(item, true)).join('');
};

// Frequency Updates
const updateFrequencies = ({ whites, mega }) => {
  whites.forEach((n) => whiteFreq[n - 1]++);
  megaFreq[mega - 1]++;
  safeSaveLocalStorage('whiteFreq', whiteFreq);
  safeSaveLocalStorage('megaFreq', megaFreq);
};

// Debounce Helper
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Event Handlers
generateBtn.addEventListener(
  'click',
  debounce(() => {
    const nums = pickNumbers();
    renderNumbers(nums);
    updateFrequencies(nums);
    renderFrequencyLists();
  }, 300)
);

resetBtn.addEventListener('click', () => {
  if (!confirm('Reset your frequency data? This action cannot be undone.')) return;

  // Clear frequency data
  localStorage.removeItem('whiteFreq');
  localStorage.removeItem('megaFreq');

  whiteFreq = new Array(70).fill(0);
  megaFreq = new Array(25).fill(0);

  renderFrequencyLists();
  alert('Frequency data has been reset.');
});

// Initial Page Load
document.addEventListener('DOMContentLoaded', () => {
  const initialDraw = pickNumbers();
  renderNumbers(initialDraw);
  updateFrequencies(initialDraw);
  renderFrequencyLists();
});
