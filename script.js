// =============================
// VAR GLOBAL
// =============================

let bankSoal = [];

let peserta = "";
let kelas = "";

let soalUjian = [];
let jawaban = [];

let index = 0;
let waktu = 50 * 60; // 50 menit
let timerInterval;


// =============================
// MULAI UJIAN
// =============================

function mulaiUjian() {

peserta = document.getElementById("nama").value.trim();
kelas = document.getElementById("kelas").value.trim();

if (!peserta || !kelas) {
alert("Isi nama dan kelas dulu!");
return;
}

// acak soal
acakSoal();

// pindah halaman
document.getElementById("loginPage").classList.add("hidden");
document.getElementById("quizPage").classList.remove("hidden");

// tampil soal pertama
tampilkanSoal();

// mulai timer
mulaiTimer();
}


// =============================
// ACAK SOAL
// =============================

function acakSoal() {

let temp = [...bankSoal];

// shuffle
temp.sort(() => Math.random() - 0.5);

// ambil 50 soal
soalUjian = temp.slice(0, 50);

jawaban = new Array(50).fill(null);

}


// =============================
// TAMPILKAN SOAL
// =============================

function tampilkanSoal() {

let s = soalUjian[index];

document.getElementById("nomor").innerText =
"Soal " + (index + 1) + " / 50";

document.getElementById("soal").innerText = s.q;

let opsiHTML = "";

s.o.forEach((opsi, i) => {

let selected = jawaban[index] === i ? "selected" : "";

opsiHTML += `
<div class="opsi ${selected}" onclick="pilihJawaban(${i})">
${opsi}
</div>
`;

});

document.getElementById("opsi").innerHTML = opsiHTML;


// =====================
// TOMBOL SELESAI
// =====================

let finishBtn = document.querySelector(".finishBtn");

if (index === 49) {
finishBtn.style.display = "block";
} else {
finishBtn.style.display = "none";
}

}



// =============================
// PILIH JAWABAN
// =============================

function pilihJawaban(i) {

jawaban[index] = i;
tampilkanSoal();

}


// =============================
// NAVIGASI
// =============================

function nextSoal() {

if (index < 49) {
index++;
tampilkanSoal();
}

}

function prevSoal() {

if (index > 0) {
index--;
tampilkanSoal();
}

}


// =============================
// TIMER
// =============================

function mulaiTimer() {

timerInterval = setInterval(() => {

waktu--;

let menit = Math.floor(waktu / 60);
let detik = waktu % 60;

document.getElementById("timer").innerText =
"Waktu: " + menit + ":" + (detik < 10 ? "0" : "") + detik;

if (waktu <= 0) {
clearInterval(timerInterval);
selesai();
}

}, 1000);

}


// =============================
// SELESAI UJIAN
// =============================

function selesai() {

clearInterval(timerInterval);

// hitung skor
let skor = 0;

soalUjian.forEach((s, i) => {
if (jawaban[i] === s.a) skor++;
});

// tampil hasil
document.getElementById("quizPage").classList.add("hidden");
document.getElementById("resultPage").classList.remove("hidden");

document.getElementById("hasil").innerText =
`${peserta} (${kelas})

Skor: ${skor} / 50`;

// =======================
// LOAD SOAL JSON
// =======================

window.addEventListener("load", () => {

fetch("soal.json")
.then(res => res.json())
.then(data => {

bankSoal = data;
console.log("Soal siap:", bankSoal.length);

})
.catch(err => {

alert("Soal gagal dimuat!");
console.error(err);

});

});
  
}



