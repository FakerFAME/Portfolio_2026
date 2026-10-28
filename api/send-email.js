const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, company, email, message } = req.body || {};

    if (!process.env.FOLIO_EMAIL || !process.env.FOLIO_PASSWORD) {
        return res.status(200).json({
            message: 'success',
            note: 'Contact submission received (configure FOLIO_EMAIL and FOLIO_PASSWORD in Vercel for SMTP forwarding).',
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.FOLIO_EMAIL,
                pass: process.env.FOLIO_PASSWORD,
            },
        });

        await transporter.verify();
        await transporter.sendMail({
            from: `"${name}" <${process.env.FOLIO_EMAIL}>`,
            to: process.env.FOLIO_EMAIL,
            subject: `${name} <${email}> ${
                company ? `from ${company}` : ''
            } submitted a contact form`,
            text: `${message}`,
        });

        return res.status(200).json({ message: 'success' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};
