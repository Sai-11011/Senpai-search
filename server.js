require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');
const axios = require('axios');
const path = require('path');
// Initialize firebase-admin from either a base64-encoded service account JSON
// (`FIREBASE_SERVICE_ACCOUNT`) or from individual env vars for projectId/clientEmail/privateKey.
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const svc = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString());
        admin.initializeApp({
            credential: admin.credential.cert(svc),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        console.log('Firebase admin initialized from FIREBASE_SERVICE_ACCOUNT');
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        console.log('Firebase admin initialized from individual env vars');
    } else {
        console.log('Firebase not configured; skipping firebase-admin init.');
    }
} catch (err) {
    console.error('Failed to initialize firebase-admin:', err && err.message ? err.message : err);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/anime', async (req, res) => {
    const query = req.query.q || '';
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/api/anime/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});