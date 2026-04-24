const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyparser = require("body-parser");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database setup
const db = new sqlite3.Database("database.db");

// Create table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, nama TEXT
    )
 `);


 // halaman utama
app.get("/", (req, res) => {
    db.all("SELECT * FROM items", (err, rows) => {
        let html = `
        <html>
        <head>
            <title>data siswa kelas XI</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
        <div class="container">
            <h1>data siswa kelas XI</h1>
            <form method="post" action="/add">
            <input type="text" name="nama"
            placeholder="masukan nama" required>
            <button type="submit">Tambah</button>
            </form>

            <ul>
        `;

        rows.forEach((item) => {
            html += `
            <li>${item.nama} 
            <a href="/delete/${item.id}">Hapus</a>
            </li>
            `;
        });

        html += `
            </ul>
        </div>
        </body>
        </html>
        `;
    res.send(html);
  });
});

// Tambah data
app.post("/add", (req, res) => {
    const {nama} = req.body;
    db.run("INSERT INTO items (nama) VALUES (?)", [nama]);
    res.redirect("/");
});

// Hapus data
app.get("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM items WHERE id = ?", [id]);
    res.redirect("/");
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});