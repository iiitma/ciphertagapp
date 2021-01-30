const express = require('express');
const app = express();
const server = require('http').Server(app);
var history = require('connect-history-api-fallback');
const io = module.exports.io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }});


const PORT = process.env.PORT || 3231

const SocketManager = require('./SocketManager')
app.use(history());
app.use( express.static(__dirname + '/../../dist'));
io.on('connection', SocketManager)

server.listen(PORT, ()=>{
    console.log(`//// Server is listening on ${PORT} at ${new Date().toUTCString()} \n`);
})