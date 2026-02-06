// ==========================
// GLOBAL
// ==========================
let mode="ujian";
let bankSoal = [];
let soalUjian = [];
let jawaban = [];

let peserta = "";
let kelas = "";
let index = 0;

let waktu = 50 * 60;
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
    mode=document.getElementById("mode").value;
    peserta = document.getElementById("nama").value.trim();
    kelas = document.getElementById("kelas").value.trim();

    if(!peserta || !kelas){
        alert("Isi nama dan kelas!");
        return;
    }

    index = 0;
    waktu = 50 * 60;

    acakSoal();

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");

    tampilkanSoal();
    mulaiTimer();
    updateProgress();
    updateGrid();

}


// ==========================
// ACAK SOAL
// ==========================

function acakSoal(){

    let temp = [...bankSoal];

    temp.sort(() => Math.random() - 0.5);

    let jumlah = Math.min(50, temp.length);

    soalUjian = temp.slice(0, jumlah);
    jawaban = new Array(jumlah).fill(null);

}

function updateProgress(){

let persen =
((index+1)/soalUjian.length)*100;

document.getElementById("progressBar")
.style.width=persen+"%";

}
function updateGrid(){

let html="";

for(let i=0;i<soalUjian.length;i++){

let done=jawaban[i]!=null?"gridDone":"";

html+=`
<div class="gridBtn ${done}"
onclick="lompat(${i})">${i+1}</div>`;

}

document.getElementById("gridSoal")
.innerHTML=html;

}

function lompat(i){

index=i;
tampilkanSoal();

}

// ==========================
// TAMPIL SOAL
// ==========================

function tampilkanSoal(){

    let s = soalUjian[index];

    document.getElementById("nomor").innerText =
        "Soal " + (index+1) + " / " + soalUjian.length;

    document.getElementById("soal").innerText = s.q;

    let huruf = ["A","B","C","D","E"];
    let opsiHTML = "";

    s.o.forEach((opsi,i)=>{

        let selected = jawaban[index] === i ? "selected" : "";

        opsiHTML += `
        <div class="opsi ${selected}" onclick="pilih(${i})">
        <b>${huruf[i]}.</b> ${opsi}
        </div>`;
    });

    document.getElementById("opsi").innerHTML = opsiHTML;

    let finishBtn = document.querySelector(".finishBtn");

    finishBtn.style.display =
        (index === soalUjian.length - 1) ? "block" : "none";

}


// ==========================
// PILIH JAWABAN
// ==========================

function pilih(i){

    jawaban[index] = i;
    tampilkanSoal();

}

function pilih(i){

jawaban[index]=i;

if(mode==="latihan"){

let benar=
i===soalUjian[index].a;

alert(benar?"✔ Benar":"✘ Salah");

}

tampilkanSoal();

}

// ==========================
// NAVIGASI
// ==========================

function nextSoal(){

    if(index < soalUjian.length - 1){
        index++;
        tampilkanSoal();
    }

}

function prevSoal(){

    if(index > 0){
        index--;
        tampilkanSoal();
    }

}


// ==========================
// TIMER
// ==========================

function mulaiTimer(){

    clearInterval(timerInterval);

    timerInterval = setInterval(()=>{

        waktu--;

        let m = Math.floor(waktu/60);
        let s = waktu%60;

        document.getElementById("timer").innerText =
            "Waktu: " + m + ":" + (s<10?"0":"") + s;

        if(waktu <= 0){
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

    let skor = 0;

    soalUjian.forEach((s,i)=>{
        if(jawaban[i] === s.a) skor++;
    });

    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.remove("hidden");

    document.getElementById("hasil").innerText =
`${peserta} (${kelas})

Skor: ${skor}/${soalUjian.length}`;
simpanLeaderboard(peserta,skor);
tampilLeaderboard();

}

function simpanLeaderboard(nama,skor){

let data=
JSON.parse(localStorage.getItem("rank")||"[]");

data.push({nama,skor});

data.sort((a,b)=>b.skor-a.skor);

data=data.slice(0,5);

localStorage.setItem("rank",
JSON.stringify(data));

}

function tampilLeaderboard(){

let data=
JSON.parse(localStorage.getItem("rank")||"[]");

let html="";

data.forEach((d,i)=>{

html+=`${i+1}. ${d.nama} — ${d.skor}<br>`;

});

document.getElementById("leaderboard")
.innerHTML=html;

}
