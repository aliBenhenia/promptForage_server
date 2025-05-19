const axios = require('axios');

async function send2FACode(toEmail, code) {
  const payload = {
    service_id:      process.env.EMAILJS_SERVICE_ID,
    template_id:     process.env.EMAILJS_TEMPLATE_ID,
    user_id:       process.env.EMAILJS_PUBLIC_KEY,  // not EMAILJS_USER_ID
    template_params: {
      to_email: toEmail,
      code:      code,
    },
  };

  const res = await axios.post(
    'https://api.emailjs.com/api/v1.0/email/send',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return res.data;
}
exports.send2FACode = send2FACode;