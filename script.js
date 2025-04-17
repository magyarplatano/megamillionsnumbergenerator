// script.js

const generateBtn    = document.getElementById('generateBtn');
const whiteContainer = document.querySelector('.white-numbers');
const megaContainer  = document.querySelector('.mega-number');
const whiteFreqList  = document.getElementById('whiteFreqList');
const megaFreqList   = document.getElementById('megaFreqList');

// ——— Utility Functions ———
/**
 * Safely parse JSON from localStorage.
 * @param {string} key - The key in localStorage.
 * @param {any} defaultValue - The default value if parsing fails.
 * @returns {any} The parsed value or the default.
 */
function safeParseLocalStorage(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse localStorage key "${key}":`, e);
    return defaultValue;
  }
}

/**
 * Save JSON to localStorage.
 * @param {string} key - The key in localStorage.
 * @param {any} value - The value to save.
 */
function safeSaveLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save to localStorage key "${key}":`, e);
  }
}

// ——— 1) Safely load or init frequency arrays ———
let whiteFreq = safeParseLocalStorage('whiteFreq', Array(70).fill(0));
let megaFreq  = safeParseLocalStorage('megaFreq', Array(25).fill(0));

// ——— 2) Pick & render numbers ———
function pickNumbers() {
  const whites = [];
  while (whites.length < 5) {
    const n = Math.floor(Math.random() * 70) + 1;
    if (!whites.includes(n)) whites.push(n);
  }
  whites.sort((a, b) => a - b);
  const mega = Math.floor(Math.random() * 25) + 1;
  return { whites, mega };
}

function renderNumbers({ whites, mega }) {
  const createBallHTML = (number, isMega) =>
    `<div class="ball ${isMega ? 'mega' : ''}" aria-label="Ball number ${number}">${number}</div>`;

  whiteContainer.innerHTML = whites.map(n => createBallHTML(n, false)).join('');
  megaContainer.innerHTML = createBallHTML(mega, true);
}

// ——— 3) Update & persist frequencies ———
function updateFrequencies({ whites, mega }) {
  whites.forEach(n => whiteFreq[n - 1]++);
  megaFreq[mega - 1]++;
  safeSaveLocalStorage('whiteFreq', whiteFreq);
  safeSaveLocalStorage('megaFreq', megaFreq);
}

// ——— 4) Render top lists with counts ———
function renderFrequencyLists() {
  const createFreqItemHTML = (item, isMega) =>
    `<div class="freq-item ${isMega ? 'mega' : ''}" aria-label="Number ${item.num} appeared ${item.count} times">
      ${item.num} – ${item.count}
    </div>`;

  // Top 5 white balls
  const topWhite = whiteFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  whiteFreqList.innerHTML = topWhite.map(item => createFreqItemHTML(item, false)).join('');

  // Top 3 mega balls
  const topMega = megaFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  megaFreqList.innerHTML = topMega.map(item => createFreqItemHTML(item, true)).join('');
}

// ——— Wiring up ———
generateBtn.addEventListener('click', debounce(() => {
  const nums = pickNumbers();
  renderNumbers(nums);
  updateFrequencies(nums);
  renderFrequencyLists();
}, 300)); // Debounce to prevent rapid clicks

// ——— 5) Initial page load ———
document.addEventListener('DOMContentLoaded', () => {
  const initial = pickNumbers(); // Optional: Show a first draw
  renderNumbers(initial);
  updateFrequencies(initial);
  renderFrequencyLists();
});

// ——— Debounce Helper ———
/**
 * Debounce a function to limit its execution rate.
 * @param {Function} func - Function to debounce.
 * @param {number} wait - Time in ms to wait before executing.
 * @returns {Function} Debounced function.
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
