// Vercel serverless function for /api/hello
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
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
        res.status(200).json(response);
    } else if (req.method === 'POST') {
        // For Vercel, req.body is already parsed if Content-Type is application/json
        const body = req.body || {};

        const response = {
            message: `Hello, World! You sent: ${JSON.stringify(body)}`,
            receivedData: body,
            timestamp: new Date().toISOString(),
            method: 'POST',
            status: 'success'
        };
        res.status(200).json(response);
    } else {
        res.status(405).json({
            error: 'Method not allowed',
            allowedMethods: ['GET', 'POST', 'OPTIONS'],
            status: 'error'
        });
    }
}

// For other platforms that might expect different export names
export function handleRequest(req, res) {
    return handler(req, res);
}

export const handle = handler;