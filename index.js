const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const uuid = require('uuid/v1');
const Jugador = require('./jugador');

const PORT = process.env.PORT || 3000;

app.use('/',express.static('public'));



const jugadores = {}

io.on('connection',socket => {
    const jugador = new Jugador(uuid(), 160,160);
    jugadores[jugador.id] = jugador;

    socket.emit('iniciar', {jugador, jugadores});
    socket.broadcast.emit('nuevo jugador', jugador);
    console.log(`Conectado jugador ${jugador.id}`);

    socket.on('disconnect', () => {
        console.log(`Juguador ${jugador.id} desconectado`);
        delete jugadores[jugador.id]
        socket.broadcast.emit('jugador desconectado', jugador.id);

    });
});

http.listen(PORT,()=> {
    console.log(`Listening on http://localhost:${PORT}`);
})