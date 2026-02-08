// ================= GLOBAL =================

let peserta = "";
let kelasPeserta = "";

let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let index = 0;
let waktu = 120 * 60;
let timer = null;

const JUMLAH_SOAL = 50;

// ================= LOAD =================

fetch("soal.json")
  .then(r => r.json())
  .then(d => bankSoal = d)
  .catch(() => alert("Gagal load soal.json"));

document.addEventListener("DOMContentLoaded", () => {
  restoreState();
});

// ================= PAGE =================

function show(id) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.add("hidden")
  );

  document.getElementById(id)?.classList.remove("hidden");
}

// ================= LOGIN =================

function login() {

  const namaInput = document.getElementById("nama");
  const kelasInput = document.getElementById("kelas");

  peserta = namaInput.value.trim();
  kelasPeserta = kelasInput.value.trim();

  if (!peserta || !kelasPeserta) {
    alert("Lengkapi data!");
    return;
  }

  localStorage.setItem("user", JSON.stringify({
    peserta,
    kelas: kelasPeserta
  }));

  show("menuPage");
}

// ================= PG =================

function masukPG() {

  if (!bankSoal.length) {
    alert("Soal belum siap");
    return;
  }

  acakSoal();

  index = 0;
  jawaban = new Array(soalUjian.length).fill(null);

  show("quizPage");

  timerStart();
  tampilSoal();

  saveState("pg");
}

function confirmSelesaiPG() {
  if (confirm("Yakin menyelesaikan ujian PG?")) {
    selesaiPG();
  }
}

function selesaiPG() {

  clearInterval(timer);

  let skor = 0;

  soalUjian.forEach((s, i) => {
    if (jawaban[i] === s.a) skor += 2;
  });

  saveLeaderboard(skor);

  document.getElementById("pgNama").innerText = peserta;
  document.getElementById("pgKelas").innerText = kelasPeserta;
  document.getElementById("pgSkor").innerText = skor;
  document.getElementById("pgStatus").innerText =
    skor >= 80 ? "LULUS" : "TIDAK LULUS";

  localStorage.removeItem("state");

  show("resultPG");
}

// ================= PDF =================

function exportPDFPG() {

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  pdf.text(`Nama: ${peserta}`, 10, 15);
  pdf.text(`Kelas: ${kelasPeserta}`, 10, 25);
  pdf.text(`Skor: ${document.getElementById("pgSkor").innerText}`, 10, 35);

  pdf.save("hasil_pg.pdf");
}

// ================= LEADERBOARD =================

function saveLeaderboard(score) {

  let data = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  data.push({
    peserta,
    kelas: kelasPeserta,
    score
  });

  data.sort((a, b) => b.score - a.score);

  localStorage.setItem("leaderboard", JSON.stringify(data));
}

function showLeaderboard() {

  const list = document.getElementById("leaderboardList");

  let data = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  list.innerHTML = "";

  data.forEach((d, i) => {
    list.innerHTML += `<div>${i + 1}. ${d.peserta} (${d.score})</div>`;
  });

  show("leaderboardPage");
}

// ================= STATE =================

function saveState(mode) {

  localStorage.setItem("state", JSON.stringify({
    mode,
    index,
    jawaban,
    waktu,
    soalUjian,
    peserta,
    kelasPeserta
  }));
}

function restoreState() {

  const state = JSON.parse(localStorage.getItem("state"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    peserta = user.peserta;
    kelasPeserta = user.kelas;
  }

  if (!state) {
    show("loginPage");
    return;
  }

  index = state.index;
  jawaban = state.jawaban;
  waktu = state.waktu;
  soalUjian = state.soalUjian;

  peserta = state.peserta || peserta;
  kelasPeserta = state.kelasPeserta || kelasPeserta;

  show("quizPage");

  timerStart();
  tampilSoal();
}

// ================= MENU =================

function kembaliMenu() {
  show("menuPage");
}

// ================= TIMER =================

function timerStart() {

  clearInterval(timer);

  timer = setInterval(() => {

    waktu--;

    const m = Math.floor(waktu / 60);
    const s = waktu % 60;

    document.getElementById("timer").innerText =
      `Waktu: ${m}:${s < 10 ? "0" : ""}${s}`;

    saveState("pg");

    if (waktu <= 0) {
      clearInterval(timer);
      selesaiPG();
    }

  }, 1000);
}
