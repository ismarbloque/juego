class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
        this.jugador=null;
    }

    registrarEventosDelServidor(){
        socket.on('iniciar',({jugador,jugadores}) => {
            this.cargarJugador(jugador.x,jugador.y);

            for (const id in jugadores){
                if(id!=jugador.id){
                this.cargarEnemigo(id,jugadores[id].x, jugadores[id].y);
                }
            }
        })

        socket.on('nuevo jugador', jugador=>{
            this.cargarEnemigo(jugador.id, jugador.x,jugador.y);
        })

        socket.on('actualizar', enemigo=>{
        this.enemigos[enemigo.id].actualizarEstado(enemigo);

        })

        socket.on('jugador desconectado', id=>{
            delete this.enemigos[id];
        })
    }

    iniciar() {
        this.espacio = new Espacio(1);

        this.scrollX = 0;
        this.bloques = [];

        this.fondo = new Fondo(imagenes.fondo_2,480*0.5,320*0.5);

        this.enemigos = {};


        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);


        this.disparosJugador = []
        this.puntos = new Texto(0,480*0.9,320*0.07 );
        this.cargarMapa("res/"+nivelActual+".txt");
    }

    actualizar (){
        this.espacio.actualizar();

        // actualizar
        if(this.jugador){
            this.jugador.actualizar();

            socket.emit('actualizar',this.jugador);
        }
        for (const id in this.enemigos){
        this.enemigos[id].actualizar();
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }
    }

    calcularScroll(){
    if(!this.jugador){
        return;
    }
        // limite izquierda
        if ( this.jugador.x > 480 * 0.3) {
            if (this.jugador.x - this.scrollX < 480 * 0.3) {
                this.scrollX = this.jugador.x - 480 * 0.3;
            }
        }
        // limite derecha
        if ( this.jugador.x < this.anchoMapa - 480 * 0.3 ) {
            if (this.jugador.x - this.scrollX > 480 * 0.7) {
                this.scrollX = this.jugador.x - 480 * 0.7;
            }
        }

    }


    dibujar (){
        this.calcularScroll();

        this.fondo.dibujar();
        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX);
        }
        if(this.jugador){
        this.jugador.dibujar(this.scrollX);
        }

        for (const id in this.enemigos){
                this.enemigos[id].dibujar(scrollX);
                }


        // HUD
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
    }


    procesarControles( ){
    if(!this.jugador){
    return;
    }
        // disparar
        if (  controles.disparo ){
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                this.disparosJugador.push(nuevoDisparo);

            }


        }

        // Eje X
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.jugador.saltar();

        } else if ( controles.moverY < 0 ){


        } else {

        }

    }


    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length-1) * 40;
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];

                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = 40/2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y){
        switch(simbolo) {

            case "#":
                var bloque = new Bloque(imagenes.bloque_tierra, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
        }
    }


    cargarJugador(x,y){
                    this.jugador = new Jugador(x, y);
                    // modificación para empezar a contar desde el suelo
                    this.jugador.y = this.jugador.y - this.jugador.alto/2;
                    this.espacio.agregarCuerpoDinamico(this.jugador);

    }

    cargarEnemigo(id,x,y){
     const jugador = new Jugador(x, y);
                        // modificación para empezar a contar desde el suelo
                        jugador.y = jugador.y - jugador.alto/2;
                        this.espacio.agregarCuerpoDinamico(jugador);
                        this.enemigos[id] = jugador;
    }

}
