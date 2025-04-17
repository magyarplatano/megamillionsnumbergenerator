const generateBtn = document.getElementById('generateBtn');
const whiteContainer = document.querySelector('.white-numbers');
const megaContainer = document.querySelector('.mega-number');
const whiteFreqList = document.getElementById('whiteFreqList');
const megaFreqList = document.getElementById('megaFreqList');

// Initialize frequency arrays from localStorage or zero arrays
let whiteFreq = JSON.parse(localStorage.getItem('whiteFreq')) || Array(70).fill(0);
let megaFreq = JSON.parse(localStorage.getItem('megaFreq')) || Array(25).fill(0);

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
  whiteContainer.innerHTML = '';
  megaContainer.innerHTML = '';
  whites.forEach(n => {
    const b = document.createElement('div');
    b.className = 'ball'; b.textContent = n;
    whiteContainer.appendChild(b);
  });
  const m = document.createElement('div');
  m.className = 'ball'; m.textContent = mega;
  megaContainer.appendChild(m);
}

function updateFrequencies({ whites, mega }) {
  whites.forEach(n => whiteFreq[n - 1]++);
  megaFreq[mega - 1]++;
  localStorage.setItem('whiteFreq', JSON.stringify(whiteFreq));
  localStorage.setItem('megaFreq', JSON.stringify(megaFreq));
}

function renderFrequencyLists() {
  // Top 5 white balls
  const topWhite = whiteFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  whiteFreqList.innerHTML = topWhite
    .map(item => `<div class="freq-item">${item.num}</div>`)
    .join('');
  
  // Top 3 mega balls
  const topMega = megaFreq
    .map((count, idx) => ({ num: idx + 1, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  megaFreqList.innerHTML = topMega
    .map(item => `<div class="freq-item mega">${item.num}</div>`)
    .join('');
}

generateBtn.addEventListener('click', () => {
  const nums = pickNumbers();
  renderNumbers(nums);
  updateFrequencies(nums);
  renderFrequencyLists();
});

// Initial render
const initialNums = pickNumbers();
renderNumbers(initialNums);
updateFrequencies(initialNums);
renderFrequencyLists();