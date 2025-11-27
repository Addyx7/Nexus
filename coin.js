// coin.js — KRAKENFI Nexus Terminal (FIXED & WORKING 100%)
lucide.createIcons();

let pumpChart = null;

const CA = "3gsmySNUPuwUgHUUxKA7GoN2fyuvHyU1pR5eW9G8Vpump";

async function renderPumpChart(ca) {
  try {
    const res = await fetch(`https://api.pump.fun/v1/trades/${ca}/chart?interval=1m`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data || data.length === 0) {
      console.log("No chart data yet – token might be very new");
      document.querySelector("#pumpChart").parentElement.innerHTML = 
        `<div style="text-align:center;color:#fb923c;padding:4rem 0;font-size:1.1rem;">
          No price data yet<br><small>Token is too new or has no trades</small>
        </div>`;
      return;
    }

    const chartData = data.map(p => ({
      time: p.t * 1000,
      price: p.c
    }));

    const ctx = document.getElementById("pumpChart").getContext("2d");
    if (pumpChart) pumpChart.destroy();

    pumpChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.map(d => new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        datasets: [{
          label: "Price (SOL)",
          data: chartData.map(d => d.price),
          borderColor: "#f4f0b0",
          backgroundColor: "rgba(244,240,176,0.15)",
          borderWidth: 2.8,
          pointRadius: 0,
          tension: 0.45,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            display: true,
            grid: { color: "rgba(244,240,176,0.08)" },
            ticks: { color: "#b5b5b5", font: { size: 11 } }
          }
        }
      }
    });

  } catch (err) {
    console.error("Pump chart failed:", err);
    document.querySelector("#pumpChart").parentElement.innerHTML = 
      `<div style="text-align:center;color:#fb923c;padding:4rem 0;">
        Chart failed to load<br><small>${err.message}</small>
      </div>`;
  }
}

renderPumpChart(CA);
setInterval(() => renderPumpChart(CA), 12000);

document.getElementById('caBox')?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(CA);
  const icon = document.querySelector('#caBox i');
  icon.setAttribute('data-lucide', 'check');
  lucide.createIcons();
  setTimeout(() => {
    icon.setAttribute('data-lucide', 'copy');
    lucide.createIcons();
  }, 1500);
});

const updateSol = async () => {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const d = await r.json();
    document.getElementById('solPrice').textContent = `SOL: $${d.solana.usd.toFixed(2)}`;
  } catch(e) { console.log("SOL price fetch failed"); }
};
updateSol();
setInterval(updateSol, 10000);

// BUY / SELL SWITCH (only new part)
document.getElementById('modeBuy')?.addEventListener('click', () => {
  document.getElementById('modeBuy').classList.add('active');
  document.getElementById('modeSell').classList.remove('active');
  document.getElementById('buyMode').style.display = 'block';
  document.getElementById('sellMode').style.display = 'none';
});

document.getElementById('modeSell')?.addEventListener('click', () => {
  document.getElementById('modeSell').classList.add('active');
  document.getElementById('modeBuy').classList.remove('active');
  document.getElementById('sellMode').style.display = 'block';
  document.getElementById('buyMode').style.display = 'none';
});

const btn1 = document.getElementById("paySolBtn1");
const btn2 = document.getElementById("paySolBtn2");

function updateButtons(mode) {
  if (mode === "BUY") {
    btn1.innerHTML = `<img src="sol.svg" style="width:20px;height:20px;"> Buy All +Dev`;
    btn2.innerHTML = `<img src="sol.svg" style="width:20px;height:20px;"> Buy All -Dev`;
  } else {
    btn1.innerHTML = `<img src="sol.svg" style="width:20px;height:20px;"> Sell All +Dev`;
    btn2.innerHTML = `<img src="sol.svg" style="width:20px;height:20px;"> Sell All -Dev`;
  }
}

// hook into your buttons
document.getElementById("modeBuy").addEventListener("click", () => {
  updateButtons("BUY");
});

document.getElementById("modeSell").addEventListener("click", () => {
  updateButtons("SELL");
});
