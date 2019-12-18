// Canvas y contexto del Canvas
var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");
var escaladoMinimo = 1;

// Controles
var controles = {};


// Capas
var layer;
var gameLayer;

const socket = io({autoConnect: false});


// Inicio capas y bucle del juego
function iniciarJuego() {
    gameLayer = new GameLayer();
    gameLayer.registrarEventosDelServidor();
    layer = gameLayer;

    setInterval(loop, 1000 / 30);
    socket.open();
}



function loop(){
    layer.actualizar();
    layer.procesarControles()
    layer.dibujar();
}




// Cambio de escalado
window.addEventListener('load', resize, false);

function resize() {
    console.log("Resize")
    var escaladoAncho = parseFloat(window.innerWidth / canvas.width);
    var escaladoAlto = parseFloat(window.innerHeight / canvas.height);

    escaladoMinimo = Math.min(escaladoAncho, escaladoAlto);

    canvas.width = canvas.width*escaladoMinimo;
    canvas.height = canvas.height*escaladoMinimo;

    contexto.scale(escaladoMinimo,escaladoMinimo);
}
