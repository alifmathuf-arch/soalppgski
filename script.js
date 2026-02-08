let bankSoal=[];
let soalUjian=[];
let jawaban=[];

let peserta="", kelasPeserta="", mapelAktif="";

let index=0;
let waktu=120*60;
let timer;

const JUMLAH_SOAL=50;

// LOAD JSON
fetch("soal.json")
.then(r=>r.json())
.then(d=>bankSoal=d);

// --------------------
function hideAll(){
 ["loginPage","mapelPage","menuPage","quizPage","resultPG"]
 .forEach(id=>document.getElementById(id)?.classList.add("hidden"));
}

// --------------------
function login(){

 peserta=document.getElementById("nama").value.trim();
 kelasPeserta=document.getElementById("kelasPeserta").value.trim();

 if(!peserta||!kelasPeserta){
  alert("Lengkapi data!");
  return;
 }

 hideAll();
 document.getElementById("mapelPage").classList.remove("hidden");
}

// --------------------
function konfirmasiMapel(){

 mapelAktif=document.getElementById("mapelSelect").value;

 if(!mapelAktif){
  alert("Pilih mapel!");
  return;
 }

 hideAll();
 document.getElementById("menuPage").classList.remove("hidden");
}

// --------------------
function masukPG(){

 let filtered=bankSoal.filter(s=>s.kelas===mapelAktif);

 if(filtered.length===0){
  alert("Soal mapel ini belum ada!");
  return;
 }

 soalUjian=[...filtered]
  .sort(()=>Math.random()-.5)
  .slice(0,JUMLAH_SOAL);

 jawaban=new Array(soalUjian.length).fill(null);

 index=0;
 waktu=120*60;

 hideAll();
 document.getElementById("quizPage").classList.remove("hidden");

 tampilSoal();
 startTimer();
}

// --------------------
function tampilSoal(){

 let s=soalUjian[index];
 if(!s)return;

 document.getElementById("nomor").innerText=
  `Soal ${index+1}/${soalUjian.length}`;

 document.getElementById("soal").innerText=s.q;

 let huruf=["A","B","C","D","E"];
 let html="";

 s.o.forEach((o,i)=>{
  let sel=jawaban[index]===i?"selected":"";
  html+=`<div class="opsi ${sel}" onclick="pilihJawaban(${i})">
  <b>${huruf[i]}</b>. ${o}</div>`;
 });

 document.getElementById("opsi").innerHTML=html;

 let p=(index+1)/soalUjian.length*100;
 document.getElementById("progressBar").style.width=p+"%";
 document.getElementById("progressPercent").innerText=Math.round(p)+"%";

 document.querySelector(".finishBtn").style.display=
  index===soalUjian.length-1?"block":"none";
}

// --------------------
function pilihJawaban(i){
 jawaban[index]=i;
 tampilSoal();
}

// --------------------
function nextSoal(){if(index<soalUjian.length-1){index++;tampilSoal();}}
function prevSoal(){if(index>0){index--;tampilSoal();}}

// --------------------
function startTimer(){

 clearInterval(timer);

 timer=setInterval(()=>{

  waktu--;

  let m=Math.floor(waktu/60);
  let s=waktu%60;

  document.getElementById("timer").innerText=
   `${m}:${s<10?"0":""}${s}`;

  if(waktu<=0){
   clearInterval(timer);
   selesaiPG();
  }

 },1000);
}

// --------------------
function selesaiPG(){

 if(!confirm("Yakin mengakhiri ujian?")) return;

 clearInterval(timer);

 let skor=0;
 soalUjian.forEach((s,i)=>{
  if(jawaban[i]===s.a) skor+=2;
 });

 hideAll();
 document.getElementById("resultPG").classList.remove("hidden");

 document.getElementById("pgNama").innerText=peserta;
 document.getElementById("pgKelas").innerText=kelasPeserta;
 document.getElementById("pgMapel").innerText=mapelAktif;
 document.getElementById("pgSkor").innerText=skor;
}
