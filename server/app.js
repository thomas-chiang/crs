const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: true });
require("./socketio")(io)
require("./cron.js");

app.use(cors());
app.use(express.json()); 
app.use('/courses',require("./routes/courses.js"));
app.use('/users',require("./routes/users.js"));
app.use('/course-user',require("./routes/courseUser.js"));
app.get('/', (req, res) => {
    res.send('Crs Server');
});


module.exports = server;