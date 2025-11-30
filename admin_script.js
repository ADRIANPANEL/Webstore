document.getElementById('addSoalForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const pertanyaan = document.getElementById('pertanyaan').value;
    const pilihan = [
        document.getElementById('pilihanA').value,
        document.getElementById('pilihanB').value,
        document.getElementById('pilihanC').value,
        document.getElementById('pilihanD').value
    ];
    const jawaban = document.getElementById('jawaban').value;

    const res = await fetch('/add_soal',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({pertanyaan,pilihan,jawaban})
    }).then(r=>r.json());

    if(res.success) alert('Soal berhasil ditambahkan!');
    else alert('Gagal menambahkan soal');
});

async function loadHasil(){
    const res = await fetch('/hasil');
    const data = await res.json();
    const tbody = document.querySelector('#hasilTable tbody');
    tbody.innerHTML='';
    data.forEach(item=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.username}</td><td>${item.jawaban.join(', ')}</td><td>${item.skor}</td><td>${item.total}</td>`;
        tbody.appendChild(tr);
    });
}

loadHasil();
