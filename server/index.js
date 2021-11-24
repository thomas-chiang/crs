const server = require('./app')
require('dotenv').config();
const PORT = process.env.PORT || 5000;

server.listen( PORT, () => {
    console.log(`Server is starting on port ${PORT}`);
});