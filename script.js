const generateBtn = document.getElementById('generateBtn');
const whiteContainer = document.querySelector('.white-numbers');
const megaContainer = document.querySelector('.mega-number');

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

function render({ whites, mega }) {
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

generateBtn.addEventListener('click', () => {
  const nums = pickNumbers();
  render(nums);
});
// Initial render
render(pickNumbers());