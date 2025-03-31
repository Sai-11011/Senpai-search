const express = require('express');
const axios = require('axios');
const path = require('path');

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