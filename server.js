const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3400;
const PASSWORD = process.env.CATALOGO_PASSWORD || 'IDIR2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware autenticazione via cookie
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  if (req.path === '/login' || req.path === '/login.html') return next();
  if (req.path === '/auth') return next();
  const cookie = req.headers.cookie || '';
  const auth = cookie.split(';').find(c => c.trim().startsWith('idir_auth='));
  if (auth && auth.split('=')[1] === 'ok') return next();
  res.redirect('/login.html');
});

app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint
app.post('/auth', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.setHeader('Set-Cookie', 'idir_auth=ok; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, msg: 'Password errata' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'idir-catalogo' }));

app.listen(PORT, () => console.log(`IDIR Catalogo running on port ${PORT}`));
