// ==========================
// GLOBAL
// ==========================

let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let peserta="";
let kelas="";
let index=0;

let waktu=50*60;
let timerInterval;


// ==========================
// LOAD JSON SOAL
// ==========================

fetch("soal.json")
.then(res => res.json())
.then(data => {

bankSoal = data;
console.log("Soal loaded:", bankSoal.length);

})
.catch(err => {

alert("Gagal memuat soal.json!");
console.error(err);

});


// ==========================
// MULAI UJIAN
// ==========================

function mulaiUjian(){

if(bankSoal.length === 0){
alert("Soal belum siap… tunggu sebentar");
return;
}

peserta=document.getElementById("nama").value.trim();
kelas=document.getElementById("kelas").value.trim();

if(!peserta || !kelas){
alert("Isi nama dan kelas!");
return;
}

acakSoal();

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("quizPage").classList.remove("hidden");

tampilkanSoal();
mulaiTimer();

}


// ==========================
// ACAK SOAL
// ==========================

function acakSoal(){

let temp=[...bankSoal];

temp.sort(()=>Math.random()-0.5);

let jumlah = Math.min(50, temp.length);

soalUjian = temp.slice(0, jumlah);
jawaban = new Array(jumlah).fill(null);


}


// ==========================
// TAMPIL SOAL
// ==========================

function tampilkanSoal(){

let s=soalUjian[index];

document.getElementById("nomor").innerText=
"Soal "+(index+1)+" / 50";

document.getElementById("soal").innerText=s.q;

let opsiHTML="";

s.o.forEach((opsi,i)=>{

let selected=jawaban[index]===i?"selected":"";

opsiHTML+=`
<div class="opsi ${selected}" onclick="pilih(${i})">
${opsi}
</div>`;

});

document.getElementById("opsi").innerHTML=opsiHTML;

let finishBtn=document.querySelector(".finishBtn");

finishBtn.style.display =
(index === soalUjian.length - 1) ? "block" : "none";


}


// ==========================
// PILIH JAWABAN
// ==========================

function pilih(i){

jawaban[index]=i;
tampilkanSoal();

}


// ==========================
// NAVIGASI
// ==========================

function nextSoal(){
if(index < soalUjian.length - 1)
{index++; tampilkanSoal();}
}

function prevSoal(){
if(index>0){index--; tampilkanSoal();}
}


// ==========================
// TIMER
// ==========================

function mulaiTimer(){

timerInterval=setInterval(()=>{

waktu--;

let m=Math.floor(waktu/60);
let s=waktu%60;

document.getElementById("timer").innerText=
"Waktu: "+m+":"+(s<10?"0":"")+s;

if(waktu<=0){
clearInterval(timerInterval);
selesai();
}

},1000);

}


// ==========================
// SELESAI
// ==========================

function selesai(){

clearInterval(timerInterval);

let skor=0;

soalUjian.forEach((s,i)=>{
if(jawaban[i]===s.a) skor++;
});

document.getElementById("quizPage").classList.add("hidden");
document.getElementById("resultPage").classList.remove("hidden");

document.getElementById("hasil").innerText=
`${peserta} (${kelas})

Skor: ${skor}/50`;

}

