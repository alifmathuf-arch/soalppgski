let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let peserta = "", kelas = "", mode = "latihan";
let index = 0;

let waktu = 10 * 60; // 120 menit default
let timer;

// JUMLAH SOAL MODE LATIHAN
const JUMLAH_LATIHAN = 10;

// LOAD SOAL
fetch("soal.json")
  .then(r => r.json())
  .then(d => bankSoal = d)
  .catch(() => alert("Soal gagal dimuat"));

// SET MODE LATIHAN / UJIAN
function setMode(m) {
  mode = m;

  document.getElementById("btnLatihan").classList.remove("active");
  document.getElementById("btnUjian").classList.remove("active");

  if (m === "latihan") document.getElementById("btnLatihan").classList.add("active");
  else document.getElementById("btnUjian").classList.add("active");
}

// MULAI UJIAN
function mulaiUjian() {
  let nama = document.getElementById("nama").value.trim();
  let kelasInput = document.getElementById("kelas").value.trim();

  if (!nama || !kelasInput) {
    alert("Isi nama & kelas");
    return;
  }

  peserta = nama;
  kelas = kelasInput;

  acakSoal();
  index = 0;

  // waktu default bisa beda untuk mode ujian vs latihan
  waktu = 120 * 60;

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");

  tampilSoal();
  timerStart();
}

// ACAK SOAL SESUAI MODE
function acakSoal() {
  let temp = [...bankSoal];
  temp.sort(() => Math.random() - 0.5);

  let jumlah = mode === "latihan" ? Math.min(JUMLAH_LATIHAN, temp.length) : Math.min(120, temp.length);
  soalUjian = temp.slice(0, jumlah);
  jawaban = new Array(jumlah).fill(null);
}

// TAMPILKAN SOAL
function tampilSoal() {
  let s = soalUjian[index];

  document.getElementById("nomor").innerText =
    "Soal " + (index + 1) + " / " + soalUjian.length;

  document.getElementById("soal").innerText = s.q;

  let huruf = ["A", "B", "C", "D", "E"];
  let html = "";

  s.o.forEach((o, i) => {
    let sel = jawaban[index] === i ? "selected" : "";
    html += `
      <div class="opsi ${sel}" onclick="pilihJawaban(${i})">
        <b>${huruf[i]}.</b> ${o}
      </div>`;
  });

  document.getElementById("opsi").innerHTML = html;

  updateProgress();
  

  updateGrid();

  // tombol selesai hanya di soal terakhir
  document.querySelector(".finishBtn").style.display =
    (index === soalUjian.length - 1) ? "block" : "none";
}

// PILIH JAWABAN
function pilihJawaban(i) {
  jawaban[index] = i;

  // untuk mode latihan langsung kasih alert
  if (mode === "latihan") {
    alert(i === soalUjian[index].a ? "✔ Benar" : "✘ Salah");
  }

  tampilSoal();
}

// NAVIGASI
function nextSoal() { if (index < soalUjian.length - 1) { index++; tampilSoal(); } }
function prevSoal() { if (index > 0) { index--; tampilSoal(); } }

// PROGRESS BAR
function updateProgress() {
  let p = ((index + 1) / soalUjian.length) * 100;
  document.getElementById("progressBar").style.width = p + "%";
}

// GRID SOAL
function updateGrid() {
  let html = "";
  for (let i = 0; i < soalUjian.length; i++) {
    let done = jawaban[i] != null ? "gridDone" : "";
    html += `<div class="gridBtn ${done}" onclick="lompatSoal(${i})">${i + 1}</div>`;
  }
  document.getElementById("gridSoal").innerHTML = html;
}

function lompatSoal(i) {
  index = i;
  tampilSoal();
}

// TIMER
function timerStart() {
  clearInterval(timer);
  timer = setInterval(() => {
    waktu--;
    let m = Math.floor(waktu / 60);
    let s = waktu % 60;
    document.getElementById("timer").innerText =
      "Waktu: " + m + ":" + (s < 10 ? "0" : "") + s;

    if (waktu <= 0) {
      clearInterval(timer);
      selesai();
    }
  }, 1000);
}

// SELESAI
function selesai() {
  clearInterval(timer);

  let skor = 0;
  let benar = 0;

  soalUjian.forEach((s, i) => {
    if (jawaban[i] === s.a) {
      skor += 2;
      benar++;
    }
  });

  // sembunyikan quiz
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  // tampilkan info peserta
  document.getElementById("pesertaNama").innerText = peserta;
  document.getElementById("pesertaKelas").innerText = kelas;

  // skor & jawaban benar
  document.getElementById("hasilSkor").innerText = skor;
  document.getElementById("hasilDetail").innerText =
    `Jawaban benar: ${benar} dari ${soalUjian.length} soal`;

  // lulus / gagal
  const resultFrame = document.getElementById("resultFrame");
  if (skor >= 80) {
    resultFrame.classList.add("lulus");
    resultFrame.classList.remove("gagal");
  } else {
    resultFrame.classList.add("gagal");
    resultFrame.classList.remove("lulus");
  }
}
const daftarKasus = [
  {
    judul: "Studi Kasus: Media Pembelajaran",
    deskripsi:
      "Ceritakan pengalaman nyata Anda dalam menggunakan atau mengembangkan media pembelajaran di kelas."
  },
  {
    judul: "Studi Kasus: LKPD",
    deskripsi:
      "Ceritakan pengalaman nyata Anda dalam merancang atau menggunakan LKPD untuk membantu proses belajar siswa."
  },
  {
    judul: "Studi Kasus: Strategi Pembelajaran",
    deskripsi:
      "Ceritakan pengalaman nyata Anda dalam menerapkan strategi pembelajaran untuk mengatasi masalah di kelas."
  },
  {
    judul: "Studi Kasus: Penilaian / Asesmen",
    deskripsi:
      "Ceritakan pengalaman nyata Anda dalam melakukan penilaian atau asesmen untuk meningkatkan pembelajaran."
  }
];

let kasusAktif = null;

function masukKasus(){
  // sembunyikan halaman lain
  document.getElementById("menuPage").classList.add("hidden");
  document.getElementById("quizPage").classList.add("hidden");

  const index = Math.floor(Math.random() * daftarKasus.length);
  kasusAktif = daftarKasus[index];

  document.getElementById("judulKasus").innerText = kasusAktif.judul;
  document.getElementById("deskripsiKasus").innerText = kasusAktif.deskripsi;

  // reset semua textarea
  document.querySelectorAll(".caseInput").forEach(t=>{
    t.value = "";
  });

  document.querySelectorAll(".wordCount").forEach(w=>{
    w.innerText = "0 / 150 kata";
    w.className = "wordCount bad";
  });

  document.getElementById("casePage").classList.remove("hidden");
}
function hitungKataKasus(){
  document.querySelectorAll(".caseBox").forEach(box=>{
    const textarea = box.querySelector(".caseInput");
    const counter = box.querySelector(".wordCount");

    const teks = textarea.value.trim();
    const jumlah = teks ? teks.split(/\s+/).length : 0;

    const min = 150;

    counter.innerText = `${jumlah} / ${min} kata`;

    if(jumlah >= min){
      counter.classList.remove("bad");
      counter.classList.add("good");
    } else {
      counter.classList.remove("good");
      counter.classList.add("bad");
    }
  });
}
function selesaiKasus(){
  let lulus = true;

  document.querySelectorAll(".caseBox").forEach(box=>{
    const textarea = box.querySelector(".caseInput");
    const teks = textarea.value.trim();
    const jumlah = teks ? teks.split(/\s+/).length : 0;

    if(jumlah < 150){
      lulus = false;
    }
  });

  if(!lulus){
    alert("Semua kotak harus minimal 150 kata!");
    return;
  }

  // kalau lolos
  document.getElementById("casePage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("statusKelulusan").innerText =
    "LULUS (Studi Kasus)";
}
function login(){

  const nama = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();

  if(!nama || !kelas){
    alert("Nama dan kelas wajib diisi!");
    return;
  }

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("menuPage").classList.remove("hidden");

}function masukPG(){
  document.getElementById("menuPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");

  mulaiTimer();
  loadSoal();
}
function masukKasus(){
  document.getElementById("menuPage").classList.add("hidden");

  const index = Math.floor(Math.random() * daftarKasus.length);
  kasusAktif = daftarKasus[index];

  document.getElementById("judulKasus").innerText = kasusAktif.judul;
  document.getElementById("deskripsiKasus").innerText = kasusAktif.deskripsi;

  document.getElementById("casePage").classList.remove("hidden");
}


