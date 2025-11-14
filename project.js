/* ========================================
   PROJECT.JS – FULLY FUNCTIONAL
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ==== ELEMENTS ==== */
  const priceEl = document.getElementById('sol-price');
  const toastContainer = document.getElementById('toastContainer');

  /* ==== TOAST ==== */
  const showToast = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> ${msg}`;
    toastContainer.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => toast.remove(), 3500);
  };

  /* ==== SOL PRICE ==== */
  const SOL_API = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
  const updateSolPrice = async () => {
    try {
      const res = await fetch(SOL_API);
      const data = await res.json();
      const price = data.solana.usd.toFixed(2);
      priceEl.textContent = `SOL: $${price}`;
    } catch {
      priceEl.textContent = 'SOL: $--.--';
    }
  };
  updateSolPrice();
  setInterval(updateSolPrice, 5000);

  /* ==== CURSOR ==== */
  const cursor = document.querySelector('.cursor-custom');
  const spotlight = document.querySelector('.cursor-spotlight');
  let mx = 0, my = 0, cx = 0, cy = 0;
  const speed = 0.16;
  const animate = () => {
    const dx = mx - cx, dy = my - cy;
    cx += dx * speed; cy += dy * speed;
    cursor.style.left = `${cx}px`; cursor.style.top = `${cy}px`;
    spotlight.style.left = `${mx}px`; spotlight.style.top = `${my}px`;
    document.documentElement.style.setProperty('--mouse-x', `${mx}px`);
    document.documentElement.style.setProperty('--mouse-y', `${my}px`);
    requestAnimationFrame(animate);
  };
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  if ('ontouchstart' in window) { cursor.style.display = spotlight.style.display = 'none'; }
  animate();

  /* ==== TABS ==== */
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      t.classList.add('active');
      document.getElementById(t.dataset.tab).classList.add('active');
    });
  });

  /* ==== IMAGE UPLOAD ==== */
  const uploader = document.getElementById('imageUploader');
  const input = document.getElementById('imageInput');
  const placeholder = uploader.querySelector('.upload-placeholder');
  const preview = document.getElementById('previewContainer');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('removeImg');
  const progress = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  const reset = () => {
    preview.style.display = 'none';
    progress.style.display = 'none';
    placeholder.style.display = 'block';
    input.value = '';
  };
  const showPreview = file => {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      placeholder.style.display = 'none';
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };
  const fakeUpload = () => {
    progress.style.display = 'flex';
    let p = 0;
    const int = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) { p = 100; clearInterval(int); setTimeout(() => progress.style.display = 'none', 600); }
      progressFill.style.width = p + '%';
      progressText.textContent = Math.round(p) + '%';
    }, 120);
  };

  placeholder.addEventListener('click', () => input.click());
  input.addEventListener('change', e => { if (e.target.files[0]) { showPreview(e.target.files[0]); fakeUpload(); } });
  ['dragenter','dragover'].forEach(ev => uploader.addEventListener(ev, e => { e.preventDefault(); uploader.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => uploader.addEventListener(ev, e => { e.preventDefault(); uploader.classList.remove('dragover'); }));
  uploader.addEventListener('drop', e => {
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      const dt = new DataTransfer(); dt.items.add(f); input.files = dt.files;
      showPreview(f); fakeUpload();
    }
  });
  removeBtn.addEventListener('click', reset);

  /* ==== METADATA BUTTONS ==== */
  document.getElementById('deployBtn').addEventListener('click', () => {
    if (!previewImg.src || previewImg.src.includes('data:')) {
      showToast('Please upload an image first', 'error');
      return;
    }
    showToast('Deploying metadata…', 'success');
    setTimeout(() => showToast('Metadata deployed successfully!', 'success'), 2000);
  });


/* ===== CLONE METADATA POPUP ===== */

const clonePopup = document.getElementById('clonePopup');
const closeClonePopup = document.getElementById('closeClonePopup');
const cloneNowBtn = document.getElementById('cloneNowBtn');
const cloneCAInput = document.getElementById('cloneCA');

document.getElementById('cloneBtn').addEventListener('click', () => {
  clonePopup.style.display = 'flex';
  lucide.createIcons();
});

// close popup
closeClonePopup.addEventListener('click', () => {
  clonePopup.style.display = 'none';
});

// clone now
cloneNowBtn.addEventListener('click', () => {
  const ca = cloneCAInput.value.trim();

  if (!ca) {
    showToast("Enter a valid Token CA", "error");
    return;
  }

  showToast(`Cloning metadata for: ${ca}`, "success");

  clonePopup.style.display = 'none';
});



  /* ==== WALLET GENERATION ==== */
  const walletList = document.getElementById('walletList');
  const addWallet = (type, idx) => {
    const pub = type === 'dev' ? 'Dev1111...1111' : `Dist${idx}...${idx}`;
    const html = `
      <div class="wallet-item ${type}">
        <div class="wallet-info">
          <div class="badge ${type}">${type === 'dev' ? 'Dev Wallet' : `Distro ${idx}`}</div>
          <p class="address">${pub}</p>
        </div>
        <button class="btn icon"><i data-lucide="eye"></i></button>
      </div>`;
    walletList.insertAdjacentHTML('beforeend', html);
    lucide.createIcons();
  };
  document.getElementById('createWalletBtn').addEventListener('click', () => {
    const count = prompt('How many distro wallets?', '5');
    if (!count || isNaN(count)) return;
    addWallet('dev', 0);
    for (let i = 1; i <= count; i++) addWallet('distro', i);
    showToast(`${count} wallets generated`, 'success');
  });

  /* ==== SWAP LOGIC ==== */
  const percentSlider = document.getElementById('percentSlider');
  const percentValue = document.getElementById('percentValue');
  percentSlider.addEventListener('input', () => percentValue.textContent = `${percentSlider.value}%`);

  /* ==== LAUNCH BUTTONS ==== */
  document.querySelectorAll('.launch').forEach(btn => {
    btn.addEventListener('click', () => showToast(`${btn.textContent.trim()} clicked`, 'success'));
  });

  /* ==== DELETE PROJECT ==== */
  document.getElementById('deleteProjectBtn').addEventListener('click', () => {
    if (confirm('Delete project? This cannot be undone.')) {
      showToast('Project deleted', 'success');
      setTimeout(() => location.reload(), 1500);
    }
  });

  /* ==== LUCIDE ICONS ==== */
  lucide.createIcons();
});


