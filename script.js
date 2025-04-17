const generateBtn = document.getElementById('generateBtn');
const ballsContainer = document.getElementById('balls');
const historyDiv = document.getElementById('history');

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

generateBtn.addEventListener('click', () => {
  const nums = getRandomNumbers();
  displayNumbers(nums);
  updateHistory(nums);
});
