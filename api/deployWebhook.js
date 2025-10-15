// =============================
// DELET THAT FILE IF YOU'RE NOT USING VERCEL
// SENDS A DISCORD WEBHOOK WHEN A NEW DEPLOYMENT IS MADE
// =============================
export default async function handler(req, res) {
    // Response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for frontend requests
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle different HTTP methods
    if (req.method === 'POST') {
        console.log('Webhook received:', { method: req.method, body: req.body });
        try {
            const webhookURL = process.env.DISCORD_WEBHOOK_URL;
            if (!webhookURL) {
                console.error('DISCORD_WEBHOOK_URL environment variable not set');
                return res.status(500).json({ error: "Discord webhook not configured" });
            }

            const { name, environment, url, state } = req.body || {};

            console.log('Parsed webhook data:', { name, environment, url, state });

            // Colors based on status
            const colors = {
                success: 0x57f287, // GREEN
                failed: 0xed4245,  // RED
                created: 0x5865f2  // BLURPLE
            };

            const color =
                state === "READY" ? colors.success :
                state === "ERROR" ? colors.failed :
                colors.created;

            const data = {
                embeds: [
                    {
                        title: "New Vercel Deployment",
                        description: `Project **${name || "Unknown"}** just deployed!!`,
                        color,
                        fields: [
                            { name: "Environment", value: environment || "Production", inline: true },
                            { name: "URL", value: url || "N/A", inline: true }
                        ],
                        footer: { text: "Powered by Vercel × Sayrz Studio" },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            const response = await fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Webhook failed: ${response.statusText}`);
            }

            console.log('Webhook sent successfully');
            res.status(200).json({ ok: true });
        } catch (err) {
            console.error("Error sending webhook:", err);
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
