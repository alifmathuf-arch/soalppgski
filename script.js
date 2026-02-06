let peserta="";
let soalUjian=[];
let jawaban=[];
let index=0;
let waktu=50*60;

function mulaiUjian(){
peserta=document.getElementById("nama").value;
if(!peserta) return alert("Isi nama dulu!");

acakSoal();

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("quizPage").classList.remove("hidden");

tampilkanSoal();
timer();
}

function acakSoal(){
let temp=[...bankSoal];
temp.sort(()=>Math.random()-0.5);
soalUjian=temp.slice(0,50);
jawaban=new Array(50).fill(null);
}

function tampilkanSoal(){
let s=soalUjian[index];
document.getElementById("nomor").innerText=`Soal ${index+1}/50`;
document.getElementById("soal").innerText=s.q;

let opsiHTML="";
s.o.forEach((o,i)=>{
opsiHTML+=`
<div class="opsi ${jawaban[index]==i?"selected":""}"
onclick="pilih(${i})">${o}</div>`;
});

document.getElementById("opsi").innerHTML=opsiHTML;
}

function pilih(i){
jawaban[index]=i;
tampilkanSoal();
}

function nextSoal(){
if(index<49){index++; tampilkanSoal();}
}

function prevSoal(){
if(index>0){index--; tampilkanSoal();}
}

function timer(){
let t=setInterval(()=>{
waktu--;
let m=Math.floor(waktu/60);
let s=waktu%60;
document.getElementById("timer").innerText=
`Waktu: ${m}:${s<10?"0"+s:s}`;

if(waktu<=0){
clearInterval(t);
selesai();
}
},1000);
}

function selesai(){
let skor=0;
soalUjian.forEach((s,i)=>{
if(jawaban[i]==s.a) skor++;
});

document.getElementById("quizPage").classList.add("hidden");
document.getElementById("resultPage").classList.remove("hidden");

document.getElementById("hasil").innerText=
`${peserta}, skor kamu: ${skor}/50`;
}
