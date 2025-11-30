document.getElementById('loginForm').addEventListener('submit',async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const res = await fetch('/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,password,role})
    }).then(r=>r.json());

    if(res.success){
        if(role==='admin') window.location.href='dashboard_admin.html';
        else window.location.href='ujian.html';
    } else alert(res.message);
});
