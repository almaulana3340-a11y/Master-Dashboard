const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// --- KOD LAMA AWAK LETAK DI BAWAH NI ---
// (Contoh: laluan route, sambungan database, dll yang awak dah tulis sebelum ni)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server sedang beroperasi di port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

