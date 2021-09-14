//! Mario con kaboom.js por Joaquin Nuñez

kaboom({
    global: true,
    fullscreen: true,
    scale: 1.1,
    debug: true,
    clearColor: [0,0,0,1],
});


//Carga de los pngs
loadSprite('moneda', './graficos/2 - wbKxhcd.png')
loadSprite('hongo-malvado','./graficos/3 - KPO3fR9.png')
loadSprite('ladrillo','./graficos/1 - pogC9x5.png')
loadSprite('mario','./graficos/6 - Wb1qfhK.png')
loadSprite('bloque','./graficos/20 - M6rwarW.png')
loadSprite('hongo','./graficos/7 - 0wMd92p.png')
loadSprite('bloque-sorpresa','./graficos/9 - gesQ1KP.png')
loadSprite('bloque-abierto','./graficos/10 - bdrLpi6.png')
loadSprite('tubo-arriba-der','./graficos/13 - hj2GK4n.png')
loadSprite('tubo-arriba-izq','./graficos/14 - ReTPiWY.png')
loadSprite('tubo-abajo-der','./graficos/12 - nqQ79eI.png')
loadSprite('tubo-abajo-izq','./graficos/11 - c1cYSbt.png')

loadSprite('bloque-azul','./graficos/17 - gqVoI2b.png')
loadSprite('ladrillo-azul','./graficos/15 - 3e5YRQd.png')
loadSprite('bloque-sorpresa-azul', './graficos/18 - RMqCc1G.png')
loadSprite('hongo-malvado-azul','./graficos/16 - SvV4ueD.png')
loadSprite('brick-azul', './graficos/19 - fVscIbn.png')

//! Montaje de la escena
scene("game",({nivel,puntaje}) =>{
    layers(['bg','obj','ui'], 'obj')
    
    const maps = [
        [
            '                                 ',
            '                                 ',
            '                                 ',
            '                                 ',
            '                                 ',
            '                                 ',
            '                                 ',
            '   *     =*=%=                   ',
            '                                 ',
            '                        -+       ',
            '               >    >   ()       ',
            '===========================  ====',
        ],
        [
            '                                 ',
            '                                 ',
            '                                 ',
            '                                 ',
            '                        1        ',
            '                                 ',
            '                                 ',
            ',       32313                    ',
            ',                                ',
            ',                       -+       ',
            ',              <    <   ()       ',
            ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
        ]
    ]


   

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('bloque'), solid(), 'ladrillo'],
        '$': [sprite('moneda'), 'moneda'],
        '*': [sprite('bloque-sorpresa'), solid(), 'moneda-sorpresa'],
        '%': [sprite('bloque-sorpresa'), solid(), 'hongo-sorpresa'],
        '#': [sprite('hongo'), solid(), 'hongo', body()],
        '>': [sprite('hongo-malvado'), solid(), 'peligroso'],
        '}': [sprite('bloque-abierto'), solid()],
        '(': [sprite('tubo-abajo-izq'), solid(),scale(0.5), 'tubo'],
        ')': [sprite('tubo-abajo-der'), solid(),scale(0.5), 'tubo'],
        '-': [sprite('tubo-arriba-izq'), solid(),scale(0.5), 'tubo'],
        '+': [sprite('tubo-arriba-der'), solid(),scale(0.5),  'tubo'],

        '3': [sprite('brick-azul'), solid(),scale(0.5), 'ladrillo'],
        '1': [sprite('bloque-sorpresa-azul'), solid(),scale(0.5), 'moneda-sorpresa'],
        '2': [sprite('bloque-sorpresa-azul'), solid(),scale(0.5), 'hongo-sorpresa'],
        '<': [sprite('hongo-malvado-azul'), solid(),scale(0.5), 'peligroso'],
        ',': [sprite('ladrillo-azul'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(maps[nivel], levelCfg);

    //!Barras de puntaje y nivel
    const barraPuntaje = add([
        text(puntaje),
        pos(30,6),
        layer('ui'),
        {
            value: puntaje,
        }
    ])

    add([text('Nivel: ' + parseInt(nivel + 1)), pos (4,20)])


//! Efecto del hongo
function grande(){
    let tiempo=0;
    let esGrande= false;
    return{
        update(){
            if (esGrande) {
                tiempo -= dt()
                if(tiempo <= 0){
                    this.achicar()
                }
            }
        },
        esGrande(){
            return esGrande;
        },
        achicar() {
            this.scale= vec2(1)
            time=0;
            esGrande = false;
            VelocidadMovimiento = 120;
            FuerzaSalto = 360;
        },
        agrandar(time) {
            this.scale= vec2(2)
            tiempo=time;
            romperLadrillo=true;
            FuerzaSalto=400;
            VelocidadMovimiento=180;
            esGrande = true;
        }
    }
}
  
   
    



    //! Creacion del personaje
    const player = add([
        sprite('mario'),solid(),
        scale(1.2),
        pos(30,0),
        body(),
        grande(),
        origin('bot')
     
    ])

    //!Movimiento del hongo y hongos malvados
    action("hongo", (m) => {
        m.move(19,0);
    })
    action('peligroso', (p) => {
        p.move(-20,0);
    })


    //!Evento de colision con cabeza
    player.on("headbump", (obj)=>{
        if (obj.is('moneda-sorpresa')) {
           gameLevel.spawn('$', obj.gridPos.sub(0,1));
           destroy(obj); 
           gameLevel.spawn('}',obj.gridPos.sub(0,0))
        }
    })

    player.on("headbump", (obj)=>{
        if (obj.is('hongo-sorpresa')) {
           gameLevel.spawn('#', obj.gridPos.sub(0,1));
           destroy(obj); 
           gameLevel.spawn('}',obj.gridPos.sub(0,0));
        }
    })

    let romperLadrillo=false;
    
    player.on("headbump", (obj)=>{
        if(romperLadrillo){
            if (obj.is('ladrillo')) {
            
                destroy(obj); 

             }
        }
    })



    //!Evento de colision con hongo y moneda
    player.collides('hongo',(h) => {
        destroy(h);
        player.agrandar(6);
    })

    player.collides('moneda',(m) => {
        destroy(m);
        barraPuntaje.value++;
        barraPuntaje.text = barraPuntaje.value;
    })


    //! Colision con hongo malvado
    player.collides('peligroso',(p) => {
        if(estaSaltando){
            destroy(p);
        }else{
            go('perdio', {puntaje : barraPuntaje.value})
        }

    })

    //! Muerte por caida
    const Caida= 400;

    player.action(() => {
        camPos(player.pos);
        if (player.pos.y >= Caida)  {
            go('perdio', {puntaje: barraPuntaje.value})
        }
    })

    //! Pasaje de nivel
    player.collides('tubo', () =>{
      keyPress('down', () => {
          go('game', {
              nivel: (nivel +1 ),
              puntaje : barraPuntaje.value
          })
      })  
    })







    //! Eventos de movimiento
    let VelocidadMovimiento = 120;
    let FuerzaSalto = 360;
    let estaSaltando= true;

    keyDown('left', () => {
        player.move(-VelocidadMovimiento, 0)
    })
    keyDown('right', () => {
        player.move(VelocidadMovimiento, 0)
    })

    player.action(()=>{
        if(player.grounded()){
            estaSaltando=false;
        }
    })

    keyPress('space', () => {
        if(player.grounded()){
            estaSaltando= true;
            player.jump(FuerzaSalto);
        }else{}
    })



})

//!Escena de geame over
scene('perdio', ({puntaje}) => {
    add([text('Game Over. Pumtaje: '+ puntaje,22 ), origin('center'), pos(width()/2, height()/2)])
})



start("game", {nivel: 0,puntaje : 0});
