require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; // Porta configurável
const TAGO_TOKEN = process.env.TAGO_TOKEN; // Token do TagoIO

// Middleware para tratar JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
    })

// Rota para receber dados do ESP32
app.post('/send-data', async (req, res) => {
    const { temperatura, umidade, luminosidade } = req.body;

    if (temperatura === undefined || umidade === undefined || luminosidade === undefined) {
        console.error('Dados incompletos recebidos:', req.body);
        return res.status(400).send('Erro: Dados incompletos. Certifique-se de enviar temperatura, umidade e luminosidade.');
    }

    console.log('Dados recebidos do ESP32:', { temperatura, umidade, luminosidade });

    const payload = [
        { variable: 'temperatura', value: temperatura, unit: '°C' },
        { variable: 'umidade', value: umidade, unit: '%' },
        { variable: 'luminosidade', value: luminosidade, unit: 'Lx' },
    ];

    try {
        const response = await axios.post(
            'https://api.tago.io/data',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: TAGO_TOKEN,
                },
            }
        );

        console.log('Resposta do TagoIO:', response.data);
        res.status(200).send('Dados enviados com sucesso para o TagoIO!');
    } catch (error) {
        console.error('Erro ao enviar dados para o TagoIO:', error.response?.data || error.message);
        res.status(500).send('Erro ao enviar dados para o TagoIO.');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
