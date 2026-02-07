let soalUjian=[], jawaban=[], peserta="", kelas="", mode="latihan", index=0;
let waktu=0, timer;

// Contoh soal langsung (10 soal)
soalLatihan = [
  {q:"Contoh Soal 1?", o:["A1","B1","C1","D1"], a:0},
  {q:"Contoh Soal 2?", o:["A2","B2","C2","D2"], a:1},
  {q:"Contoh Soal 3?", o:["A3","B3","C3","D3"], a:2},
  {q:"Contoh Soal 4?", o:["A4","B4","C4","D4"], a:3},
  {q:"Contoh Soal 5?", o:["A5","B5","C5","D5"], a:0},
  {q:"Contoh Soal 6?", o:["A6","B6","C6","D6"], a:1},
  {q:"Contoh Soal 7?", o:["A7","B7","C7","D7"], a:2},
  {q:"Contoh Soal 8?", o:["A8","B8","C8","D8"], a:3},
  {q:"Contoh Soal 9?", o:["A9","B9","C9","D9"], a:0},
  {q:"Contoh Soal 10?", o:["A10","B10","C10","D10"], a:1},
];

// MODE
function setMode(m){
  mode=m;
  document.getElementById("btnLatihan").classList.remove("active");
  document.getElementById("btnUjian").classList.remove("active");
  document.getElementById(m==="latihan"?"btnLatihan":"btnUjian").classList.add("active");
}

// MULAI
function mulaiUjian(){
    let n=document.getElementById("nama").value.trim();
    let k=document.getElementById("kelas").value.trim();
    if(!n||!k){alert("Isi nama & kelas"); return;}
    peserta=n; kelas=k;
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");
    index=0;
    jawaban=new Array(soalUjian.length).fill(null);
    waktu=mode==="latihan"?10*60:120*60;
    tampilSoal();
    startTimer();
}

// TAMPIL SOAL
function tampilSoal(){
    let s=soalUjian[index];
    document.getElementById("nomor").innerText=`Soal ${index+1} / ${soalUjian.length}`;
    document.getElementById("soal").innerText=s.q;
    let huruf=["A","B","C","D","E"],html="";
    s.o.forEach((o,i)=>{
        let sel=jawaban[index]===i?"selected":"";
        html+=`<div class="opsi ${sel}" onclick="pilih(${i})"><b>${huruf[i]}.</b> ${o}</div>`;
    });
    document.getElementById("opsi").innerHTML=html;
    updateProgress(); updateGrid();
    document.querySelector(".finishBtn").style.display=(index===soalUjian.length-1)?"block":"none";
}

// PILIH JAWABAN
function pilih(i){jawaban[index]=i;if(mode==="latihan"){alert(i===soalUjian[index].a?"✔ Benar":"✘ Salah");}tampilSoal();}

// NAV
function nextSoal(){if(index<soalUjian.length-1){index++;tampilSoal();}}
function prevSoal(){if(index>0){index--;tampilSoal();}}

// GRID
function updateGrid(){let html="";for(let i=0;i<soalUjian.length;i++){let done=jawaban[i]!=null?"gridDone":"";html+=`<div class="gridBtn ${done}" onclick="lompat(${i})">${i+1}</div>`;}document.getElementById("gridSoal").innerHTML=html;}
function lompat(i){index=i;tampilSoal();}

// TIMER
function startTimer(){clearInterval(timer);
  timer=setInterval(()=>{
    if(waktu<=0){clearInterval(timer);selesai();return;}
    let m=Math.floor(waktu/60), s=waktu%60;
    document.getElementById("timer").innerText=`Waktu: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    waktu--;
  },1000);
}

// UPDATE PROGRESS
function updateProgress(){let p=Math.floor(jawaban.filter(j=>j!=null).length/soalUjian.length*100);document.getElementById("progressBar").style.width=`${p}%`;}

// SELESAI
function selesai(){
    clearInterval(timer);
    let benar=jawaban.reduce((acc,j,i)=>acc+(j===soalUjian[i].a?1:0),0);
    let skor=Math.round(benar/soalUjian.length*100);
    let status=skor>=70?"Lulus":"Tidak Lulus";
    document.getElementById("pesertaNama").innerText=peserta;
    document.getElementById("pesertaKelas").innerText=kelas;
    document.getElementById("hasilSkor").innerText=skor;
    document.getElementById("hasilDetail").innerText=benar;
    document.getElementById("statusKelulusan").innerText=status;
    let rDiv=document.getElementById("resultPage");
    rDiv.classList.remove("hidden");
    rDiv.classList.add(skor>=70?"lulus":"gagal");
    document.getElementById("quizPage").classList.add("hidden");
}

