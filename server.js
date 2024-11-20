
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const authController = require('./controllers/authController.js');

const BASE_URL = process.env.BASE_URL;

app.use(express.json());

app.get('/', (req, res) => {

    res.send(`
    <html lang="en">
      <head>
        <title>Animula Auth API</title>
      </head>
      <body>
        <h1>18222061 - Winata.T</h1>
        <p>Selamat datang di Animula Auth API!</p>
        <h2>Daftar Rute yang Tersedia:</h2>
        <ul>
          <li><a href="${BASE_URL}/auth/register" target="_blank"><strong>POST /api/auth/register:</strong></a> Mendaftarkan pengguna baru dengan email, password, dan nama.</li>
          <li><a href="${BASE_URL}/auth/login" target="_blank"><strong>POST /api/auth/login:</strong></a> Login dan mendapatkan access token serta refresh token.</li>
          <li><a href="${BASE_URL}/auth/logout" target="_blank"><strong>POST /api/auth/logout:</strong></a> Logout dan membatalkan refresh token.</li>
          <li><a href="${BASE_URL}/auth/refresh" target="_blank"><strong>POST /api/auth/refresh:</strong></a> Menggunakan refresh token untuk memperbarui access token.</li>
          <li><a href="${BASE_URL}/user/profile" target="_blank"><strong>GET /api/user/profile:</strong></a> Mendapatkan informasi profil pengguna yang sedang login (rute dilindungi).</li>
        </ul>
      </body>
    </html>
  `);
});

app.post('/api/auth/register',authController.register);

app.post('/api/auth/login',authController.login);

app.post('/api/auth/logout',authController.logout);

app.post('/api/auth/refresh',authController.tokenRefresh);

app.post('/api/user/profile',authController.getProfile);


app.listen(3000,()=>{
    console.log('Port 3000, TST 18222061 , Auth API Running ')
})