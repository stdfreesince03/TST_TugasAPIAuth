const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authController = require('./controllers/authController.js');
const BASE_URL = process.env.BASE_URL;

const app = express();
app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Animula Auth API',
            version: '1.0.0',
            description: 'API documentation for Animula Auth',
        },
        servers: [
            {
                url: BASE_URL || 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./server.js'], // Swagger annotations location
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth/logout', authController.logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Missing refresh token
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth/refresh', authController.tokenRefresh);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Access token required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
app.post('/api/user/profile', authController.getProfile);

app.listen(3000, () => {
    console.log('Port 3000, TST 18222061, Auth API Running');
    console.log('Swagger Docs available at: http://localhost:3000/api-docs');
});