// Logika Client-Side untuk Halaman Pemilihan (index.html)

let selectedCandidateId = null;
let isVotingOpen = true;

// DOM Elements
const voteModal = document.getElementById("vote-modal");
const voteForm = document.getElementById("vote-form");
const inputAbsen = document.getElementById("input-absen");
const inputPin = document.getElementById("input-pin");
const modalSubtitle = document.getElementById("modal-subtitle");
const modalError = document.getElementById("modal-error");
const btnCancelVote = document.getElementById("btn-cancel-vote");
const btnSubmitVote = document.getElementById("btn-submit-vote");
const statusBadge = document.getElementById("voting-status-badge");
const statVotedCount = document.getElementById("stat-voted-count");
const statPercentage = document.getElementById("stat-percentage");
const votedAlert = document.getElementById("voted-alert");

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  listenToSystemSettings();
  listenToVoterStats();
  checkLocalVotingStatus();
});

function setupEventListeners() {
  const voteButtons = document.querySelectorAll(".btn-vote");
  voteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!isVotingOpen) {
        alert("Sesi pemilihan saat ini sedang DITUTUP oleh admin.");
        return;
      }
      
      selectedCandidateId = btn.getAttribute("data-candidate-id");
      const candNum = btn.getAttribute("data-candidate-num");
      const candName = btn.getAttribute("data-candidate-name") || `Paslon ${candNum}`;
      
      modalSubtitle.textContent = `Anda akan memberikan suara untuk Paslon ${candNum} (${candName})`;
      
      inputAbsen.value = "";
      inputPin.value = "";
      hideModalError();
      openModal();
    });
  });

  btnCancelVote.addEventListener("click", closeModal);
  voteForm.addEventListener("submit", handleVoteSubmit);
}

function openModal() {
  voteModal.classList.add("active");
  inputAbsen.focus();
}

function closeModal() {
  voteModal.classList.remove("active");
  hideModalError();
}

function showModalError(msg) {
  modalError.textContent = msg;
  modalError.style.display = "block";
}

function hideModalError() {
  modalError.style.display = "none";
  modalError.textContent = "";
}

function formatAbsen(val) {
  let num = parseInt(val, 10);
  if (isNaN(num)) return "";
  return num < 10 ? `0${num}` : `${num}`;
}

async function handleVoteSubmit(e) {
  e.preventDefault();
  hideModalError();

  const rawAbsen = inputAbsen.value.trim();
  const absen = formatAbsen(rawAbsen);
  const pin = inputPin.value.trim();

  const absenNum = parseInt(absen, 10);
  if (isNaN(absenNum) || absenNum < 1 || absenNum > 26) {
    showModalError("Nomor absen harus antara 01 sampai 26!");
    return;
  }

  const expectedPin = `11${absen}`;
  if (pin !== expectedPin) {
    showModalError(`PIN salah! Untuk Absen ${absen}, PIN Anda adalah ${expectedPin}`);
    return;
  }

  btnSubmitVote.disabled = true;
  btnSubmitVote.textContent = "Memverifikasi...";

  try {
    const voterRef = db.collection(DB_VOTERS).doc(absen);
    const voterDoc = await voterRef.get();

    if (!voterDoc.exists) {
      showModalError(`Data voter untuk Absen ${absen} belum diinisialisasi oleh admin.`);
      btnSubmitVote.disabled = false;
      btnSubmitVote.textContent = "Kirim Suara";
      return;
    }

    const voterData = voterDoc.data();
    if (voterData.hasVoted) {
      showModalError(`Nomor Absen ${absen} SUDAH menggunakan hak suaranya!`);
      btnSubmitVote.disabled = false;
      btnSubmitVote.textContent = "Kirim Suara";
      return;
    }

    const candidateRef = db.collection(DB_CANDIDATES).doc(selectedCandidateId);

    await db.runTransaction(async (transaction) => {
      const vDoc = await transaction.get(voterRef);
      if (vDoc.data().hasVoted) {
        throw new Error("Nomor absen ini baru saja digunakan untuk memilih!");
      }

      transaction.update(candidateRef, {
        votes: firebase.firestore.FieldValue.increment(1)
      });

      transaction.update(voterRef, {
        hasVoted: true,
        votedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    localStorage.setItem("hasVoted", absen);
    closeModal();
    checkLocalVotingStatus();
    alert(`🎉 Selamat! Suara Anda dari Absen ${absen} berhasil masuk dan tercatat.`);

    // Arahkan otomatis ke halaman hasil suara
    setTimeout(() => {
      window.location.href = "hasil.html";
    }, 1000);

  } catch (error) {
    console.error("Gagal melakukan vote:", error);
    showModalError(error.message || "Terjadi kendala saat mengirim suara. Periksa koneksi.");
  } finally {
    btnSubmitVote.disabled = false;
    btnSubmitVote.textContent = "Kirim Suara";
  }
}

function listenToSystemSettings() {
  db.collection(DB_SETTINGS).doc("voting_control").onSnapshot((doc) => {
    if (doc.exists) {
      isVotingOpen = doc.data().isOpen !== false;
      statusBadge.textContent = isVotingOpen ? "Sesi Pemilihan Dibuka" : "Sesi Pemilihan Ditutup";
    }
  }, (err) => {
    console.warn("Settings error:", err);
  });
}

function listenToVoterStats() {
  db.collection(DB_VOTERS).onSnapshot((snapshot) => {
    let votedCount = 0;
    const totalVoters = 26;

    snapshot.forEach((doc) => {
      if (doc.data().hasVoted) votedCount++;
    });

    statVotedCount.textContent = `${votedCount} / ${totalVoters}`;
    const pct = Math.round((votedCount / totalVoters) * 100);
    statPercentage.textContent = `${pct}%`;
  }, (err) => {
    console.warn("Stats error:", err);
  });
}

function checkLocalVotingStatus() {
  const localVoted = localStorage.getItem("hasVoted");
  if (localVoted) {
    votedAlert.style.display = "block";
    votedAlert.innerHTML = `🎉 <strong>Terima Kasih!</strong> Nomor Absen <strong>${localVoted}</strong> telah tercatat menggunakan hak suara. <a href="hasil.html" style="color:var(--primary); font-weight:700; text-decoration:underline; margin-left:8px;">Lihat Hasil Akhir &rarr;</a>`;
  }
}
