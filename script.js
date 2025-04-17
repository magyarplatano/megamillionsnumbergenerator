// script.js

const generateBtn    = document.getElementById('generateBtn');
const whiteContainer = document.querySelector('.white-numbers');
const megaContainer  = document.querySelector('.mega-number');
const whiteFreqList  = document.getElementById('whiteFreqList');
const megaFreqList   = document.getElementById('megaFreqList');

// ——— 1) Safely load or init frequency arrays ———
let whiteFreq = Array(70).fill(0);
let megaFreq  = Array(25).fill(0);

try {
  const w = localStorage.getItem('whiteFreq');
  const m = localStorage.getItem('megaFreq');
  if (w) whiteFreq = JSON.parse(w);
  if (m) megaFreq  = JSON.parse(m);
} catch (e) {
  console.error('Failed to parse stored frequencies:', e);
}

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
  whiteContainer.innerHTML = whites
    .map(n => `<div class="ball">${n}</div>`).join('');
  
  megaContainer.innerHTML = `<div class="ball">${mega}</div>`;
}

// ——— 3) Update & persist frequencies ———
function updateFrequencies({ whites, mega }) {
  whites.forEach(n => whiteFreq[n - 1]++);
  megaFreq[mega - 1]++;
  localStorage.setItem('whiteFreq', JSON.stringify(whiteFreq));
  localStorage.setItem('megaFreq',  JSON.stringify(megaFreq));
}

// ——— 4) Render top lists with counts ———
function renderFrequencyLists() {
  // Top 5 white balls
  const topWhite = whiteFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  whiteFreqList.innerHTML = topWhite
    .map(item => `<div class="freq-item">${item.num} – ${item.count}</div>`)
    .join('');

  // Top 3 mega balls
  const topMega = megaFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  megaFreqList.innerHTML = topMega
    .map(item => `<div class="freq-item mega">${item.num} – ${item.count}</div>`)
    .join('');
}

// ——— Wiring up ———
generateBtn.addEventListener('click', () => {
  const nums = pickNumbers();
  renderNumbers(nums);
  updateFrequencies(nums);
  renderFrequencyLists();
});

// ——— 5) Initial page load ———
document.addEventListener('DOMContentLoaded', () => {
  // show a first draw (optional)
  const initial = pickNumbers();
  renderNumbers(initial);
  updateFrequencies(initial);

  // then render the frequency lists
  renderFrequencyLists();
});
