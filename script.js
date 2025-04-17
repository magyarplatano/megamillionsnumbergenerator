const generateBtn = document.getElementById('generateBtn');
const ballsContainer = document.getElementById('balls');
const historyDiv = document.getElementById('history');
const whiteFreqDiv = document.getElementById('whiteFrequencies');
const megaFreqDiv = document.getElementById('megaFrequencies');

let whiteFreq = JSON.parse(localStorage.getItem('whiteFreq') || '{}');
let megaFreq = JSON.parse(localStorage.getItem('megaFreq') || '{}');

function getRandomNumbers() {
  let white = [];
  while (white.length < 5) {
    const num = Math.floor(Math.random() * 70) + 1;
    if (!white.includes(num)) white.push(num);
  }
  const mega = Math.floor(Math.random() * 25) + 1;
  return { white: white.sort((a,b) => a-b), mega };
}

function displayNumbers({ white, mega }) {
  ballsContainer.innerHTML = '';
  white.forEach(n => {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.textContent = n;
    ballsContainer.appendChild(ball);
  });
  const megaBall = document.createElement('div');
  megaBall.className = 'ball';
  megaBall.style.background = '#ffc107';
  megaBall.textContent = mega;
  ballsContainer.appendChild(megaBall);
}

function updateHistory(numbers) {
  const entry = document.createElement('div');
  entry.textContent = [...numbers.white, numbers.mega].join(', ');
  historyDiv.prepend(entry);
  if (historyDiv.children.length > 50) historyDiv.removeChild(historyDiv.lastChild);
}

function updateFrequencies(numbers) {
  numbers.white.forEach(n => whiteFreq[n] = (whiteFreq[n] || 0) + 1);
  megaFreq[numbers.mega] = (megaFreq[numbers.mega] || 0) + 1;
  localStorage.setItem('whiteFreq', JSON.stringify(whiteFreq));
  localStorage.setItem('megaFreq', JSON.stringify(megaFreq));
  renderFrequencies();
}

function renderFrequencies() {
  whiteFreqDiv.innerHTML = renderBars(whiteFreq, 70);
  megaFreqDiv.innerHTML = renderBars(megaFreq, 25);
}

function renderBars(freqData, maxNum) {
  let output = '';
  for (let i = 1; i <= maxNum; i++) {
    const count = freqData[i] || 0;
    const width = Math.min(count * 10, 100);
    output += `<div class="bar"><span>${i}</span><div style="width:${width}px">${count}</div></div>`;
  }
  return output;
}

generateBtn.addEventListener('click', () => {
  const nums = getRandomNumbers();
  displayNumbers(nums);
  updateHistory(nums);
  updateFrequencies(nums);
});

renderFrequencies();
