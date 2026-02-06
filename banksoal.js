const bankSoal=[
{q:"2+2=?",o:["3","4","5","6"],a:1},
{q:"Ibukota Indonesia?",o:["Bandung","Jakarta","Surabaya","Medan"],a:1},

// tambah sampai ratusan soal…
];

// generator dummy sampai 100 soal
for(let i=3;i<=100;i++){
bankSoal.push({
q:`Soal contoh nomor ${i}`,
o:["A","B","C","D"],
a:Math.floor(Math.random()*4)
});
}
