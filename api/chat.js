const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

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
                    return reject(error);
                }

                try {
                    const response = JSON.parse(stdout);
                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        return resolve(response.choices[0].message.content.trim());
                    } else if (response.detail || response.error) {
                        return reject(new Error(response.detail || JSON.stringify(response.error)));
                    } else {
                        return reject(new Error('Invalid response structure from AI model.'));
                    }
                } catch (parseErr) {
                    return reject(new Error('Failed to parse AI model JSON response.'));
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

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Method Not Allowed' });
    }

    try {
        const { message, systemPrompt } = req.body || {};

        if (!message) {
            return res.status(400).json({ reply: "Message is required." });
        }

        const replyText = await queryWithFallback(systemPrompt, message);
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error('Chat API Error:', error.message || error);
        res.status(500).json({ 
            reply: `Yo! Anuj's AI Wingman is online & ready. Give your question another click! 🚀` 
        });
    }
};
