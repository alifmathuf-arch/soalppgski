let bankSoal=[];
let soalUjian=[];
let jawaban=[];

let peserta="",kelas="",mode="ujian";
let index=0;

let waktu=50*60;
let timer;


// LOAD SOAL

fetch("soal.json")
.then(r=>r.json())
.then(d=>bankSoal=d)
.catch(()=>alert("Soal gagal dimuat"));


// MULAI

function mulaiUjian(){

let nama=document.getElementById("nama");
let kelasInput=document.getElementById("kelas");
let modeInput=document.getElementById("mode");

if(!nama||!kelasInput||!modeInput)return;

peserta=nama.value.trim();
kelas=kelasInput.value.trim();
mode=modeInput.value;

if(!peserta||!kelas){
alert("Isi nama & kelas");
return;
}

acak();

index=0;
waktu=50*60;

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("quizPage").classList.remove("hidden");

tampil();
timerStart();

}


// ACAK SOAL

function acak(){

let temp=[...bankSoal];
temp.sort(()=>Math.random()-0.5);

let j=Math.min(50,temp.length);

soalUjian=temp.slice(0,j);
jawaban=new Array(j).fill(null);

}


// TAMPIL SOAL

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

html+=`<div class="gridBtn ${done}"
onclick="lompat(${i})">${i+1}</div>`;

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

clearInterval(timer);

let skor=0;

soalUjian.forEach((s,i)=>{
if(jawaban[i]===s.a) skor++;
});

document.getElementById("quizPage").classList.add("hidden");
document.getElementById("resultPage").classList.remove("hidden");

document.getElementById("hasil").innerText=
`${peserta} (${kelas})

Skor: ${skor}/${soalUjian.length}`;

saveRank(peserta,skor);
showRank();

}


// LEADERBOARD

function saveRank(n,s){

let data=JSON.parse(localStorage.getItem("rank")||"[]");

data.push({n,s});
data.sort((a,b)=>b.s-a.s);

data=data.slice(0,5);

localStorage.setItem("rank",JSON.stringify(data));

}

function showRank(){

let data=JSON.parse(localStorage.getItem("rank")||"[]");

let html="";

data.forEach((d,i)=>{
html+=`${i+1}. ${d.n} — ${d.s}<br>`;
});

document.getElementById("leaderboard").innerHTML=html;

}
