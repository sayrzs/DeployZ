// API handler for /api/hello
function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
        const response = {
            message: 'Hello, World!',
            timestamp: new Date().toISOString(),
            method: 'GET',
            status: 'success'
        };
        res.statusCode = 200;
        res.end(JSON.stringify(response));
    } else if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let parsedBody = {};
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = body;
            }

            const response = {
                message: `Hello, World! You sent: ${JSON.stringify(parsedBody)}`,
                receivedData: parsedBody,
                timestamp: new Date().toISOString(),
                method: 'POST',
                status: 'success'
            };
            res.statusCode = 200;
            res.end(JSON.stringify(response));
        });
    } else {
        const response = {
            error: 'Method not allowed',
            allowedMethods: ['GET', 'POST', 'OPTIONS'],
            status: 'error'
        };
        res.statusCode = 405;
        res.end(JSON.stringify(response));
    }
}

// Export for different platforms
module.exports = handler;
module.exports.handleRequest = handler;
module.exports.default = handler;