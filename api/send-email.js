const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, company, email, message } = req.body || {};
    const folioEmail = process.env.FOLIO_EMAIL || 'pratyushkumar.pk83@gmail.com';

    if (!process.env.FOLIO_PASSWORD) {
        return res.status(503).json({
            error: 'SMTP not configured. Set FOLIO_EMAIL and FOLIO_PASSWORD in Vercel Environment Variables.',
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: folioEmail,
                pass: process.env.FOLIO_PASSWORD,
            },
        });

        await transporter.verify();
        await transporter.sendMail({
            from: `"${name}" <${folioEmail}>`,
            to: folioEmail,
            replyTo: email,
            subject: `${name} <${email}> ${
                company ? `from ${company}` : ''
            } submitted a contact form`,
            text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`,
        });

        return res.status(200).json({ message: 'success' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};
