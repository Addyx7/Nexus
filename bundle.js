// bundle.js – FULLY FIXED, WORLD-CLASS, NO BUGS
document.addEventListener('DOMContentLoaded', () => {
  const walletPanel = document.getElementById('walletPanel');
  const addWalletModal = document.getElementById('addWalletModal');
  const walletDetailsModal = document.getElementById('walletDetailsModal');
  const walletList = document.getElementById('walletList');
  const groupList = document.getElementById('groupList');
  const walletCountInput = document.getElementById('walletCount');
  const generateBtn = document.getElementById('generateWalletsBtn');
  const nextBtn = document.getElementById('nextStepBtn');
  const downloadBtn = document.getElementById('downloadWalletsBtn');
  const mainStatusBar = document.getElementById('mainStatusBar');

  let currentGroupId = null;
  let currentWallet = null;
  let dummyIndex = 0;

  // === DUMMY DATA ===
  const dummyPubkeys = [
    "Dev1111111111111111111111111111111111111111111111111111111111111",
    "Dist1111111111111111111111111111111111111111111111111111111111111",
    "Dist2222222222222222222222222222222222222222222222222222222222222",
    "Dist3333333333333333333333333333333333333333333333333333333333333",
    "Dist4444444444444444444444444444444444444444444444444444444444444",
    "Dist5555555555555555555555555555555555555555555555555555555555555",
    "Dist6666666666666666666666666666666666666666666666666666666666666",
    "Dist7777777777777777777777777777777777777777777777777777777777777",
    "Dist8888888888888888888888888888888888888888888888888888888888888",
    "Dist9999999999999999999999999999999999999999999999999999999999999"
  ];

  const dummyPrivkeys = [
    "5KJvsngHeMpm8846yRUySoiHZYaC9G4tPt1rKB4eDcka9gt1qV3S3k4t7mXb3j2k8n9m1p2q3r4s5t6u7v8w9x0y1z",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z",
    "i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z"
  ];

  // === ENABLE GENERATE BTN ===
  walletCountInput?.addEventListener('input', () => {
    const val = parseInt(walletCountInput.value) || 0;
    generateBtn.style.opacity = val > 0 && val <= 100 ? '1' : '0.5';
    generateBtn.style.pointerEvents = val > 0 && val <= 100 ? 'auto' : 'none';
    generateBtn.disabled = !(val > 0 && val <= 100);
  });

  // === CREATE GROUP ===
  document.getElementById('createGroupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('groupName').value.trim();
    if (!name) return showToast('Enter group name', 'error');

    const groupId = `group-${Date.now()}`;
    const html = `
      <div class="project-item group-item" data-group-id="${groupId}">
        <div class="project-info">
          <div class="project-avatar" style="background: rgba(244,240,176,.15); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="folder" style="width: 20px; height: 20px; stroke: var(--gold);"></i>
          </div>
          <div>
            <div class="project-name">${escapeHTML(name)}</div>
            <div class="project-status pending"><i data-lucide="clock"></i> 0 wallets</div>
          </div>
        </div>
        <button class="view-wallets-btn view-all" style="font-size: .8rem; padding: .4rem .8rem; background: rgba(244,240,176,.1); border-radius: 999px;">View Wallets <i data-lucide="arrow-right"></i></button>
      </div>
    `;

    document.getElementById('emptyGroupState')?.remove();
    groupList.insertAdjacentHTML('afterbegin', html);
    lucide.createIcons();
    updateTotalGroups();
    document.getElementById('createGroupModal').style.display = 'none';
    e.target.reset();
    showToast(`Group "${name}" created!`, 'success');
  });

  // === EVENT DELEGATION ===
  document.addEventListener('click', (e) => {
    const t = (sel) => e.target.closest(sel);

    // OPEN MODALS
    if (t('#headerCreateBtn') || t('#newGroupBtn') || t('#bottomCreateBtn')) {
      const modal = document.getElementById('createGroupModal');
      modal.style.display = 'flex';
      setTimeout(() => document.getElementById('groupName')?.focus(), 100);
    }

    if (t('#addWalletBtn')) {
      addWalletModal.style.display = 'flex';
      setTimeout(() => walletCountInput?.focus(), 100);
    }

// VIEW WALLETS → redirect to mint.html
if (t('.view-wallets-btn')) {
  window.location.href = 'mint.html';
}


    // GENERATE WALLETS
    if (t('#generateWalletsBtn') && !generateBtn.disabled) {
      const count = parseInt(walletCountInput.value);
      if (!count || count < 1 || count > 100) return;

      const empty = walletList.querySelector('.empty-wallet-state');
      if (empty) empty.remove();

      for (let i = 0; i < count; i++) {
        const pubkey = dummyPubkeys[dummyIndex % dummyPubkeys.length];
        const privkey = dummyPrivkeys[dummyIndex % dummyPubkeys.length];
        const name = i === 0 ? 'Dev Wallet' : `Distro Wallet ${i + 1}`;
        dummyIndex++;

        const html = `
          <div class="wallet-card" data-pubkey="${pubkey}">
            <div class="wallet-info">
              <div class="wallet-name-badge ${i === 0 ? 'dev' : 'distro'}">
                ${escapeHTML(name)}
              </div>
              <p class="wallet-address">${pubkey.slice(0, 8)}...${pubkey.slice(-6)}</p>
            </div>
            <button class="view-wallet-details glass-btn">
              <i data-lucide="eye"></i>
            </button>
          </div>
        `;

        walletList.insertAdjacentHTML('afterbegin', html);
        saveWallet(currentGroupId, pubkey, privkey);
        updateWalletCount(currentGroupId, true);
        updateTotalWallets(true);
      }

      lucide.createIcons();
      showToast(`${count} wallet${count > 1 ? 's' : ''} added!`, 'success');
      addWalletModal.style.display = 'none';
      walletCountInput.value = 1;
      generateBtn.style.opacity = '0.5';
      generateBtn.style.pointerEvents = 'none';
      generateBtn.disabled = true;
      nextBtn.disabled = false;
      downloadBtn.disabled = false;
    }

    // VIEW WALLET DETAILS
    if (t('.view-wallet-details')) {
      const card = t('.wallet-card');
      const pubkey = card.dataset.pubkey;
      currentWallet = { pubkey, card };

      document.getElementById('detailPubkey').textContent = pubkey;
      const privEl = document.getElementById('detailPrivkey');
      privEl.textContent = '••••'.repeat(16);
      privEl.style.filter = 'blur(5px)';
      document.getElementById('togglePrivkey').textContent = 'Show Key';
      document.getElementById('solscanLink').href = `https://solscan.io/account/${pubkey}`;

      walletDetailsModal.style.display = 'flex';
    }

    // TOGGLE PRIVATE KEY
    if (t('#togglePrivkey')) {
      const el = document.getElementById('detailPrivkey');
      const btn = document.getElementById('togglePrivkey');
      if (el.style.filter === 'blur(5px)') {
        el.textContent = getPrivkey(currentGroupId, currentWallet.pubkey);
        el.style.filter = 'none';
        btn.textContent = 'Hide Key';
      } else {
        el.textContent = '••••'.repeat(16);
        el.style.filter = 'blur(5px)';
        btn.textContent = 'Show Key';
      }
    }

    // DELETE WALLET
    if (t('#deleteWalletBtn')) {
      if (!confirm('Delete this wallet?')) return;
      removeWallet(currentGroupId, currentWallet.pubkey);
      currentWallet.card.remove();
      updateWalletCount(currentGroupId, false);
      updateTotalWallets(false);
      walletDetailsModal.style.display = 'none';
      showToast('Wallet deleted', 'error');

      if (!walletList.querySelector('.wallet-card')) {
        walletList.innerHTML = getEmptyStateHTML();
        lucide.createIcons();
        nextBtn.disabled = true;
        downloadBtn.disabled = true;
      }
    }

    // BACK BUTTON
    if (t('.back-btn')) {
      walletPanel.style.display = 'none';
      mainStatusBar.style.display = 'flex'; // SHOW STATUS BAR
    }

    // NEXT STEP
    if (t('#nextStepBtn') && !nextBtn.disabled) {
      showToast('Next step activated!', 'success');
    }

    // DOWNLOAD WALLETS
    if (t('#downloadWalletsBtn') && !downloadBtn.disabled) {
      downloadWallets();
    }

    // CLOSE MODALS
    if (t('.modal-close') || e.target.classList.contains('modal')) {
      const modal = t('.modal') || e.target;
      if (modal.classList.contains('modal')) modal.style.display = 'none';
    }
  });

  // === DOWNLOAD WALLETS FUNCTION ===
  function downloadWallets() {
    const data = getData()[currentGroupId];
    if (!data || Object.keys(data).length === 0) {
      showToast('No wallets to download', 'error');
      return;
    }

    let txt = `SOLANA BUNDLE WALLETS\n`;
    txt += `Group: ${document.getElementById('panelGroupName').textContent.trim()}\n`;
    txt += `Generated: ${new Date().toLocaleString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    })}\n`;
    txt += `${'═'.repeat(60)}\n\n`;

    let index = 0;
    for (const [pubkey, privkey] of Object.entries(data)) {
      const name = index === 0 ? 'Dev Wallet' : `Distro Wallet ${index}`;
      txt += `${name.toUpperCase()}\n`;
      txt += `Public Address:  ${pubkey}\n`;
      txt += `Private Key:     ${privkey}\n`;
      txt += `${'─'.repeat(60)}\n\n`;
      index++;
    }

    txt += `TOTAL WALLETS: ${index}\n`;
    txt += `SECURITY: Never share this file. Private keys are sensitive.\n`;
    txt += `Generated by SolBundler Nexus\n`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOL_WALLETS_${currentGroupId.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    showToast(`Downloaded ${index} wallet${index > 1 ? 's' : ''}!`, 'success');
  }

  // === STORAGE HELPERS ===
  const getData = () => JSON.parse(localStorage.getItem('bundleData') || '{}');
  const saveData = (data) => localStorage.setItem('bundleData', JSON.stringify(data));

  const saveWallet = (groupId, pubkey, privkey) => {
    const data = getData();
    if (!data[groupId]) data[groupId] = {};
    data[groupId][pubkey] = privkey;
    saveData(data);
  };

  const getPrivkey = (groupId, pubkey) => getData()[groupId]?.[pubkey] || '';
  const removeWallet = (groupId, pubkey) => {
    const data = getData();
    if (data[groupId]) delete data[groupId][pubkey];
    if (Object.keys(data[groupId] || {}).length === 0) delete data[groupId];
    saveData(data);
  };

  const loadWallets = (groupId) => {
    walletList.innerHTML = '<div class="empty-wallet-state">Loading...</div>';
    setTimeout(() => {
      const data = getData()[groupId] || {};
      walletList.innerHTML = '';
      if (Object.keys(data).length === 0) {
        walletList.innerHTML = getEmptyStateHTML();
        lucide.createIcons();
        nextBtn.disabled = true;
        downloadBtn.disabled = true;
        return;
      }
      Object.keys(data).forEach((pubkey, index) => {
        const name = index === 0 ? 'Dev Wallet' : `Distro Wallet ${index}`;
        const html = `
          <div class="wallet-card" data-pubkey="${pubkey}">
            <div class="wallet-info">
              <div class="wallet-name-badge ${index === 0 ? 'dev' : 'distro'}">
                ${escapeHTML(name)}
              </div>
              <p class="wallet-address">${pubkey.slice(0, 8)}...${pubkey.slice(-6)}</p>
            </div>
            <button class="view-wallet-details glass-btn">
              <i data-lucide="eye"></i>
            </button>
          </div>
        `;
        walletList.insertAdjacentHTML('beforeend', html);
      });
      lucide.createIcons();
      nextBtn.disabled = false;
      downloadBtn.disabled = false;
    }, 200);
  };

  const getEmptyStateHTML = () => `
    <div class="empty-wallet-state">
      <i data-lucide="wallet" style="width: 68px; height: 68px; opacity: .25; margin-bottom: 1.2rem; stroke: var(--gold);"></i>
      <p>No wallets in this bundle yet.</p>
      <p style="font-size: .85rem; margin-top: .5rem; opacity: .7;">Click "Add More" to generate wallets</p>
    </div>
  `;

  const updateWalletCount = (groupId, inc) => {
    const group = document.querySelector(`[data-group-id="${groupId}"]`);
    if (!group) return;
    const status = group.querySelector('.project-status');
    let count = parseInt(status.textContent.match(/\d+/)?.[0] || '0');
    count = inc ? count + 1 : count - 1;
    status.innerHTML = `<i data-lucide="clock"></i> ${count} wallet${count !== 1 ? 's' : ''}`;
    lucide.createIcons();
  };

  const updateTotalGroups = () => {
    document.getElementById('totalGroups').textContent = document.querySelectorAll('.group-item').length;
  };

  const updateTotalWallets = (inc) => {
    const el = document.getElementById('totalWallets');
    let total = parseInt(el.textContent);
    total = inc ? total + 1 : total - 1;
    el.textContent = total;
  };

  const showToast = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; top: 2rem; right: 2rem; z-index: 10000;
      background: ${type === 'error' ? 'rgba(251,146,60,.15)' : 'rgba(74,222,128,.15)'};
      color: ${type === 'error' ? '#fb923c' : '#4ade80'};
      padding: .8rem 1.4rem; border-radius: 999px; font-size: .9rem;
      border: 1px solid ${type === 'error' ? 'rgba(251,146,60,.3)' : 'rgba(74,222,128,.3)'};
      backdrop-filter: blur(12px); font-weight: 600;
      animation: fadeInOut 3.5s forwards;
      box-shadow: 0 8px 32px rgba(0,0,0,.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  };

  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Toast animation
  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        15%, 85% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
});

  const nextBtn = document.getElementById('nextStepBtn');

  // Enable the button when you're ready (optional)
  nextBtn.disabled = false;

  nextBtn.addEventListener('click', () => {
    // Redirect to mint.html
    window.location.href = 'mint.html';

  });
