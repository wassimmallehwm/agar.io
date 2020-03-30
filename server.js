const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);
const helmet = require('helmet');
app.use(helmet());
console.log("listening on port 9000");


module.exports = {
    app,
    io
}
