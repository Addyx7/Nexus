// mint.js – FULL LOGIC
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  const titleSpan = document.getElementById('dynamicTitle');
  const titleIcon = document.querySelector('.title-icon');
  const startBtn = document.getElementById('startMintBtn');

  const config = {
    mint: { title: 'Project Creation | Mint', icon: 'gem' },
    comment: { title: 'Project Creation | Comment', icon: 'message-circle' },
    sell: { title: 'Project Creation | Sell', icon: 'shopping-cart' }
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const c = config[tab];

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`${tab}-tab`).classList.add('active');

      titleSpan.textContent = c.title;
      titleIcon.setAttribute('data-lucide', c.icon);
      lucide.createIcons();
    });
  });

  // IMAGE UPLOAD
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('previewImg');
  const placeholder = document.getElementById('imagePlaceholder');
  const info = document.getElementById('imageInfo');

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file type. Use JPG, PNG, or GIF.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image too large. Max 5 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      info.textContent = `${file.name} • ${(file.size/1024).toFixed(1)} KB`;
      info.style.display = 'block';
      window.checkForm();
    };
    reader.readAsDataURL(file);
  });

  // WITHDRAWAL TOGGLE (SELL TAB)
  const useDefault = document.getElementById('useDefaultWithdraw');
  const defaultBox = document.getElementById('defaultAddressBox');
  const customBox = document.getElementById('customAddressBox');
  const defaultInput = document.getElementById('defaultAddress');
  const customInput = document.getElementById('customWithdrawAddress');

  const mockWallet = "5oNDSu4bM4q3xYvM9kP8n7m6kL5jH2gF1eR9tY8u7w6v5x4c3b2a1";

  useDefault.addEventListener('change', () => {
    if (useDefault.checked) {
      const short = mockWallet.slice(0, 5) + '...' + mockWallet.slice(-5);
      defaultInput.value = short;
      defaultBox.style.display = 'block';
      customBox.style.display = 'none';
    } else {
      defaultBox.style.display = 'none';
      customBox.style.display = 'block';
      customInput.focus();
    }
    window.checkForm();
  });

  customInput.addEventListener('input', () => {
    const val = customInput.value.trim();
    const isValid = val.length === 44 && /^[1-9A-HJ-NP-Za-km-z]{44}$/.test(val);
    customInput.style.borderColor = isValid ? '#4ade80' : 'rgba(244,240,176,0.2)';
    window.checkForm();
  });

  // FORM VALIDATION
  const required = ['tokenName', 'tokenSymbol', 'tokenDesc'];
  window.checkForm = () => {
    const filled = required.every(id => document.getElementById(id).value.trim());
    const image = preview.src && preview.style.display !== 'none';

    let withdrawValid = false;
    if (useDefault?.checked) {
      withdrawValid = true;
    } else {
      const addr = customInput?.value.trim();
      withdrawValid = addr?.length === 44 && /^[1-9A-HJ-NP-Za-km-z]{44}$/.test(addr);
    }

    startBtn.disabled = !(filled && image && window.verifiedWallets && withdrawValid);
  };

  required.forEach(id => {
    const el = document.getElementById(id);
    const countId = id === 'tokenName' ? 'nameCount' : id === 'tokenSymbol' ? 'symbolCount' : 'descCount';
    const max = id === 'tokenName' ? 32 : id === 'tokenSymbol' ? 10 : 280;
    el.addEventListener('input', () => {
      document.getElementById(countId).textContent = `${el.value.length}/${max}`;
      window.checkForm();
    });
  });

  // SELL TAB LOGIC
  const sellAmount = document.getElementById('sellAmount');
  const suffixBtns = document.querySelectorAll('.suffix-btn');
  const slippage = document.getElementById('slippage');
  const slippageValue = document.getElementById('slippageValue');
  const enableSellBtn = document.getElementById('enableSellBtn');
  const sellStatus = document.getElementById('sellStatus');

  setTimeout(() => {
    document.getElementById('tokenAddress').textContent = 'Nebula...xyz';
    document.getElementById('currentPrice').textContent = '0.012 SOL';
    document.getElementById('totalHoldings').textContent = '850K tokens';
    enableSellBtn.disabled = false;
  }, 2000);

  suffixBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const percent = btn.dataset.percent;
      sellAmount.value = (850000 * (percent / 100)).toFixed(0);
    });
  });

  slippage?.addEventListener('input', () => {
    slippageValue.textContent = `${slippage.value}%`;
  });

  enableSellBtn?.addEventListener('click', () => {
    sellStatus.classList.add('running');
    sellStatus.innerHTML = `<i data-lucide="zap" class="badge-icon"></i> Selling...`;
    lucide.createIcons();
    showToast('Selling token for SOL...', 'success');

    setTimeout(() => {
      sellStatus.classList.remove('running');
      sellStatus.innerHTML = `<i data-lucide="check-circle" class="badge-icon"></i> +2.4 SOL`;
      lucide.createIcons();
      showToast('Sold! +2.4 SOL received', 'success');
    }, 5000);
  });

  // COMMENT TAB
  const commentMsg = document.getElementById('commentMsg');
  const startCommentBtn = document.getElementById('startCommentBtn');
  const commentStatus = document.getElementById('commentStatus');

  commentMsg?.addEventListener('input', () => {
    const len = commentMsg.value.length;
    document.getElementById('commentCount').textContent = `${len}/280`;
    startCommentBtn.disabled = !len;
  });

  startCommentBtn?.addEventListener('click', () => {
    commentStatus.classList.add('running');
    commentStatus.innerHTML = `<i data-lucide="zap" class="badge-icon"></i> Running`;
    lucide.createIcons();
    showToast('Auto comment started!', 'success');
  });

  lucide.createIcons();
});

// TOAST
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}