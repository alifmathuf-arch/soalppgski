// =============================
// VAR GLOBAL
// =============================

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

}


// =============================
// PILIH JAWABAN
// =============================

function pilihJawaban(i) {

jawaban[index]
