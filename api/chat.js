const https = require('https');

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
