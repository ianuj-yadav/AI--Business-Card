require('dotenv').config();
const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from root directory
app.use(express.static(__dirname));

// Explicit Root Route Handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicit Static Asset Fallbacks
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/app.js', (req, res) => res.sendFile(path.join(__dirname, 'app.js')));
app.get('/anuj.jpg', (req, res) => res.sendFile(path.join(__dirname, 'anuj.jpg')));
app.get('/hat_filled.png', (req, res) => res.sendFile(path.join(__dirname, 'hat_filled.png')));

// Design Pamphlets Live Routes
app.get('/pamphlet1', (req, res) => res.sendFile(path.join(__dirname, 'pamphlet1_aurora_glass.html')));
app.get('/pamphlet2', (req, res) => res.sendFile(path.join(__dirname, 'pamphlet2_neo_brutalism.html')));
app.get('/pamphlet3', (req, res) => res.sendFile(path.join(__dirname, 'pamphlet3_japanese_zen.html')));
app.get('/pamphlet4', (req, res) => res.sendFile(path.join(__dirname, 'pamphlet4_cybernetic_holo.html')));
app.get('/pamphlet5', (req, res) => res.sendFile(path.join(__dirname, 'pamphlet5_retro_risograph.html')));

// Model configuration optimized for sub-second lightning speed & high quality
const modelConfigs = [
    {
        model: 'meta/llama-3.1-8b-instruct',
        apiKey: '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',
        maxTokens: 250,
        temperature: 0.5
    },
    {
        model: 'meta/llama-3.1-70b-instruct',
        apiKey: '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',
        maxTokens: 250,
        temperature: 0.5
    }
];

function executeNvidiaQuery(config, systemPrompt, userMessage) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: config.temperature || 0.5,
            max_tokens: config.maxTokens || 250
        });

        const options = {
            hostname: 'integrate.api.nvidia.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey.trim()}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 12000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        return resolve(response.choices[0].message.content.trim());
                    } else if (response.detail || response.error) {
                        return reject(new Error(response.detail || JSON.stringify(response.error)));
                    } else {
                        return reject(new Error('Invalid API response structure.'));
                    }
                } catch (parseErr) {
                    return reject(new Error('Failed to parse JSON response.'));
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('API request timed out.'));
        });

        req.write(payload);
        req.end();
    });
}

async function queryWithFallback(systemPrompt, userMessage) {
    let lastError = null;

    for (const config of modelConfigs) {
        try {
            const response = await executeNvidiaQuery(config, systemPrompt, userMessage);
            return response;
        } catch (err) {
            console.warn(`Model ${config.model} failed: ${err.message}. Trying fallback...`);
            lastError = err;
        }
    }

    throw lastError || new Error("AI service currently unavailable.");
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message, systemPrompt } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Message is required." });
        }

        const replyText = await queryWithFallback(systemPrompt, message);
        res.json({ reply: replyText });

    } catch (error) {
        console.error('Chat API Error:', error.message || error);
        res.status(500).json({ 
            reply: `AI Assistant briefly busy. Give it another click! 🚀` 
        });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Witty AI Card server listening on port ${PORT} [Primary: meta/llama-3.1-8b-instruct]`);
    });
}

module.exports = app;
