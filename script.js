// ===============================
// GLOBAL
// ===============================
let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let peserta = "";
let kelas = "";
let mode = "ujian";

let index = 0;
let waktu = 120 * 60;
let timer;


// ===============================
// LOAD SOAL
// ===============================
fetch("soal.json")
  .then(r => r.json())
  .then(d => bankSoal = d)
  .catch(() => alert("Soal gagal dimuat"));

document.addEventListener("DOMContentLoaded", () => {
  hideAll();
  document.getElementById("loginPage").classList.remove("hidden");
});

function hideAll(){
  ["loginPage","menuPage","quizPage","casePage","resultPage"]
    .forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.classList.add("hidden");
    });
}

// ===============================
// LOGIN
// ===============================
function login(){

  const namaVal = document.getElementById("nama").value.trim();
  const kelasVal = document.getElementById("kelas").value.trim();

  if(!namaVal || !kelasVal){
    alert("Nama dan kelas wajib diisi!");
    return;
  }

  peserta = namaVal;
  kelas = kelasVal;

  hideAll();
  document.getElementById("menuPage").classList.remove("hidden");
}

// ===============================
// MASUK PG
// ===============================
function masukPG(){

  mode = "ujian";

  document.getElementById("menuPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");

  acakSoal();
  index = 0;

  waktu = 120 * 60;

  tampilSoal();
  timerStart();
}



// ===============================
// ACAK SOAL
// ===============================
function acakSoal(){

  let temp = [...bankSoal];
  temp.sort(() => Math.random() - 0.5);


  soalUjian = temp.slice(0, jumlah);
  jawaban = new Array(jumlah).fill(null);
}

// ===============================
// TAMPILKAN SOAL
// ===============================
function tampilSoal(){

  const s = soalUjian[index];
  if(!s) return;

  document.getElementById("nomor").innerText =
    `Soal ${index+1} / ${soalUjian.length}`;

  document.getElementById("soal").innerText = s.q;

  const huruf = ["A","B","C","D","E"];
  let html = "";

  s.o.forEach((o,i)=>{
    let sel = jawaban[index] === i ? "selected" : "";
    html += `
      <div class="opsi ${sel}" onclick="pilihJawaban(${i})">
        <b>${huruf[i]}.</b> ${o}
      </div>`;
  });

  document.getElementById("opsi").innerHTML = html;

  updateProgress();
  updateGrid();

  document.querySelector(".finishBtn").style.display =
    index === soalUjian.length-1 ? "block" : "none";
}

// ===============================
// PILIH JAWABAN
// ===============================
function pilihJawaban(i){

  jawaban[index] = i;

  if(mode === "latihan"){
    alert(i === soalUjian[index].a ? "✔ Benar" : "✘ Salah");
  }

  tampilSoal();
}

// ===============================
// NAV
// ===============================
function nextSoal(){
  if(index < soalUjian.length-1){
    index++;
    tampilSoal();
  }
}

function prevSoal(){
  if(index > 0){
    index--;
    tampilSoal();
  }
}

// ===============================
// PROGRESS
// ===============================
function updateProgress(){

  let p = ((index+1)/soalUjian.length)*100;

  document.getElementById("progressBar").style.width = p+"%";
  document.getElementById("progressPercent").innerText =
    Math.round(p)+"%";
}

// ===============================
// GRID
// ===============================
function updateGrid(){

  let html = "";

  for(let i=0;i<soalUjian.length;i++){
    let done = jawaban[i]!=null ? "gridDone" : "";
    html += `<div class="gridBtn ${done}"
      onclick="lompatSoal(${i})">${i+1}</div>`;
  }

  document.getElementById("gridSoal").innerHTML = html;
}

function lompatSoal(i){
  index=i;
  tampilSoal();
}

// ===============================
// TIMER
// ===============================
function timerStart(){

  clearInterval(timer);

  timer = setInterval(()=>{

    waktu--;

    let m = Math.floor(waktu/60);
    let s = waktu%60;

    document.getElementById("timer").innerText =
      `Waktu: ${m}:${s<10?"0"+s:s}`;

    if(waktu<=0){
      clearInterval(timer);
      selesai();
    }

  },1000);
}

// ===============================
// SELESAI PG
// ===============================
function selesai(){

  clearInterval(timer);

  let skor=0, benar=0;

  soalUjian.forEach((s,i)=>{
    if(jawaban[i]===s.a){
      skor+=2;
      benar++;
    }
  });

  hideAll();
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("pesertaNama").innerText = peserta;
  document.getElementById("pesertaKelas").innerText = kelas;

  document.getElementById("hasilSkor").innerText = skor;
  document.getElementById("hasilDetail").innerText =
    `${benar} dari ${soalUjian.length}`;

  document.getElementById("statusKelulusan").innerText =
    skor>=80 ? "LULUS" : "TIDAK LULUS";
}

// ===============================
// STUDI KASUS
// ===============================
const daftarKasus = [
  {judul:"Media Pembelajaran",
   deskripsi:"Ceritakan pengalaman nyata Anda dalam menggunakan media pembelajaran di kelas."},
  {judul:"LKPD",
   deskripsi:"Ceritakan pengalaman nyata Anda dalam merancang LKPD."},
  {judul:"Strategi Pembelajaran",
   deskripsi:"Ceritakan strategi yang pernah Anda terapkan."},
  {judul:"Penilaian",
   deskripsi:"Ceritakan pengalaman melakukan asesmen."}
];

let kasusAktif=null;

function masukKasus(){

  document.getElementById("menuPage").classList.add("hidden");
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.add("hidden");

  const index = Math.floor(Math.random() * daftarKasus.length);
  kasusAktif = daftarKasus[index];

  document.getElementById("judulKasus").innerText = kasusAktif.judul;
  document.getElementById("deskripsiKasus").innerText = kasusAktif.deskripsi;

  document.querySelectorAll(".caseInput").forEach(t=> t.value="");

  document.querySelectorAll(".wordCount").forEach(w=>{
    w.innerText="0 / 150 kata";
    w.className="wordCount bad";
  });

  document.getElementById("casePage").classList.remove("hidden");

  startTimerKasus(); // <<< INI
}


// hitung kata
function hitungKataKasus(){

  document.querySelectorAll(".caseBox").forEach(box=>{

    const ta = box.querySelector(".caseInput");
    const wc = box.querySelector(".wordCount");

    const teks = ta.value.trim();
    const jumlah = teks ? teks.split(/\s+/).length : 0;

    wc.innerText = `${jumlah} / 150 kata`;

    wc.className =
      jumlah>=150 ? "wordCount good" : "wordCount bad";

  });
}

function selesaiKasus(){

  clearInterval(timerKasus);

  let totalKata = 0;
  let totalChar = 0;

  document.querySelectorAll(".caseInput").forEach(t=>{

    const teks = t.value.trim();

    totalChar += teks.length;
    totalKata += teks ? teks.split(/\s+/).length : 0;

  });

  if(totalKata < 600){
    alert("Semua kolom harus diisi minimal 150 kata!");
    return;
  }

  document.getElementById("casePage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("totalKata").innerText = totalKata;
  document.getElementById("totalChar").innerText = totalChar;

  document.getElementById("statusKelulusan").innerText =
    "SELESAI (Studi Kasus)";
}


function toggleCase(step){

  document.querySelectorAll(".caseBox").forEach(box=>{

    if(box.dataset.step == step){
      box.classList.toggle("active");
    } else {
      box.classList.remove("active");
    }

  });
}

function toggleCase(el){

  const box = el.closest(".caseBox");

  // tutup semua dulu
  document.querySelectorAll(".caseBox").forEach(b=>{
    if(b !== box){
      b.classList.remove("active");
    }
  });

  // toggle current
  box.classList.toggle("active");
}

// =======================
// TIMER STUDI KASUS
// =======================

let waktuKasus = 30 * 60;
let timerKasus;

function startTimerKasus(){

  clearInterval(timerKasus);
  waktuKasus = 30 * 60;

  updateTimerKasus();

  timerKasus = setInterval(()=>{

    waktuKasus--;

    updateTimerKasus();

    if(waktuKasus <= 0){
      clearInterval(timerKasus);
      alert("Waktu studi kasus habis!");
      selesaiKasus();
    }

  },1000);
}

function updateTimerKasus(){
  let m = Math.floor(waktuKasus / 60);
  let s = waktuKasus % 60;

  document.getElementById("caseTimer").innerText =
    `⏳ ${m}:${s < 10 ? "0" : ""}${s}`;
}


