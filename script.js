let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let peserta = "", kelas = "", mode = "latihan";
let index = 0;

let waktu = 120 * 60; // 120 menit default
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

// TOGGLE MODE SIANG / MALAM
function toggleMode() {
  const body = document.body;
  const chk = document.getElementById("toggleMode");
  if(chk.checked){
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
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

  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("pesertaNama").innerText = peserta;
  document.getElementById("pesertaKelas").innerText = kelas;

  document.getElementById("hasilSkor").innerText = skor;
  document.getElementById("hasilDetail").innerText = benar; // angka saja

  // status kelulusan
  const resultFrame = document.getElementById("resultFrame");
  const status = skor >= 80 ? "LULUS" : "TIDAK LULUS";
  document.getElementById("statusKelulusan").innerText = status;

  if (skor >= 80) {
    resultFrame.classList.add("lulus");
    resultFrame.classList.remove("gagal");
  } else {
    resultFrame.classList.add("gagal");
    resultFrame.classList.remove("lulus");
  }
}
