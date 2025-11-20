// coin.js — NEXUS TERMINAL INTERACTIONS
lucide.createIcons();

const sliderFill = document.getElementById('sliderFill');
const percentBtns = document.querySelectorAll('.percent-buttons button');
const sellAmount = document.getElementById('sellAmount');
const receiveSol = document.getElementById('receiveSol');
const sellBtn = document.getElementById('sellBtn');
const caBox = document.getElementById('caBox');

// Percent buttons
percentBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    percentBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const pct = parseInt(btn.dataset.pct);
    sliderFill.style.width = `${pct}%`;
    const tokens = 2.852 * (pct / 100);
    sellAmount.value = tokens.toFixed(2);
    receiveSol.textContent = (tokens * 1).toFixed(3); // mock price
  });
});

// Slider drag (optional)
document.querySelector('.slider-container').addEventListener('click', e => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = Math.round((x / rect.width) * 100);
  const clamped = Math.max(0, Math.min(100, pct));
  sliderFill.style.width = `${clamped}%`;
  document.querySelector(`[data-pct="${clamped < 37.5 ? 25 : clamped < 62.5 ? 50 : clamped < 87.5 ? 75 : 100}"]`).click();
});

// Copy CA
caBox.addEventListener('click', async () => {
  await navigator.clipboard.writeText('8ABYcdikwxugExgHNF79f6u9jyqQqrUtBCZYTaUbpump');
  const icon = caBox.querySelector('i');
  icon.setAttribute('data-lucide', 'check');
  lucide.createIcons();
  setTimeout(() => {
    icon.setAttribute('data-lucide', 'copy');
    lucide.createIcons();
  }, 1500);
});

// Sell button animation
sellBtn.addEventListener('mousemove', e => {
  const rect = sellBtn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  sellBtn.style.setProperty('--mouse-x', `${x}px`);
  sellBtn.style.setProperty('--mouse-y', `${y}px`);
});

// Chart
new Chart(document.getElementById('priceChart'), {
  type: 'line',
  data: { labels: Array(100).fill(''), datasets: [{ 
    data: Array(100).fill().map((_,i) => 0.04 + Math.sin(i/8)*0.018 + Math.random()*0.006),
    borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 3, tension: 0.4, fill: true, pointRadius: 0
  }]},
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }}, scales: { x: { display: false }, y: { display: false }}}
});

// SOL Price
const updateSol = async () => {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const d = await r.json();
    document.getElementById('solPrice').textContent = `SOL: $${d.solana.usd.toFixed(2)}`;
  } catch(e) {}
};
updateSol(); setInterval(updateSol, 10000);


async function loadPumpChart(ca) {
    const url = `https://api.pump.fun/v1/trades/${ca}/chart?interval=1m`;

    const res = await fetch(url);
    const data = await res.json();

    return data.map(point => ({
        time: point.t * 1000,  // UNIX → ms
        price: point.c         // use close price
    }));
}

let pumpChart;

async function renderPumpChart(ca) {
    try {
        const res = await fetch(`https://api.pump.fun/v1/trades/${ca}/chart?interval=1m`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!data || data.length === 0) {
            console.log("No chart data – token might be too new or dev sold");
            return;
        }

        const chartData = data.map(point => ({
            time: point.t * 1000,
            price: point.c
        }));

        const ctx = document.getElementById("pumpChart").getContext("2d");
        if (pumpChart) pumpChart.destroy();

        pumpChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: chartData.map(x => new Date(x.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})),
                datasets: [{
                    label: "Price (SOL)",
                    data: chartData.map(x => x.price),
                    borderWidth: 2.5,
                    borderColor: "#f4f0b0",
                    backgroundColor: "rgba(244,240,176,0.12)",
                    tension: 0.45,
                    pointRadius: 0,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { 
                        display: true,
                        ticks: { color: "#b5b5b5", font: { size: 11 } },
                        grid: { color: "rgba(244,240,176,0.08)" }
                    }
                }
            }
        });

    } catch (err) {
        console.error("Chart failed to load:", err);
        document.getElementById("pumpChart").parentElement.innerHTML += 
            `<div style="text-align:center;color:#fb923c;padding:2rem;">Chart failed to load<br><small>Token may be too new or rugged</small></div>`;
    }
}

const CA = "tS4VZtqyq6wpZkwuNTnZAetz7hU8BHti3EAChjvpump";  // change this

renderPumpChart(CA);
setInterval(() => renderPumpChart(CA), 10000);
