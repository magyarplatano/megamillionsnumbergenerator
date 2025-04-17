const generateBtn = document.getElementById('generateBtn');
const whiteContainer = document.querySelector('.white-numbers');
const megaContainer = document.querySelector('.mega-number');
const ctxWhite = document.getElementById('whiteChart').getContext('2d');
const ctxMega = document.getElementById('megaChart').getContext('2d');

// Initialize frequency arrays
let whiteFreq = JSON.parse(localStorage.getItem('whiteFreq') || 'null');
let megaFreq = JSON.parse(localStorage.getItem('megaFreq') || 'null');
if (!whiteFreq) whiteFreq = Array(70).fill(0);
if (!megaFreq) megaFreq = Array(25).fill(0);

// Create Chart.js charts
const whiteChart = new Chart(ctxWhite, {
  type: 'bar',
  data: {
    labels: Array.from({length: 70}, (_, i) => i + 1),
    datasets: [{
      label: 'Frequency',
      data: whiteFreq,
    }]
  },
  options: { scales: { x: { display: false }, y: { beginAtZero: true } } }
});
const megaChart = new Chart(ctxMega, {
  type: 'bar',
  data: {
    labels: Array.from({length: 25}, (_, i) => i + 1),
    datasets: [{
      label: 'Frequency',
      data: megaFreq,
    }]
  },
  options: { scales: { x: { display: false }, y: { beginAtZero: true } } }
});

function pickNumbers() {
  const whites = [];
  while (whites.length < 5) {
    const n = Math.floor(Math.random() * 70) + 1;
    if (!whites.includes(n)) whites.push(n);
  }
  whites.sort((a,b)=>a-b);
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
  whites.forEach(n => whiteFreq[n-1]++);
  megaFreq[mega-1]++;
  localStorage.setItem('whiteFreq', JSON.stringify(whiteFreq));
  localStorage.setItem('megaFreq', JSON.stringify(megaFreq));
  whiteChart.data.datasets[0].data = whiteFreq;
  megaChart.data.datasets[0].data = megaFreq;
  whiteChart.update();
  megaChart.update();
}

generateBtn.addEventListener('click', () => {
  const nums = pickNumbers();
  renderNumbers(nums);
  updateFrequencies(nums);
});

// Initial render and chart update
const initialNums = pickNumbers();
renderNumbers(initialNums);
updateFrequencies(initialNums);