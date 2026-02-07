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

const JUMLAH_LATIHAN = 50;

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

  hideAll();
  document.getElementById("quizPage").classList.remove("hidden");

  index = 0;
  waktu = 120 * 60;

  acakSoal();
  tampilSoal();
  timerStart();
}

// ===============================
// ACAK SOAL
// ===============================
function acakSoal(){

  let temp = [...bankSoal];
  temp.sort(() => Math.random() - 0.5);

  let jumlah = mode === "latihan"
    ? Math.min(JUMLAH_LATIHAN, temp.length)
    : Math.min(120, temp.length);

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

  hideAll();

  const i = Math.floor(Math.random()*daftarKasus.length);
  kasusAktif = daftarKasus[i];

  document.getElementById("judulKasus").innerText = kasusAktif.judul;
  document.getElementById("deskripsiKasus").innerText = kasusAktif.deskripsi;

  document.querySelectorAll(".caseInput").forEach(t=>t.value="");
  document.querySelectorAll(".wordCount").forEach(w=>{
    w.innerText="0 / 150 kata";
    w.className="wordCount bad";
  });

  document.getElementById("casePage").classList.remove("hidden");
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

  let lulus=true;

  document.querySelectorAll(".caseBox").forEach(box=>{
    const t=box.querySelector(".caseInput").value.trim();
    const j=t?t.split(/\s+/).length:0;
    if(j<150) lulus=false;
  });

  if(!lulus){
    alert("Semua kotak wajib minimal 150 kata!");
    return;
  }

  hideAll();
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("statusKelulusan").innerText =
    "LULUS (Studi Kasus)";
}



