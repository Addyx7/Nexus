// ===========================================================
//  REFERRALS.JS — FULL FRONTEND ONLY, NO BACKEND
// ===========================================================

const LS_KEY = "nexus_referral_data";

// -----------------------------------------------------------
// Load saved referral data
// -----------------------------------------------------------
function loadReferralData() {
  const saved = JSON.parse(localStorage.getItem(LS_KEY));
  if (!saved) return;

  if (saved.code) {
    const input = document.getElementById("refCodeInput");
    input.value = saved.code;
    input.disabled = true;
  }

  if (saved.link) {
    showGeneratedLink(saved.link);
  }

  if (saved.stats) {
    applyStats(saved.stats);
  }
}

// -----------------------------------------------------------
// Create / Save referral code
// -----------------------------------------------------------
document.getElementById("createCodeBtn").addEventListener("click", () => {
  const input = document.getElementById("refCodeInput");
  const code = input.value.trim();

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(code)) {
    showToast("Invalid code. Use 3–20 chars (letters/numbers/_).", "error");
    return;
  }

  const link = `https://solbundler.com/register?ref=${code}`;
  const data = {
    code,
    link,
    stats: generateFakeStats()
  };

  localStorage.setItem(LS_KEY, JSON.stringify(data));
  input.disabled = true;

  showToast(`Referral code "${code}" created!`, "success");
  document.getElementById("createCodeBtn").innerHTML = '<i data-lucide="check"></i> Created';
  lucide.createIcons();

  showGeneratedLink(link);
  applyStats(data.stats);
});

// -----------------------------------------------------------
// Display generated referral link
// -----------------------------------------------------------
function showGeneratedLink(link) {
  const box = document.getElementById("refLinkBox");
  const text = document.getElementById("refLinkText");

  text.textContent = link;
  box.style.display = "block";

  const copyBtn = document.getElementById("copyRefBtn");
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("Referral link copied!", "success");
    } catch (e) {
      showToast("Copy failed", "error");
    }
  };

  lucide.createIcons();
}

// -----------------------------------------------------------
// Fake stats generator
// -----------------------------------------------------------
function generateFakeStats() {
  const tier1 = Math.floor(Math.random() * 12);
  const tier2 = Math.floor(Math.random() * 20);
  const earned = (tier1 * 0.0125 + tier2 * 0.0025).toFixed(6);

  return {
    balance: (Math.random() * 0.003).toFixed(6),
    earned,
    withdrawn: "0.000000",
    available: earned,
    tier1,
    tier2
  };
}

// -----------------------------------------------------------
// Apply stats to UI
// -----------------------------------------------------------
function applyStats(stats) {
  const vals = document.querySelectorAll(".stat-value");
  vals[0].textContent = `${stats.balance} SOL`;
  vals[1].textContent = `${stats.earned} SOL`;
  vals[2].textContent = `${stats.withdrawn} SOL`;
  vals[3].textContent = `${stats.available} SOL`;

  vals.forEach(v => v.classList.remove("zero"));

  document.querySelectorAll(".tier-count")[0].innerHTML = `${stats.tier1} <small style="color:#888;">direct referrals</small>`;
  document.querySelectorAll(".tier-count")[1].innerHTML = `${stats.tier2} <small style="color:#888;">sub-referrals</small>`;

  if (parseFloat(stats.balance) >= 0.001) {
    document.querySelector(".alert-warning").style.display = "none";
    const btn = document.getElementById("withdrawBtn");
    btn.classList.add("enabled");
    btn.disabled = false;

    btn.onclick = () => {
      showToast("Withdraw completed! (fake simulation)", "success");
      stats.withdrawn = stats.available;
      stats.balance = "0.001000";
      stats.available = "0.000000";
      applyStats(stats);

      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      saved.stats = stats;
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
    };
  }
}

// -----------------------------------------------------------
// Copy wallet address
// -----------------------------------------------------------
document.getElementById("copyAddressBtn").addEventListener("click", async () => {
  const addr = document.getElementById("walletAddress").textContent;
  try {
    await navigator.clipboard.writeText(addr);
    showToast("Wallet address copied!", "success");
  } catch (e) {
    showToast("Copy failed", "error");
  }
});

// -----------------------------------------------------------
// Toast system
// -----------------------------------------------------------
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === "success" ? "check-circle" : "alert-circle"}"></i>
    ${message}
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = "toastOut .5s forwards";
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

// -----------------------------------------------------------
// Run on startup
// -----------------------------------------------------------
window.addEventListener("load", () => {
  loadReferralData();

  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    if (data.code) {
      const input = document.getElementById("refCodeInput");
      input.value = data.code;
      input.disabled = true;
    }
  } else {
    document.getElementById("refCodeInput").disabled = false;
  }

  lucide.createIcons();
});