import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.post("/api/send-campaign", async (req, res) => {
  const { to, subject, content } = req.body
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "remitente@tudominio.com" },
        subject,
        content: [{ type: "text/plain", value: content }]
      })
    })
    if (!response.ok) {
      return res.status(400).json({ error: await response.text() })
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log("Backend en puerto " + port))