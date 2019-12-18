const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const PORT = process.env.PORT || 3000;

app.use('/',express.static('public'));

io.on('connection',socket => {
    socket.emit('iniciar', {jugador: 'juagdor', jugadores:'jugadores'});
    console.log('Usuario conectado');
});

http.listen(PORT,()=> {
    console.log(`Listening on http://localhost:${PORT}`);
})