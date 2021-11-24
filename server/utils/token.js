const crypto = require('crypto');

const generateCyptoToken = (numBytes) => crypto.randomBytes(numBytes).toString("hex");

const generatePasswordResetToken = () => {
    return {
        token: generateCyptoToken(20),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }
}

module.exports = {
    generatePasswordResetToken
}
    