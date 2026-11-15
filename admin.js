// Logika Admin Dashboard (admin.js)

const ADMIN_SECRET_PIN = "admin123";
let isVotingOpen = true;

const loginSection = document.getElementById("admin-login-section");
const dashboardSection = document.getElementById("admin-dashboard-section");
const adminLoginForm = document.getElementById("admin-login-form");
const adminPinInput = document.getElementById("admin-pin");
const loginError = document.getElementById("login-error");
const btnLogout = document.getElementById("btn-logout");
const btnToggleVoting = document.getElementById("btn-toggle-voting");
const btnInitDatabase = document.getElementById("btn-init-database");
const btnResetVotes = document.getElementById("btn-reset-votes");

const votersGrid = document.getElementById("voters-grid");
const qcCount1 = document.getElementById("qc-count-1");
const qcCount2 = document.getElementById("qc-count-2");
const barPaslon1 = document.getElementById("bar-paslon-1");
const barPaslon2 = document.getElementById("bar-paslon-2");
const qcTotalVotes = document.getElementById("qc-total-votes");

document.addEventListener("DOMContentLoaded", () => {
  checkAdminSession();
  setupAdminEvents();
});

function setupAdminEvents() {
  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (adminPinInput.value.trim() === ADMIN_SECRET_PIN) {
      sessionStorage.setItem("isAdminLoggedIn", "true");
      loginError.style.display = "none";
      loadAdminDashboard();
    } else {
      loginError.textContent = "PIN Pengurus salah!";
      loginError.style.display = "block";
    }
  });

  btnLogout.addEventListener("click", () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    window.location.reload();
  });

  btnToggleVoting.addEventListener("click", toggleVotingSession);
  btnInitDatabase.addEventListener("click", initializeDefaultDatabase);
  btnResetVotes.addEventListener("click", resetAllVotes);
}

function checkAdminSession() {
  if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
    loadAdminDashboard();
  }
}

function loadAdminDashboard() {
  loginSection.style.display = "none";
  dashboardSection.style.display = "block";

  listenToRealtimeResults();
  listenToVotersList();
  listenToSettings();
}

function listenToRealtimeResults() {
  db.collection(DB_CANDIDATES).onSnapshot((snapshot) => {
    let votes1 = 0;
    let votes2 = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (doc.id === "paslon-1") votes1 = data.votes || 0;
      if (doc.id === "paslon-2") votes2 = data.votes || 0;
    });

    const total = votes1 + votes2;
    qcTotalVotes.textContent = total;

    const pct1 = total > 0 ? Math.round((votes1 / total) * 100) : 0;
    const pct2 = total > 0 ? Math.round((votes2 / total) * 100) : 0;

    qcCount1.textContent = `${votes1} Suara (${pct1}%)`;
    barPaslon1.style.width = `${pct1}%`;

    qcCount2.textContent = `${votes2} Suara (${pct2}%)`;
    barPaslon2.style.width = `${pct2}%`;
  });
}

function listenToVotersList() {
  db.collection(DB_VOTERS).onSnapshot((snapshot) => {
    votersGrid.innerHTML = "";
    
    const voterMap = {};
    snapshot.forEach(doc => {
      voterMap[doc.id] = doc.data();
    });

    for (let i = 1; i <= 26; i++) {
      const absenStr = i < 10 ? `0${i}` : `${i}`;
      const voter = voterMap[absenStr];
      const hasVoted = voter ? voter.hasVoted : false;

      const chip = document.createElement("div");
      chip.className = `voter-chip ${hasVoted ? "voted" : "pending"}`;
      chip.innerHTML = `
        <span class="chip-num">No. ${absenStr}</span>
        <span class="chip-status">${hasVoted ? "✓ Sudah" : "• Belum"}</span>
      `;
      chip.title = hasVoted ? `Absen ${absenStr}: Sudah menggunakan hak suara` : `Absen ${absenStr}: Belum menggunakan hak suara`;
      votersGrid.appendChild(chip);
    }
  });
}

function listenToSettings() {
  db.collection(DB_SETTINGS).doc("voting_control").onSnapshot((doc) => {
    if (doc.exists) {
      isVotingOpen = doc.data().isOpen !== false;
    } else {
      isVotingOpen = true;
    }
    updateToggleButtonText();
  });
}

function updateToggleButtonText() {
  if (isVotingOpen) {
    btnToggleVoting.textContent = "🔒 Kunci / Tutup Pemilihan";
    btnToggleVoting.className = "btn-modern btn-outline-custom";
  } else {
    btnToggleVoting.textContent = "🔓 Buka Sesi Pemilihan";
    btnToggleVoting.className = "btn-modern btn-primary-gradient";
  }
}

async function toggleVotingSession() {
  try {
    const newState = !isVotingOpen;
    await db.collection(DB_SETTINGS).doc("voting_control").set({
      isOpen: newState,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    alert(`Sesi pemilihan sekarang: ${newState ? "DIBUKA" : "DITUTUP"}`);
  } catch (err) {
    alert("Gagal mengubah status: " + err.message);
  }
}

// Inisialisasi Database: Paslon 1 (Yudistira & Maskhidir) dan Paslon 2 (Mirza & Salman) + 26 Siswa
async function initializeDefaultDatabase() {
  const confirmInit = confirm(
    "Inisialisasi database akan membuat/memperbarui data Paslon 1 (Yudistira & Maskhidir), Paslon 2 (Mirza & Salman) dan 26 Siswa XI RPL 1.\nLanjutkan?"
  );
  if (!confirmInit) return;

  btnInitDatabase.disabled = true;
  btnInitDatabase.textContent = "Menginisialisasi...";

  try {
    const batch = db.batch();

    // 1. Data Paslon 1 (Yudistira & Maskhidir)
    const paslon1Ref = db.collection(DB_CANDIDATES).doc("paslon-1");
    batch.set(paslon1Ref, {
      number: 1,
      leader: "Yudistira",
      coLeader: "Maskhidir",
      votes: 0
    }, { merge: true });

    // Data Paslon 2 (Mirza & Salman)
    const paslon2Ref = db.collection(DB_CANDIDATES).doc("paslon-2");
    batch.set(paslon2Ref, {
      number: 2,
      leader: "Mirza",
      coLeader: "Salman",
      votes: 0
    }, { merge: true });

    // 2. Data 26 Siswa XI RPL 1
    for (let i = 1; i <= 26; i++) {
      const absenStr = i < 10 ? `0${i}` : `${i}`;
      const voterRef = db.collection(DB_VOTERS).doc(absenStr);
      batch.set(voterRef, {
        absen: absenStr,
        pin: `11${absenStr}`,
        hasVoted: false,
        votedAt: null
      }, { merge: true });
    }

    // 3. Settings Default
    const settingsRef = db.collection(DB_SETTINGS).doc("voting_control");
    batch.set(settingsRef, {
      isOpen: true
    }, { merge: true });

    await batch.commit();
    alert("✅ Inisialisasi Database Berhasil! Data XI RPL 1 (Yudistira & Maskhidir vs Mirza & Salman) siap di Firebase.");
  } catch (err) {
    console.error(err);
    alert("Gagal inisialisasi: " + err.message);
  } finally {
    btnInitDatabase.disabled = false;
    btnInitDatabase.textContent = "🔄 Inisialisasi Database (26 Siswa)";
  }
}

async function resetAllVotes() {
  const confirmReset = confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin mereset seluruh suara kembali ke 0 dan mereset status 26 siswa menjadi BELUM MEMILIH?");
  if (!confirmReset) return;

  btnResetVotes.disabled = true;
  btnResetVotes.textContent = "Mereset...";

  try {
    const batch = db.batch();

    batch.update(db.collection(DB_CANDIDATES).doc("paslon-1"), { votes: 0 });
    batch.update(db.collection(DB_CANDIDATES).doc("paslon-2"), { votes: 0 });

    for (let i = 1; i <= 26; i++) {
      const absenStr = i < 10 ? `0${i}` : `${i}`;
      const voterRef = db.collection(DB_VOTERS).doc(absenStr);
      batch.update(voterRef, {
        hasVoted: false,
        votedAt: null
      });
    }

    await batch.commit();
    localStorage.removeItem("hasVoted");
    alert("✅ Seluruh suara dan status pemilih berhasil di-reset ke 0!");
  } catch (err) {
    alert("Gagal reset suara: " + err.message);
  } finally {
    btnResetVotes.disabled = false;
    btnResetVotes.textContent = "⚠️ Reset Suara ke 0";
  }
}
