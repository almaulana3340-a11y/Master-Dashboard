const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Laluan asas (Route) supaya pelayar web tak keluar ralat Cannot GET /
app.get('/', (req, res) => {
  res.send('Master Dashboard Pro is live!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

