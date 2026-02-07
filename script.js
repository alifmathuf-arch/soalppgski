let soalAll = [];
let soalUjian = [];
let jawaban = [];
let peserta = "", kelas = "", mode = "latihan";
let index = 0;
let waktu = 10 * 60;
let timer;
let skor = 0;
let benar = 0;

// LOAD SOAL
fetch("soal.json")
  .then(r => r.json())
  .then(d => soalAll = d)
  .catch(() => alert("Soal gagal dimuat"));

// MODE SELECT
function setMode(m){
  mode = m;
  document.getElementById("btnLatihan").classList.remove("active");
  document.getElementById("btnUjian").classList.remove("active");
  document.getElementById(m === "latihan" ? "btnLatihan" : "btnUjian")
    .classList.add("active");
}

// MULAI
function mulaiUjian(){
  let nama = document.getElementById("nama").value.trim();
  let kelasInput = document.getElementById("kelas").value.trim();

  if(!nama || !kelasInput){
    alert("Isi nama & kelas");
    return;
  }

  peserta = nama;
  kelas = kelasInput;

  if(mode === "latihan"){
    let temp = [...soalAll];
    temp.sort(() => Math.random() - 0.5);
    soalUjian = temp.slice(0, 10);
    waktu = 10 * 60;
  } else {
    document.documentElement.requestFullscreen();
    soalUjian = [...soalAll];
    waktu = 120 * 60;
  }

  jawaban = new Array(soalUjian.length).fill(null);
  index = 0;
  skor = 0;
  benar = 0;

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");

  tampil();
  timerStart();
  saveSession();
}

// TAMPIL SOAL
function tampil(){
  let s = soalUjian[index];
  document.getElementById("nomor").innerText =
    "Soal " + (index + 1) + " / " + soalUjian.length;
  document.getElementById("soal").innerText = s.q;

  let huruf = ["A","B","C","D","E"];
  let html = "";

  s.o.forEach((o,i)=>{
    let sel = jawaban[index] === i ? "selected" : "";
    html += `<div class="opsi ${sel}" onclick="pilih(${i})">
      <b>${huruf[i]}.</b> ${o}
    </div>`;
  });

  document.getElementById("opsi").innerHTML = html;
}

// PILIH JAWABAN
function pilih(i){
  jawaban[index] = i;
  saveSession();

  if(mode === "latihan"){
    alert(i === soalUjian[index].a ? "✔ Benar" : "✘ Salah");
  }

  tampil();
}

// NAVIGASI
function nextSoal(){
  if(index < soalUjian.length - 1) index++;
  tampil();
  saveSession();
}

function prevSoal(){
  if(index > 0) index--;
  tampil();
  saveSession();
}

// TIMER
function timerStart(){
  clearInterval(timer);
  timer = setInterval(()=>{
    waktu--;

    let m = Math.floor(waktu/60);
    let s = waktu%60;

    document.getElementById("timer").innerText =
      "Waktu: " + m + ":" + (s<10?"0":"") + s;

    if(waktu <= 0){
      clearInterval(timer);
      selesai();
    }
  },1000);
}

// SELESAI
function selesai(){
  clearInterval(timer);

  let salah = 0;
  let kosong = 0;

  soalUjian.forEach((s,i)=>{
    if(jawaban[i] === null) kosong++;
    else if(jawaban[i] === s.a){
      skor += 2;
      benar++;
    } else salah++;
  });

  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("pesertaNama").innerText = peserta;
  document.getElementById("pesertaKelas").innerText = kelas;
  document.getElementById("hasilSkor").innerText = skor;
  document.getElementById("hasilDetail").innerText = benar;
  document.getElementById("statusKelulusan").innerText =
    skor >= 80 ? "Lulus" : "Tidak Lulus";
}

// SAVE SESSION
function saveSession(){
  localStorage.setItem("cbtSession", JSON.stringify({
    peserta,
    kelas,
    mode,
    index,
    waktu,
    jawaban,
    soalUjian
  }));
}  tampil();

// NAV
function nextSoal(){ if(index<soalUjian.length-1)index++;
saveSession();
 } 
function prevSoal(){ if(index>0)index++;
saveSession();
; } 

// PROGRESS
function updateProgress(){
  let p=((index+1)/soalUjian.length)*100;
  document.getElementById("progressBar").style.width=p+"%";
}

// GRID
function updateGrid(){
  let html="";
  for(let i=0;i<soalUjian.length;i++){
    let cls="";

    if(i===index) cls="gridActive";
    else if(jawaban[i]!=null) cls="gridDone";
    else cls="gridEmpty";

    html+=`<div class="gridBtn ${cls}" onclick="lompat(${i})">${i+1}</div>`;
  }
  document.getElementById("gridSoal").innerHTML=html;
}


// TIMER
function timerStart(){
  clearInterval(timer);
  timer=setInterval(()=>{
    waktu--;
    let m=Math.floor(waktu/60);
    let s=waktu%60;
    document.getElementById("timer").innerText="Waktu: "+m+":"+(s<10?"0":"")+s;
    if(waktu<=0){ clearInterval(timer); selesai(); }
  },1000);
}

// SELESAI
function selesai(){
  clearInterval(timer);

  let salah=0;
let kosong=0;

soalUjian.forEach((s,i)=>{
 if(jawaban[i]===null) kosong++;
 else if(jawaban[i]===s.a){
   skor+=2; benar++;
 }else salah++;
});


  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("pesertaNama").innerText=peserta;
  document.getElementById("pesertaKelas").innerText=kelas;
  document.getElementById("hasilSkor").innerText=skor;
  document.getElementById("hasilDetail").innerText=benar;
  document.getElementById("statusKelulusan").innerText =
  (skor>=80) ? "Lulus" : "Tidak Lulus";

const frame = document.getElementById("resultFrame");
if(skor>=80){
  frame.classList.add("lulus");
  frame.classList.remove("gagal");
}else{
  frame.classList.add("gagal");
  frame.classList.remove("lulus");
}
}

function konfirmasiSelesai(){
  let belum = jawaban.filter(j => j === null).length;

  let msg = belum > 0
    ? `Masih ada ${belum} soal belum dijawab.\nYakin ingin mengakhiri?`
    : "Yakin ingin menyelesaikan ujian?";

  if(confirm(msg)){
    selesai();
  }
}

function saveSession(){
  localStorage.setItem("cbtSession", JSON.stringify({
    peserta,
    kelas,
    mode,
    index,
    waktu,
    jawaban,
    soalUjian
  }));
}

function drawChart(benar,salah,kosong){
 const c = document.getElementById("chart");
 const x = c.getContext("2d");

 let total = benar + salah + kosong;
 let data = [benar, salah, kosong];

 let start = 0;
 data.forEach(v=>{
   let slice = (v/total) * Math.PI * 2;
   x.beginPath();
   x.moveTo(150,100);
   x.arc(150,100,80,start,start+slice);
   x.fill();
   start += slice;
 });
}
  start+=slice;
 });
}

window.onload=()=>{
  let s=localStorage.getItem("cbtSession");
  if(s){
    if(confirm("Lanjutkan ujian sebelumnya?")){
      restoreSession(JSON.parse(s));
    }else{
      localStorage.removeItem("cbtSession");
    }
  }
};
    
function restoreSession(d){
  peserta=d.peserta;
  kelas=d.kelas;
  mode=d.mode;
  index=d.index;
  waktu=d.waktu;
  jawaban=d.jawaban;
  soalUjian=d.soalUjian;

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");

  tampil();
  timerStart();
}
document.addEventListener("visibilitychange",()=>{
  if(document.hidden && mode==="ujian"){
    alert("⚠ Jangan berpindah tab selama ujian!");
  }
});
document.getElementById("hasilSalah").innerText=salah;
document.getElementById("hasilKosong").innerText=kosong;

let persen=Math.round((skor/(soalUjian.length*2))*100);
document.getElementById("hasilPersen").innerText=persen;

document.getElementById("hasilWaktu").innerText=
 Math.floor(waktu/60)+":"+("0"+waktu%60).slice(-2);
}



