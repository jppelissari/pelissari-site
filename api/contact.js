// /api/contact.js — Vercel serverless function
// Route: POST /api/contact
// Sends diagnostic form submissions to josepelissari@jppelissari.com via Resend.
//
// ENV VAR required (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY — API key from https://resend.com/api-keys
//
// SENDER NOTE:
//   'from' is currently set to 'onboarding@resend.dev' for preview/test use.
//   Switch to 'contact@jppelissari.com' after jppelissari.com is verified in Resend.
//   DNS required: SPF, DKIM, DMARC records via https://resend.com/domains

const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const recurringIssue = (body['recurring-issue'] || '').trim();
  const location       = (body['location']        || '').trim();
  const teamDiagnosis  = (body['team-diagnosis']  || '').trim();

  if (!recurringIssue || recurringIssue.length < 5) {
    return res.status(400).json({ error: 'The recurring issue field is required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from:    'onboarding@resend.dev',          // TEST MODE — replace with contact@jppelissari.com after DNS verification
    to:      'josepelissari@jppelissari.com',
    subject: '[TEST] New diagnostic request — Pelissari',
    text: [
      `Recurring issue:\n${recurringIssue}`,
      `Where it shows up:\n${location     || '(not provided)'}`,
      `Team diagnosis:\n${teamDiagnosis   || '(not provided)'}`,
    ].join('\n\n'),
  });

  if (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send. Please try again.' });
  }

  return res.status(200).json({ ok: true });
};
