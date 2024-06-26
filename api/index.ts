require('dotenv').config();
const micro = require('micro');
const cors = require('micro-cors')();
const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send email
const sendEmail = async (data) => {
    const htmlH3 = '<h3><u>Formulario Contacto Web</u></h3>';
    const htmlName = '<p><u>Nombre:</u> ' + data.rp_name + '<p>';
    const htmlEmail = '<p><u>Email:</u> ' + data.rp_email + '<p>';
    const htmlPhone = '<p><u>Phone:</u> ' + data.rp_subject + '<p>';
    const htmlMsg = '<p><u>Mensaje:</u> ' + data.rp_message + '<p>';

    const mailOptions = {
        from: 'Web - Estudio Gonzalez Fabrizio <nodemailer.ts@gmail.com>',
        to: 'nodemailer.ts@gmail.com',
        subject: '(WEB) Formulario Contacto.',
        text: data.msg,
        html: htmlH3 + htmlName + htmlEmail + htmlPhone + htmlMsg
    };

    return transporter.sendMail(mailOptions);
};

// Function to set CORS headers
const setCORSHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type');
};

const handler = async (req, res) => {
    
    setCORSHeaders(res);

    if (req.method === 'OPTIONS') {
        return micro.send(res, 200, {});
    }

    if (req.method !== 'POST') {
        return micro.send(res, 404, '404 - Not Found');
    }

    try {
        const data = await micro.json(req);
        await sendEmail(data);
        return micro.send(res, 200, { msg: 'El mensaje se ha enviado correctamente.' });
    } catch (err) {
        console.error('Error sending email:', err);
        return micro.send(res, 500, { msg: 'Error sending email. Please try again later.' });
    }
};

module.exports = cors(handler);
