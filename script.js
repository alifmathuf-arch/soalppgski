let bankSoal=[], soalUjian=[], jawaban=[];
let peserta="", kelas="", mode="latihan", index=0;
let waktu=120*60, timer;

// LOAD SOAL
fetch("soal.json")
.then(r=>r.json())
.then(d=>bankSoal=d)
.catch(()=>alert("Soal gagal dimuat"));

// MODE
function setMode(m){
    mode=m;
    document.getElementById("btnLatihan").classList.remove("active");
    document.getElementById("btnUjian").classList.remove("active");
    document.getElementById(m==="latihan"?"btnLatihan":"btnUjian").classList.add("active");
}

// MULAI UJIAN
function mulaiUjian(){
    let nama = document.getElementById("nama").value.trim();
    let kelasInput = document.getElementById("kelas").value.trim();
    if(!nama || !kelasInput){ alert("Isi nama & kelas"); return; }

    peserta = nama;
    kelas = kelasInput;

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");

    // Tampilkan timer
    document.getElementById("timer").classList.remove("hidden");

    acak();
    index=0;
    if(mode==="latihan") waktu=10*60; // latihan 10 menit
    else waktu=120*60; // ujian 2 jam

    tampil();
    timerStart();
}

// ACAK SOAL
function acak(){
    let temp = [...bankSoal];
    temp.sort(()=>Math.random()-0.5);
    let j = mode==="latihan"?10:Math.min(120,temp.length);
    soalUjian=temp.slice(0,j);
    jawaban = new Array(j).fill(null);
}

// TAMPIL SOAL
function tampil(){
    let s = soalUjian[index];
    document.getElementById("nomor").innerText = `Soal ${index+1} / ${soalUjian.length}`;
    document.getElementById("soal").innerText = s.q;

    let huruf=["A","B","C","D","E"];
    let html="";
    s.o.forEach((o,i)=>{
        let sel = jawaban[index]===i?"selected":"";
        html+=`<div class="opsi ${sel}" onclick="pilih(${i})"><b>${huruf[i]}.</b> ${o}</div>`;
    });
    document.getElementById("opsi").innerHTML = html;

    // progress bar
    updateProgress();
    // grid
    updateGrid();
    // tombol selesai di soal terakhir
    document.querySelector(".finishBtn").style.display = (index===soalUjian.length-1)?"block":"none";
}

// PILIH JAWABAN
function pilih(i){
    jawaban[index] = i;
    if(mode==="latihan"){
        alert(i===soalUjian[index].a?"✔ Benar":"✘ Salah");
    }
    tampil();
}

// NAV
function nextSoal(){ if(index<soalUjian.length-1){ index++; tampil(); } }
function prevSoal(){ if(index>0){ index--; tampil(); } }

// GRID
function updateGrid(){
    let html="";
    for(let i=0;i<soalUjian.length;i++){
        let done = jawaban[i]!=null?"gridDone":"";
        html+=`<div class="gridBtn ${done}" onclick="lompat(${i})">${i+1}</div>`;
    }
    document.getElementById("gridSoal").innerHTML = html;
}
function lompat(i){ index=i; tampil(); }

// TIMER
function timerStart(){
    clearInterval(timer);
    timer=setInterval(()=>{
        waktu--;
        let m=Math.floor(waktu/60);
        let s=waktu%60;
        document.getElementById("timer").innerText = `Waktu: ${m}:${s<10?"0":""}${s}`;
        if(waktu<=0){
            clearInterval(timer);
            selesai();
        }
    },1000);
}

// SELESAI
function selesai(){
    clearInterval(timer);
    let skor=0, benar=0;
    soalUjian.forEach((s,i)=>{ if(jawaban[i]===s.a){ skor+=2; benar++; } });

    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.remove("hidden");

    document.getElementById("pesertaNama").innerText = peserta;
    document.getElementById("pesertaKelas").innerText = kelas;
    document.getElementById("hasilSkor").innerText = skor;
    document.getElementById("hasilDetail").innerText = benar;
    document.getElementById("statusKelulusan").innerText = skor>=80?"LULUS":"TIDAK LULUS";

    let frame = document.getElementById("resultFrame");
    if(skor>=80){ frame.classList.add("lulus"); frame.classList.remove("gagal"); }
    else{ frame.classList.add("gagal"); frame.classList.remove("lulus"); }
}

// MODE SIANG/MALAM
function toggleMode(){
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}
