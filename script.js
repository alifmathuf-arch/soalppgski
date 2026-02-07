let bankSoal=[];
let soalUjian=[];
let jawaban=[];

let peserta="",kelas="",mode="latihan";
let index=0;

let waktu=120*60;
let timer;


// LOAD SOAL
fetch("soal.json")
.then(r=>r.json())
.then(d=>bankSoal=d)
.catch(()=>alert("Soal gagal dimuat"));


// MODE SELECT
function setMode(m){

mode=m;

document.getElementById("btnLatihan").classList.remove("active");
document.getElementById("btnUjian").classList.remove("active");

if(m==="latihan")
document.getElementById("btnLatihan").classList.add("active");

else
document.getElementById("btnUjian").classList.add("active");

}


// MULAI
function mulaiUjian(){

let nama=document.getElementById("nama").value.trim();
let kelasInput=document.getElementById("kelas").value.trim();

if(!nama||!kelasInput){
alert("Isi nama & kelas");
return;
}

peserta=nama;
kelas=kelasInput;

acak();

index=0;
waktu=120*60;

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("quizPage").classList.remove("hidden");

tampil();
timerStart();

}


// ACAK
function acak(){

let temp=[...bankSoal];
temp.sort(()=>Math.random()-0.5);

let j=Math.min(120,temp.length);

soalUjian=temp.slice(0,j);
jawaban=new Array(j).fill(null);

}


// TAMPIL
function tampil(){

let s=soalUjian[index];

document.getElementById("nomor").innerText=
"Soal "+(index+1)+" / "+soalUjian.length;

document.getElementById("soal").innerText=s.q;

let huruf=["A","B","C","D","E"];
let html="";

s.o.forEach((o,i)=>{

let sel=jawaban[index]===i?"selected":"";

html+=`
<div class="opsi ${sel}" onclick="pilih(${i})">
<b>${huruf[i]}.</b> ${o}
</div>`;

});

document.getElementById("opsi").innerHTML=html;

updateProgress();
updateGrid();

document.querySelector(".finishBtn").style.display=
(index===soalUjian.length-1)?"block":"none";

}


// PILIH
function pilih(i){

jawaban[index]=i;

if(mode==="latihan"){
alert(i===soalUjian[index].a?"✔ Benar":"✘ Salah");
}

tampil();

}


// NAV
function nextSoal(){
if(index<soalUjian.length-1){index++;tampil();}
}

function prevSoal(){
if(index>0){index--;tampil();}
}


// PROGRESS
function updateProgress(){

let p=((index+1)/soalUjian.length)*100;
document.getElementById("progressBar").style.width=p+"%";

}


// GRID
function updateGrid(){

let html="";

for(let i=0;i<soalUjian.length;i++){

let done=jawaban[i]!=null?"gridDone":"";

html+=`<div class="gridBtn ${done}" onclick="lompat(${i})">
${i+1}
</div>`;

}

document.getElementById("gridSoal").innerHTML=html;

}

function lompat(i){
index=i;
tampil();
}


// TIMER
function timerStart(){

clearInterval(timer);

timer=setInterval(()=>{

waktu--;

let m=Math.floor(waktu/60);
let s=waktu%60;

document.getElementById("timer").innerText=
"Waktu: "+m+":"+(s<10?"0":"")+s;

if(waktu<=0){
clearInterval(timer);
selesai();
}

},1000);

}


// SELESAI
function selesai(){

  clearInterval(timerInterval);

  let skor = 0;
  let benar = 0;

  soalUjian.forEach((s,i)=>{
    if(jawaban[i] === s.a){
      skor += 2;  // nilai per soal
      benar++;
    }
  });

  // sembunyikan halaman quiz
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  // tampilkan nama & kelas
  document.getElementById("pesertaNama").innerText = peserta;
  document.getElementById("pesertaKelas").innerText = kelas;

  // tampilkan skor
  document.getElementById("hasilSkor").innerText = skor;

  // tentukan lulus atau gagal
  const resultFrame = document.getElementById("resultFrame");
  if(skor >= 80){
    resultFrame.classList.add("lulus");
    resultFrame.classList.remove("gagal");
  } else {
    resultFrame.classList.add("gagal");
    resultFrame.classList.remove("lulus");
  }
}
