// ===============================
// GLOBAL
// ===============================

let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let peserta = "";
let kelas = "";

let index = 0;
let waktu = 120 * 60;
let timer;

const JUMLAH_SOAL = 50;

// ===============================
// LOAD SOAL
// ===============================

fetch("soal.json")
  .then(r => r.json())
  .then(d => bankSoal = d)
  .catch(() => alert("Soal gagal dimuat"));

document.addEventListener("DOMContentLoaded", () => {
  hideAll();
  document.getElementById("loginPage")?.classList.remove("hidden");
});

function hideAll(){
  [
    "loginPage",
    "menuPage",
    "quizPage",
    "casePage",
    "resultPG",
    "resultKasus"
  ].forEach(id=>{
    document.getElementById(id)?.classList.add("hidden");
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

  if(bankSoal.length === 0){
    alert("Soal belum siap.");
    return;
  }

  hideAll();
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

  soalUjian = temp.slice(0, JUMLAH_SOAL);
  jawaban = new Array(soalUjian.length).fill(null);
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

  const btnFinish = document.querySelector(".finishBtn");

if(btnFinish){

  if(index === soalUjian.length - 1){
    btnFinish.style.display = "block";
    btnFinish.disabled = false;
  } else {
    btnFinish.style.display = "none";
    btnFinish.disabled = true;
  }

// ===============================
// PILIH JAWABAN
// ===============================

function pilihJawaban(i){
  jawaban[index] = i;
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
// TIMER PG
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
      selesaiPG();
    }

  },1000);
}

// ===============================
// SELESAI PG
// ===============================

function selesaiPG(){

  clearInterval(timer);

  let skor=0;

  soalUjian.forEach((s,i)=>{
    if(jawaban[i]===s.a){
      skor+=2;
    }
  });

  hideAll();
  document.getElementById("resultPG").classList.remove("hidden");

  document.getElementById("pgNama").innerText = peserta;
  document.getElementById("pgKelas").innerText = kelas;
  document.getElementById("pgSkor").innerText = skor;
  document.getElementById("pgStatus").innerText =
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

  hideAll();

  const idx = Math.floor(Math.random() * daftarKasus.length);
  kasusAktif = daftarKasus[idx];

  document.getElementById("judulKasus").innerText = kasusAktif.judul;
  document.getElementById("deskripsiKasus").innerText = kasusAktif.deskripsi;

  document.querySelectorAll(".caseInput").forEach(t=> t.value="");

  document.querySelectorAll(".wordCount").forEach(w=>{
    w.innerText="0 / 150 kata";
    w.className="wordCount bad";
  });

  document.getElementById("casePage").classList.remove("hidden");

  startTimerKasus();
}

// ===============================
// WORD COUNT
// ===============================

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

// ===============================
// SELESAI KASUS
// ===============================

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

  hideAll();
  document.getElementById("resultKasus").classList.remove("hidden");

  document.getElementById("totalKata").innerText = totalKata;
  document.getElementById("totalKarakter").innerText = totalChar;
  document.getElementById("statusKasus").innerText = "SELESAI";
}

// ===============================
// ACCORDION
// ===============================

function toggleCase(el){

  const box = el.closest(".caseBox");

  document.querySelectorAll(".caseBox").forEach(b=>{
    if(b !== box){
      b.classList.remove("active");
    }
  });

  box.classList.toggle("active");
}

// ===============================
// TIMER STUDI KASUS
// ===============================

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



