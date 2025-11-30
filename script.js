let soalList = [];
let waktu = 10*60; // 10 menit

async function loadSoal(){
    const res = await fetch('/soal');
    soalList = await res.json();
    const form = document.getElementById('ujianForm');
    form.innerHTML = '';
    soalList.forEach((soal,idx)=>{
        const pilihan = JSON.parse(soal.pilihan);
        const div = document.createElement('div');
        div.innerHTML = `<p>${idx+1}. ${soal.pertanyaan}</p>`;
        pilihan.forEach((p,i)=>{
            div.innerHTML += `<label><input type="radio" name="soal${idx}" value="${String.fromCharCode(65+i)}"> ${p}</label><br>`;
        });
        form.appendChild(div);
    });
}

function startTimer(){
    const timerEl = document.getElementById('timer');
    const interval = setInterval(()=>{
        let menit = Math.floor(waktu/60);
        let detik = waktu%60;
        timerEl.textContent = `Waktu: ${menit}:${detik<10?'0':''}${detik}`;
        waktu--;
        if(waktu<0){
            clearInterval(interval);
            submitJawaban();
        }
    },1000);
}

async function submitJawaban(){
    const jawaban = [];
    soalList.forEach((soal,idx)=>{
        const selected = document.querySelector(`input[name=soal${idx}]:checked`);
        jawaban.push(selected?selected.value:'');
    });

    const username = prompt("Masukkan username untuk simpan hasil:");
    const res = await fetch('/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,jawaban})
    }).then(r=>r.json());

    if(res.success){
        // Hitung skor
        let skor=0;
        soalList.forEach((soal,idx)=>{
            if(jawaban[idx]===soal.jawaban) skor++;
        });
        alert(`Jawaban berhasil disubmit! Nilai: ${skor}/${soalList.length}`);
    } else alert('Gagal submit jawaban');

    window.location.href='index.html';
}

document.getElementById('submitBtn').addEventListener('click',submitJawaban);

loadSoal();
startTimer();
