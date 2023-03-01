require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.MAIL_KEY);

module.exports.sendMail = async (msg) => {
    try {
        await sgMail.send(msg);
        console.log('message sent successfully');
    }
    catch (error) {
        console.log(error)
    if (error.response) {
        console.error(error.response.body);
    }
 }
}