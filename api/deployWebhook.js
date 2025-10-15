// =============================
// DELET THAT FILE IF YOU'RE NOT USING VERCEL
// SENDS A DISCORD WEBHOOK WHEN A NEW DEPLOYMENT IS MADE
// =============================
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const webhookURL = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookURL) {
      return res.status(500).json({ error: "Discord webhook not configured" });
    }

    const { name, environment, url, state } = req.body || {};

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

    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending webhook:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
