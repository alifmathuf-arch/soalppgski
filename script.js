// ================= GLOBAL =================

let peserta="",kelas="";
let bankSoal=[],soalUjian=[],jawaban=[];
let index=0,waktu=120*60,timer;

const JUMLAH_SOAL=50;

// ================= LOAD =================

fetch("soal.json").then(r=>r.json()).then(d=>bankSoal=d);

document.addEventListener("DOMContentLoaded",()=>{
  restoreState();
});

// ================= PAGE =================

function show(id){
document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
}

// ================= LOGIN =================

function login(){
peserta=nama.value.trim();
kelas=kelas.value.trim();
if(!peserta||!kelas) return alert("Lengkapi data");

localStorage.setItem("user",JSON.stringify({peserta,kelas}));
show("menuPage");
}

// ================= PG =================

function masukPG(){
acakSoal();
index=0;
jawaban=[];
show("quizPage");
timerStart();
tampilSoal();
saveState("pg");
}

function confirmSelesaiPG(){
if(confirm("Yakin menyelesaikan PG?")) selesaiPG();
}

function selesaiPG(){

clearInterval(timer);

let skor=0;
soalUjian.forEach((s,i)=>{if(jawaban[i]===s.a)skor+=2});

saveLeaderboard(skor);

pgNama.innerText=peserta;
pgKelas.innerText=kelas;
pgSkor.innerText=skor;
pgStatus.innerText=skor>=80?"LULUS":"TIDAK LULUS";

localStorage.removeItem("state");

show("resultPG");
}

// ================= PDF =================

function exportPDFPG(){
const {jsPDF}=window.jspdf;
let pdf=new jsPDF();
pdf.text(`Nama:${peserta}`,10,10);
pdf.text(`Skor:${pgSkor.innerText}`,10,20);
pdf.save("hasil_pg.pdf");
}

// ================= LEADERBOARD =================

function saveLeaderboard(score){
let data=JSON.parse(localStorage.getItem("leaderboard")||"[]");
data.push({peserta,kelas,score});
data.sort((a,b)=>b.score-a.score);
localStorage.setItem("leaderboard",JSON.stringify(data));
}

function showLeaderboard(){
let data=JSON.parse(localStorage.getItem("leaderboard")||"[]");
leaderboardList.innerHTML="";
data.forEach((d,i)=>{
leaderboardList.innerHTML+=`<div>${i+1}. ${d.peserta} (${d.score})</div>`;
});
show("leaderboardPage");
}

// ================= STATE =================

function saveState(mode){
localStorage.setItem("state",JSON.stringify({
mode,index,jawaban,waktu,soalUjian
}));
}

function restoreState(){
let s=JSON.parse(localStorage.getItem("state"));
let u=JSON.parse(localStorage.getItem("user"));

if(u){peserta=u.peserta;kelas=u.kelas}

if(!s){show("loginPage");return;}

Object.assign(window,s);

show("quizPage");
timerStart();
tampilSoal();
}

// ================= MENU =================

function kembaliMenu(){
show("menuPage");
}
