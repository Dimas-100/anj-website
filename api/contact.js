/**
 * Contact form endpoint — sends quote requests via Resend.
 *
 * Env: RESEND_API_KEY must be set on the Vercel project (never in client code).
 * The sending domain anjconstruction.co is verified in Resend; inbound email for
 * the domain does NOT exist, so no mailbox is exposed anywhere — replies go to
 * the submitter's address via reply_to.
 */

const TO_ADDRESS = "diazdimas042@gmail.com";
const FROM_ADDRESS = "ANJ Construction Website <website@anjconstruction.co>";

const LIMITS = { name: 200, email: 320, phone: 40, city: 120, project_type: 60, message: 5000 };

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: real visitors never see this field. Bots that fill it get a
  // fake success so they don't retry.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const city = clean(body.city, LIMITS.city);
  const projectType = clean(body.project_type, LIMITS.project_type);
  const message = clean(body.message, LIMITS.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and project details are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look valid." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY is not configured");
    return res.status(500).json({ error: "The contact form isn't available right now." });
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "-"],
    ["City", city || "-"],
    ["Project type", projectType || "-"],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#5b5347;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;">${label}</td>` +
        `<td style="padding:6px 0;font-size:15px;color:#191512;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;">` +
    `<h2 style="color:#c0231d;margin:0 0 4px;">New quote request</h2>` +
    `<p style="margin:0 0 16px;color:#5b5347;">via anjconstruction.co</p>` +
    `<table style="border-collapse:collapse;">${rows}</table>` +
    `<p style="margin:18px 0 6px;color:#5b5347;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Project details</p>` +
    `<p style="margin:0;font-size:15px;color:#191512;white-space:pre-wrap;">${escapeHtml(message)}</p>` +
    `</div>`;

  const text =
    `New quote request via anjconstruction.co\n\n` +
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nCity: ${city || "-"}\n` +
    `Project type: ${projectType || "-"}\n\nProject details:\n${message}\n`;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject: `Quote request from ${name}${city ? ` (${city})` : ""}`,
        html,
        text,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text().catch(() => "");
      console.error("contact: Resend error", resendRes.status, detail);
      return res.status(502).json({ error: "We couldn't send your request. Please call us instead." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: unexpected error", err);
    return res.status(500).json({ error: "We couldn't send your request. Please call us instead." });
  }
};
