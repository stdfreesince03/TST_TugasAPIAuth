const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.js');

async function register(req, res, next) {
    try {
        const { email, password, full_name } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data, error } = await db
            .from('user')
            .insert([{ email, password_hash: hashedPassword, full_name }]);

        if (error) return res.status(400).json({ error: 'Registration failed' });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await db
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(401).json({ error: 'Email or password is incorrect' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) return res.status(401).json({ error: 'Email or password is incorrect' });

        const refreshToken = jsonwebtoken.sign(
            { id: user.id, email: user.email },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '1d' }
        );

        const accessToken = jsonwebtoken.sign(
            { id: user.id, email: user.email },
             process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );


        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function logout(req, res, next) {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function tokenRefresh(req, res, next) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) return res.status(401).json({ error: 'Refresh token missing' });

        jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid refresh token' });

            const newAccessToken = jsonwebtoken.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '15m' }
            );

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getProfile(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: 'Access token required' });

        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });

            const { data: userProfile, error } = await db
                .from('user')
                .select('email, full_name, created_at')
                .eq('id', user.id)
                .single();

            if (error) return res.status(400).json({ error: 'Unable to fetch profile' });

            res.status(200).json({ profile: userProfile });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    register,
    login,
    logout,
    tokenRefresh,
    getProfile
};
