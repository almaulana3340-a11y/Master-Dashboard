const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

const bacaData = () => {
  if (!fs.existsSync(dataFilePath)) return [];
  try { return JSON.parse(fs.readFileSync(dataFilePath, 'utf8')); }
  catch (e) { return []; }
};

const tulisData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// 1. WEB DASHBOARD UTAMA
app.get('/', (req, res) => {
  const data = bacaData();
  let senaraiHTML = data.map((item, index) => `
    <div style="background: #1e1e2f; color: #fff; padding: 20px; margin: 15px 0; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.4); border: 1px solid #2a2a40;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="background: #4f46e5; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold;">ID: ${index}</span>
        <span style="font-size: 0.85em; color: #9ca3af;">${item.masa}</span>
      </div>
      <p style="font-size: 1.1em; margin: 10px 0; word-break: break-all;"><strong>Pesanan:</strong> ${item.pesanan}</p>
      
      <hr style="border: 0; border-top: 1px solid #374151; margin: 15px 0;">
      
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <form action="/kemaskini/${index}" method="POST" style="flex: 1; display: flex; gap: 5px;">
          <input type="text" name="pesanan" value="${item.pesanan}" required style="flex: 1; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background: #111827; color: white; font-size: 0.9em;">
          <button type="submit" style="background: #f59e0b; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">Edit</button>
        </form>
        <form action="/padam/${index}" method="POST" onsubmit="return confirm('Pasti mahu padam rekod ini?');">
          <button type="submit" style="background: #ef4444; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">Padam</button>
        </form>
      </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="ms">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Master Dashboard - Norazuan Bin Mohd</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; max-width: 700px; margin: auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #38bdf8; margin-bottom: 5px;">🚀 Master Dashboard Pro</h1>
        <p style="color: #94a3b8; font-size: 0.95em;">Pemilik Rasmi: <strong style="color: #f8fafc;">Norazuan Bin Mohd</strong></p>
      </div>
      
      <div style="background: #1e1e2f; padding: 25px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #2a2a40; margin-bottom: 30px;">
        <h3 style="margin-top: 0; color: #38bdf8;">✨ Tambah Pesanan Baru</h3>
        <form action="/hantar" method="POST">
          <input type="text" name="pesanan" placeholder="Taip pesanan baru di sini..." required style="width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #4b5563; background: #111827; color: white; box-sizing: border-box; font-size: 1em;">
          <button type="submit" style="background: #22c55e; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; font-size: 1em; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);">Simpan Data</button>
        </form>

        ${data.length > 0 ? `
          <form action="/padam-semua" method="POST" onsubmit="return confirm('AMARAN: Pasti mahu PADAM SEMUA rekod sekaligus?');" style="margin-top: 15px;">
            <button type="submit" style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; font-size: 0.95em; box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);">🗑️ Padam Semua Rekod</button>
          </form>
        ` : ''}
      </div>

      <h3 style="border-left: 4px solid #38bdf8; padding-left: 10px; margin-bottom: 20px;">Senarai Rekod Semasa (${data.length}):</h3>
      <div>${senaraiHTML || '<p style="color: #94a3b8; text-align: center; padding: 20px;">Belum ada rekod lagi. Jom tambah di atas!</p>'}</div>
    </body>
    </html>
  `);
});

// 2. CREATE
app.post('/hantar', (req, res) => {
  if (!req.body.pesanan) return res.redirect('/');
  const data = bacaData();
  data.push({ pesanan: req.body.pesanan, masa: new Date().toLocaleString() });
  tulisData(data);
  res.redirect('/');
});

// 3. UPDATE
app.post('/kemaskini/:index', (req, res) => {
  const index = req.params.index;
  let data = bacaData();
  if (data[index]) {
    data[index].pesanan = req.body.pesanan;
    data[index].masa = new Date().toLocaleString() + ' (Diedit)';
    tulisData(data);
  }
  res.redirect('/');
});

// 4. DELETE SATU
app.post('/padam/:index', (req, res) => {
  const index = req.params.index;
  let data = bacaData();
  if (data[index]) {
    data.splice(index, 1);
    tulisData(data);
  }
  res.redirect('/');
});

// 5. DELETE SEMUA
app.post('/padam-semua', (req, res) => {
  tulisData([]);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Master Dashboard Lengkap berjalan di http://localhost:${PORT}`);
});
