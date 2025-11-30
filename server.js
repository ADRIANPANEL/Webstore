const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({ secret: 'secret123', resave: false, saveUninitialized: true }));

// Database
const db = new sqlite3.Database('./db/ujian.db', (err) => {
    if(err) console.error(err);
    else console.log('Database siap');
});

// Buat tabel jika belum ada
db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        role TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS soal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pertanyaan TEXT,
        pilihan TEXT,
        jawaban TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS hasil (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        jawaban TEXT
    )`);
});

// Login
app.post('/login', (req,res)=>{
    const {username,password,role} = req.body;
    db.get("SELECT * FROM users WHERE username=? AND password=? AND role=?",[username,password,role],(err,row)=>{
        if(row){
            req.session.user = row;
            res.json({success:true});
        } else {
            res.json({success:false,message:'Login gagal'});
        }
    });
});

// Ambil soal
app.get('/soal',(req,res)=>{
    db.all("SELECT * FROM soal",[],(err,rows)=>{ res.json(rows); });
});

// Submit jawaban siswa
app.post('/submit',(req,res)=>{
    const {username,jawaban} = req.body;
    db.run("INSERT INTO hasil (username,jawaban) VALUES (?,?)",[username,JSON.stringify(jawaban)],function(err){
        if(err) res.json({success:false});
        else res.json({success:true});
    });
});

// Admin tambah soal
app.post('/add_soal',(req,res)=>{
    const {pertanyaan,pilihan,jawaban} = req.body;
    db.run("INSERT INTO soal (pertanyaan,pilihan,jawaban) VALUES (?,?,?)",[pertanyaan,JSON.stringify(pilihan),jawaban],function(err){
        if(err) res.json({success:false});
        else res.json({success:true});
    });
});

// Ambil hasil ujian beserta skor
app.get('/hasil',(req,res)=>{
    db.all("SELECT * FROM hasil",[],async (err,rows)=>{
        if(err) return res.json([]);
        const result = [];
        for(const row of rows){
            const jawabanUser = JSON.parse(row.jawaban);
            const soalDB = await new Promise(resolve=>{
                db.all("SELECT * FROM soal",[],(err,soalRows)=>resolve(soalRows));
            });
            let skor = 0;
            soalDB.forEach((soal,idx)=>{
                if(jawabanUser[idx] === soal.jawaban) skor++;
            });
            result.push({username:row.username,jawaban:jawabanUser,skor, total:soalDB.length});
        }
        res.json(result);
    });
});

app.listen(3000,()=>console.log("Server berjalan di http://localhost:3000"));
