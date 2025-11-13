// === CUSTOM CURSOR + SPOTLIGHT + MESH BG ===
const cursor = document.querySelector('.cursor-custom');
const shape = document.querySelector('.cursor-shape');
const core = document.querySelector('.cursor-core');
const spotlight = document.querySelector('.cursor-spotlight');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
const speed = 0.16;

function animate() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  cursorX += dx * speed;
  cursorY += dy * speed;

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;

  spotlight.style.left = `${mouseX}px`;
  spotlight.style.top = `${mouseY}px`;

  document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);

  requestAnimationFrame(animate);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Hide on touch
if ('ontouchstart' in window || navigator.maxTouchPoints) {
  cursor.style.display = 'none';
  spotlight.style.display = 'none';
  document.body.style.cursor = 'default';
}

animate();

// === CHART ===
const ctx = document.getElementById('bundleChart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 380);
gradient.addColorStop(0, 'rgba(244,240,176,0.4)');
gradient.addColorStop(1, 'rgba(244,240,176,0.02)');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [{
      data: [6.5,5.9,8.0,8.1,5.6,5.5,4.0,5.9,8.0,8.1,9.0,8.5],
      borderColor: '#f4f0b0',
      backgroundColor: gradient,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 10,
      pointBackgroundColor: '#f4f0b0',
      pointBorderColor: '#d4af37',
      pointBorderWidth: 2,
      tension: 0.45,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000, easing: 'easeOutQuart' },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(25,32,31,.95)',
        titleColor: '#fff',
        bodyColor: '#f4f0b0',
        borderColor: '#f4f0b0',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: { label: ctx => `${ctx.formattedValue} SOL` }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#b5b5b5', callback: v => `${v} SOL` } },
      x: { grid: { display: false }, ticks: { color: '#b5b5b5' } }
    }
  }
});

// === NAV ACTIVE STATE ===
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// === REAL-TIME SOLANA PRICE (EVERY 5 SECONDS) ===
const priceSpan = document.querySelector('.price-box span');
const SOL_API = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';

async function updateSolPrice() {
  try {
    const res = await fetch(SOL_API);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const price = data.solana.usd.toFixed(2);
    priceSpan.textContent = `SOL: $${price}`;
  } catch (err) {
    console.warn('SOL price fetch failed:', err);
    priceSpan.textContent = 'SOL: $--.--'; // Graceful fallback
  }
}

// Initial load + every 5 seconds
updateSolPrice();
setInterval(updateSolPrice, 5000);