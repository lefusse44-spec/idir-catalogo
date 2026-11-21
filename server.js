const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3400;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'idir-catalogo' }));

app.listen(PORT, () => console.log(`IDIR Catalogo running on port ${PORT}`));
