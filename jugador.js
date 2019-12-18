class Jugador {

    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.estado = null;

        this.orientacion = null;

        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        // Disparo
        this.cadenciaDisparo = 44;
        this.tiempoDisparo = 0;


    }


}

module.exports = Jugador;