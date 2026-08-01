require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

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
        const tempFile = path.join(os.tmpdir(), `nvidia_req_${Date.now()}_${Math.random().toString(36).substring(7)}.json`);

        const payload = JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: config.temperature || 0.5,
            max_tokens: config.maxTokens || 250
        });

        fs.writeFile(tempFile, payload, 'utf8', (writeErr) => {
            if (writeErr) {
                return reject(new Error('Failed to prepare request payload.'));
            }

            const args = [
                '-s', '-X', 'POST',
                'https://integrate.api.nvidia.com/v1/chat/completions',
                '-H', `Authorization: Bearer ${config.apiKey.trim()}`,
                '-H', 'Content-Type: application/json',
                '-d', `@${tempFile}`
            ];

            execFile('curl.exe', args, { maxBuffer: 10 * 1024 * 1024, timeout: 12000 }, (error, stdout, stderr) => {
                fs.unlink(tempFile, () => {});

                if (error) {
                    return reject(new Error(`cURL error: ${error.message}`));
                }

                try {
                    const data = JSON.parse(stdout);
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        resolve(data.choices[0].message.content);
                    } else if (data.error) {
                        reject(new Error(data.error.message || JSON.stringify(data.error)));
                    } else {
                        reject(new Error("Invalid API response format."));
                    }
                } catch (parseErr) {
                    reject(new Error("Failed to parse JSON response."));
                }
            });
        });
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
