/* ==============================================================
   SETTINGS PAGE – FULL LOGIC, FLAWLESS EXECUTION
   ============================================================== */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  /* TAB SWITCHING */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab + '-tab';
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  /* WITHDRAWAL WALLET LOGIC */
  const withdrawInput = document.getElementById('withdrawAddress');
  const saveBtn = document.getElementById('saveWalletBtn');
  const viewBtn = document.getElementById('viewBalanceBtn');
  const editBtn = document.getElementById('editWalletBtn');
  const inputSection = document.getElementById('inputSection');
  const savedSection = document.getElementById('savedWalletSection');
  const savedDisplay = document.getElementById('savedWalletDisplay');

  const VALID_REGEX = /^[1-9A-HJ-NP-Za-km-z]{44}$/;

  // Load saved
  const saved = localStorage.getItem('defaultWithdrawWallet');
  if (saved && VALID_REGEX.test(saved)) {
    showSavedView(saved);
  }

  function showSavedView(addr) {
    withdrawInput.value = addr;
    savedDisplay.textContent = addr.slice(0, 10) + '...' + addr.slice(-8);
    inputSection.classList.add('hidden');
    savedSection.classList.remove('hidden');
    saveBtn.disabled = true;
  }

  function showInput() {
    inputSection.classList.remove('hidden');
    savedSection.classList.add('hidden');
    withdrawInput.focus();
    withdrawInput.select();
  }

  // Input validation
  withdrawInput.addEventListener('input', () => {
    const val = withdrawInput.value.trim();
    saveBtn.disabled = !VALID_REGEX.test(val);
  });

  // Save
  saveBtn.addEventListener('click', () => {
    const addr = withdrawInput.value.trim();
    if (VALID_REGEX.test(addr)) {
      localStorage.setItem('defaultWithdrawWallet', addr);
      showSavedView(addr);
      showToast('Withdrawal address saved!', 'success');
    }
  });

  // Edit
  editBtn.addEventListener('click', showInput);

  // View Balance Modal
  viewBtn.addEventListener('click', async () => {
    const modal = document.getElementById('balanceModal');
    const loader = document.getElementById('balanceLoader');
    const result = document.getElementById('balanceResult');
    modal.classList.add('active');
    loader.style.display = 'block';
    result.innerHTML = '';

    const addr = localStorage.getItem('defaultWithdrawWallet');
    try {
      const resp = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [addr] })
      });
      const data = await resp.json();
      const sol = data.result.value / 1e9;
      result.innerHTML = `
        <div class="full-address">${addr}</div>
        <div class="sol-balance">${sol.toFixed(6)} SOL</div>
        <div class="usd-estimate">≈ $${(sol * 180).toFixed(2)} USD</div>
      `;
    } catch (e) {
      result.innerHTML = `<p style="color:var(--error);">Failed to fetch balance.</p>`;
    } finally {
      loader.style.display = 'none';
    }
  });

  window.closeBalanceModal = () => document.getElementById('balanceModal').classList.remove('active');

  /* BACKUP / RESTORE */
  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = { defaultWithdrawWallet: localStorage.getItem('defaultWithdrawWallet') || null, version: "1.0", exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `solbundler-backup-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('Settings exported!', 'success');
  });

  const importFile = document.getElementById('importFile');
  const importBtn = document.getElementById('importBtn');
  importFile.addEventListener('change', () => importBtn.disabled = !importFile.files[0]);
  importBtn.addEventListener('click', () => {
    const file = importFile.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.defaultWithdrawWallet && VALID_REGEX.test(json.defaultWithdrawWallet)) {
          localStorage.setItem('defaultWithdrawWallet', json.defaultWithdrawWallet);
          location.reload();
        } else {
          showToast('Invalid wallet in file.', 'warning');
        }
      } catch { showToast('Invalid JSON.', 'error'); }
    };
    reader.readAsText(file);
  });

  /* RESET */
  document.getElementById('resetDefaultsBtn').addEventListener('click', () => {
    if (confirm('Reset to defaults? (Wallets stay)')) {
      localStorage.removeItem('defaultWithdrawWallet');
      location.reload();
      showToast('Reset complete.', 'success');
    }
  });

  document.getElementById('factoryResetBtn').addEventListener('click', () => {
    if (confirm('FACTORY RESET – EVERYTHING DELETED. Continue?')) {
      localStorage.clear();
      showToast('Factory reset. Reloading…', 'warning');
      setTimeout(() => location.reload(), 1500);
    }
  });

  /* TOAST */
  function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i data-lucide="${type==='success'?'check-circle':type==='error'?'alert-circle':'alert-triangle'}"></i><span>${msg}</span>`;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 500); }, 3000);
  }
});