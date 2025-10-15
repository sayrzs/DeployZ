// =============================
// DELET THAT FILE IF YOU'RE NOT USING VERCEL
// SENDS A DISCORD WEBHOOK WHEN A NEW DEPLOYMENT IS MADE
// =============================
export default function handler(req, res) {
    // Response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for frontend requests
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle different HTTP methods
    if (req.method === 'POST') {
        console.log('Webhook received:', { method: req.method, body: req.body });
        try {
            const webhookURL = "https://discord.com/api/webhooks/1426223430050648114/rSVUcJp_vPhaDlIkjZ5vxag0Ti8l7udkcXnbi9DJJVCYcnG3Qtjobz8nKRUw8YO5pQ9w";
            console.log('Using hardcoded webhook URL for testing');

            const { name, environment, url, state } = req.body || {};

            console.log('Parsed webhook data:', { name, environment, url, state });

            // Simple test message
            const data = {
                content: `Hello there! New deployment: ${name || "Unknown"} - ${state || "Unknown"}`
            };

            fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Webhook failed: ${response.statusText}`);
                }
                console.log('Webhook sent successfully');
                res.status(200).json({ ok: true });
            }).catch(err => {
                console.error("Error sending webhook:", err);
                res.status(500).json({ error: "Internal Server Error" });
            });
        } catch (err) {
            console.error("Error in try block:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === 'OPTIONS') {
        // Handle preflight CORS requests
        res.status(200).end();
    } else {
        // Method not allowed
        res.status(405).json({ error: 'Method not allowed' });
    }
}
