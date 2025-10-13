// Example BACKEND "script" FOR THE /api/hello ENDPOINT
// This script 'DEMONSTRATES' how to handle API requests securely

module.exports.handleRequest = function(req, res, callback) {
    // Response headers
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CORS for frontend requests
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });

    // Handle different HTTP methods
    if (req.method === 'GET') {
        // Return a simple JSON response
        const response = {
            message: 'Hello from the secure backend!',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            userAgent: req.headers['user-agent'] || 'Unknown'
        };
        res.end(JSON.stringify(response, null, 2));
    } else if (req.method === 'POST') {
        // Handle POST requests (collect request body)
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const response = {
                    message: 'POST request received!',
                    receivedData: data,
                    timestamp: new Date().toISOString()
                };
                res.end(JSON.stringify(response, null, 2));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
            }
        });
    } else if (req.method === 'OPTIONS') {
        // Handle preflight CORS requests
        res.end();
    } else {
        // Method not allowed
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    // Call the callback to log the request
    callback();
};