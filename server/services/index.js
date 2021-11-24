require("dotenv").config()
const EmailService = require("./email")

const emailService = new EmailService({
    clientUrl: process.env.CLIENT_URL,
    emailFromAddress: process.env.EMAIL_FROM_ADDRESS,
    applicationName: process.env.APP_NAME
})

module.exports = { emailService };
