// Cloudflare Worker — Contact Form Handler
// 环境变量：BREVO_API_KEY（填你的 Brevo API Key）

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const { name, email, message } = await request.json();

      if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { email: 'hello@dormtool.com', name: 'DormTool Contact' },
          to: [{ email: 'hello@dormtool.com' }],
          subject: `[DormTool] Contact Form: ${name}`,
          htmlContent: `<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${escHtml(name)}</p>
<p><strong>Email:</strong> ${escHtml(email)}</p>
<p><strong>Message:</strong></p>
<p>${escHtml(message)}</p>`,
        }),
      });

      if (brevoRes.ok) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        const errText = await brevoRes.text();
        return new Response(JSON.stringify({ error: 'Email send failed', detail: errText, status: brevoRes.status }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
