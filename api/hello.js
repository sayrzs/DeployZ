// Vercel serverless function for /api/hello
export default function handler(req, res) {
    // Response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for frontend requests
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        res.status(200).json(response);
    } else if (req.method === 'POST') {
        // Handle POST requests (collect request body)
        try {
            const data = req.body;
            const response = {
                message: 'POST request received!',
                receivedData: data,
                timestamp: new Date().toISOString()
            };
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: 'Invalid JSON in request body' });
        }
    } else if (req.method === 'OPTIONS') {
        // Handle preflight CORS requests
        res.status(200).end();
    } else {
        // Method not allowed
        res.status(405).json({ error: 'Method not allowed' });
    }
}