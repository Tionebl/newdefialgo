import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

/*context*/
const fall = 500
const speed = 1
const climbing_speed = 0.1

kaboom({
    global: true,
    fullscreen: true,
    width: 600,
    height: 450,
    background: [0, 0, 0,],
    scale: 1.5,
    crisp: true,
})

/*assets*/
loadSpriteAtlas("sprites/mario/Mario.png", {
    "mario": {
        x: 0,
        y: 0,
        width: 588,
        height: 100,
        sliceX: 6,
        anims: {
            idle_right: { from: 0, to: 0 },
            idle_left: { from: 1, to: 1 },
            run_right: { from: 2, to: 3, loop: true, speed: 5 },
            run_left: { from: 4, to: 5, loop: true, speed: 5 },
        },
    },
})
// sprite DK
loadSpriteAtlas("sprites/donkey_kong/DK.png", {
    "DK": {
        x: 0,
        y: 0,
        width: 2400,
        height: 250,
        sliceX: 6,
        anims: {
            beating: { from: 0, to: 1, loop: true, speed: 5 },
            baril_drop: { from: 2, to: 5, speed: 5 },
        },
    },
})
loadSpriteAtlas("sprites/obstacles/barrel.png", {
    "barrel": {
        x: 0,
        y: 0,
        width: 360,
        height: 90,
        sliceX: 4,
        anims: { from: 0, to: 3, loop: true, speed: 5 }
    }
});
loadSprite("floor", "sprites/map/floor_size_1.png");
loadSprite("floor_solid", "sprites/map/floor_solid_size_1.png");
loadSprite("ladder", "sprites/map/ladder_size_1.png");
loadSprite("oil_drum", "sprites/map/oil_drum_1.png");
loadSprite("straight_barrel_x4", "sprites/map/straight_barrel_x4.png");
loadSprite("heart", "sprites/misc/heart.png");
loadSprite("running_princess_right_2", "sprites/princess/running_princess_right_2.png");
loadSprite("running_mario_left_2", "sprites/mario/running_mario_left_2.png");
loadSprite("standing_donkey_kong", "sprites/donkey_kong/standing_donkey_kong.png");

/* sons */

loadSound("intro","Sounds/intro1.wav");
loadSound("longintro","Sounds/intro1_long.wav");
loadSound("backmusic","Sounds/bacmusic.wav");
loadSound("death", "Sounds/death.wav");
loadSound("hammer","Sounds/hammer.wav");
loadSound("item","Sounds/itemget.wav");
loadSound("jump","Sounds/jump.wav");
loadSound("walk","Sounds/walking.wav");
loadSound("win1","Sounds/win1.wav");
loadSound("win2","Sounds/win2.wav")

/*intro*/
scene("intro", () => {
    
    imusic.play()
    bgmusic.pause()
    onKeyPress("enter", () => {
        imusic.pause()
    }),
    /*keybindings*/
    add([
        text("Press 'left' or 'right' to move left or right!"),
        pos(width() / 2, height() / 2 - 160),
        scale(0.25),
        origin("center"),
    ]);

    add([
        text("Press 'space' to jump!"),
        pos(width() / 2, height() / 2 - 80),
        scale(0.25),
        origin("center"),
    ]);

    add([
        text("Press 'up' or 'down' to climb or climb down ladders!"),
        pos(width() / 2, height() / 2),
        scale(0.25),
        origin("center"),
    ]);

    add([
        text("Press 'Enter' to play!"),
        pos(width() / 2, height() / 2 + 120),
        scale(0.40),
        origin("center"),
    ]);


    /*go to game*/
    onKeyPress("enter", () => go("game"));
})

/*game*/
scene("game", () => {

    imusic.pause()
    bgmusic.play()
    
    gravity(250);

    /* game layers */
    layers([
        "background",
        "game",
        "ui",
    ], "game")

    /* spawn mario */
    const mario = add([
        sprite("mario"),
        pos(60, 379),
        area(),
        body(),
        scale(0.32),
        health(3),
        layer("game"),
    ])

    /*mario jump*/
    function jump() {
        if (mario.isGrounded()) {
            mario.jump(120);
            play("jump", {
                volume:0.2,
            });
        }
    }

    onKeyPress("space", jump);

    // DK
    const DK = add([
        sprite("DK"),
        pos(100, 22),
        layer("game"),
        scale(0.25),
    ])

    DK.play("beating")

    /*mario animations*/
    onUpdate(() => {
        const curAnim = mario.curAnim()

        if (isKeyDown("left")) {
            if (curAnim !== "run_left") {
                mario.play("run_left")
                
                    
            }
            mario.pos.x -= speed
        }

        else if (isKeyDown("right")) {
            if (curAnim !== "run_right") {
                mario.play("run_right")
                
                
            }
            mario.pos.x += speed
        }

        else {
            if (curAnim) {
                var directionAnim = curAnim.split('_')[1];
                mario.play('idle_' + directionAnim)
                walk.pause()
            }
        }
    })

    /* walk animation sound effect for Mario */
    let timer = 0
    /* to go left */
    onKeyPress("left", () => {
    // reset on press
        timer = 0
    })
    onKeyDown("left", () => {
        timer += dt()
        // fire every 1 second "left" is held down
    if (timer > 1) {
        timer = 0
        play("walk")
        } 
    })
    /* to go right */
    onKeyPress("right", () => {
        timer = 0
                
    })
    onKeyDown("right", () => {
        timer += dt()

    if (timer > 1) {
        timer = 0
        play("walk")  
        } 
    })

    mario.play("idle_right")

    /*princess*/
    const princess = add([
        sprite("running_princess_right_2"),
        pos(245, 5),
        area(),
        scale(0.35),
        "princess"
    ])

    /*ladders*/

    /* [first rung x, first rung y, number of rung] */
    var arr_ladder = [
        [420, 401, 5],  /*rez-de-chaussee*/

        [135, 335, 5],  /*1st floor*/
        [255, 343, 7],

        [285, 277, 7],  /*2nd floor*/
        [420, 269, 5],

        [210, 207, 6],  /*3rd floor*/
        [135, 203, 5],

        [420, 137, 5],  /*4th floor*/

        [315, 81, 5],  /*5th floor*/
    ];

    /*ladder scale*/
    var height_ladder = 21 * 0.35;

    /*add ladders*/
    arr_ladder.forEach(function (each_ladder) {
        for (var i = 0; i < each_ladder[2]; i++) {
            add([
                sprite("ladder"),
                pos(each_ladder[0], each_ladder[1] - i * height_ladder),
                area(),
                scale(0.35),
                'ladder',
                layer("background"),
            ])
        }
    })

    var getLadders = get('ladder');

    /*climb ladders*/
    mario.onUpdate(() => {
        getLadders.forEach(function (each_ladder) {
            if (mario.isTouching(each_ladder)) {
                if (isKeyDown("up")) {
                    mario.pos.y -= climbing_speed;
                    mario.jump(100);
                }

                else if (isKeyDown("down")) {
                    mario.pos.y += climbing_speed;
                }
            }
        })
    })

    /*level*/
    addLevel([
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "    4                                 ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $----__                ",
        "                ======                ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "             ===                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "                                      ",
        "             $ $                      ",
        "                                      ",
        "     --------------                   ",
        "     ==============---                ",
        "                   ===---             ",
        "                      ===--_          ",
        "                         ===__-       ",
        "                            ===       ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                $                     ",
        "                                      ",
        "                                      ",
        "                $                     ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                $                     ",
        "                               --     ",
        "                            ---==     ",
        "                $        ---===       ",
        "                      ---===          ",
        "                   ---===             ",
        "                ---===                ",
        "             ___===                   ",
        "          _--===                      ",
        "       -__===                         ",
        "       ===                            ",
        "                                      ",
        "                          $           ",
        "                                      ",
        "                                      ",
        "                          $           ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                          $           ",
        "                                      ",
        "     --                               ",
        "     ==---                $           ",
        "       ===---                         ",
        "          ===---                      ",
        "             ===--_       $           ",
        "                ===__-                ",
        "                   ===---             ",
        "                      ===--_          ",
        "                         ===__-       ",
        "                            ===       ",
        "                                      ",
        "                                      ",
        "             $                        ",
        "                                      ",
        "                                      ",
        "             $                        ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "             $                        ",
        "                                      ",
        "                                      ",
        "             $                 --     ",
        "                            ---==     ",
        "                         ---===       ",
        "             $        ---===          ",
        "                   ---===             ",
        "                ___===                ",
        "             ---===                   ",
        "          _--===                      ",
        "       -__===                         ",
        "       ===                            ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "     --                               ",
        "     ==---                            ",
        "       ===---                         ",
        "          ===---                      ",
        "             ===---                   ",
        "                ===---                ",
        "                   ===---             ",
        "                      ===--_          ",
        "                         ===__-       ",
        "                            ===       ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                $                     ",
        "                                      ",
        "                                      ",
        "       o        $                     ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                $                     ",
        "                               ---    ",
        "                            ---===    ",
        "                $        ---===       ",
        "                      ---===          ",
        "                   ---===             ",
        "    ---------------===                ",
        "    ===============                   ",
    ], {

        width: 15,
        height: 2,

        "-": () => [
            sprite("floor_solid"),
            area(),
            solid(),
            scale(0.35),
            layer("background"),
        ],

        "_": () => [
            sprite("floor_solid"),
            area(),
            scale(0.35),
            layer("background"),
            "top_ladder",
        ],

        "=": () => [
            sprite("floor"),
            scale(0.35),
            layer("background"),
        ],

        "$": () => [
            sprite("ladder"),
            area(),
            scale(0.35),
            layer("background"),
        ],

        "o": () => [
            sprite("oil_drum"),
            area(),
            scale(0.35),
            layer("background"),
        ],

        "4": () => [
            sprite("straight_barrel_x4"),
            area(),
            scale(0.35),
            layer("background"),
        ],
    });

    /* floor appear/disappear when climbing */
    onUpdate("top_ladder", (top_ladder) => {
        top_ladder.solid = top_ladder.pos.dist(mario.pos) >= 45
    })

    /*barrels*/

    /*spawn barrels*/
    function spawnBarrel() {
        add([
            sprite("barrel"),
            area(),
            body(),
            pos(190, 70),
            scale(0.16),
            'barrel',
        ]);

        wait(rand(3, 6), spawnBarrel);  /*spawn randomly between 3 to 6 seconds*/
    }

    spawnBarrel();

    /*destroy barrels if out of map*/
    onUpdate("barrel", (barrel) => {
        if (barrel.pos.y >= fall) {
            destroy(barrel);
        }
    })
    onCollide("oil_drum","barrel", (barrel) => {
        addExplosion()
        destroy(barrel)
    })

    /*barrels pattern*/
    onUpdate("barrel", (barrel) => {
        if (barrel.pos.y < 80) {
            barrel.move(60, 0)
        }

        else if (barrel.pos.y > 120 && barrel.pos.y < 145) {
            barrel.move(-60, 0)
        }

        else if (barrel.pos.y > 185 && barrel.pos.y < 210) {
            barrel.move(60, 0)
        }

        else if (barrel.pos.y > 250 && barrel.pos.y < 275) {
            barrel.move(-60, 0)
        }

        else if (barrel.pos.y > 315 && barrel.pos.y < 340) {
            barrel.move(60, 0)
        }

        else if (barrel.pos.y > 385) {
            barrel.move(-60, 0)
        }
    })

    /*lose life if mario collides with any barrel*/
    onUpdate("barrel", (barrel) => {
        if (barrel.isTouching(mario)) {
            /*lose life*/
            mario.hurt(1);
            addKaboom(mario.pos);
            destroy(barrel);

            /*remove hp on counter*/
            hp.value -= 1
            hp.text = "HP:" + hp.value
        }
    })

    /*lose conditions*/

    /*lose if mario is out of map*/
    mario.action(() => {
        if (mario.pos.y >= fall) {
            play("death", {
                volume:0.3
            }),
            bgmusic.pause()    
            go("lose", score)
        }
    })

    /*lose when hp reaches 0*/
    mario.onDeath(() => {
        play("death", {
            volume:0.3
        }),
        bgmusic.pause()
        go("lose", score)
    })

    /*win conditions*/
    mario.onCollide("princess", () => {
        bgmusic.pause()
        play("win2", {
            volume:0.3
        }),
        go("win", score);
    });

    /*score counter*/
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(445, 35),
        scale(0.25),
    ]);

    /* score refresh every frame */
    // onUpdate(() => {
    //     score++;
    //     scoreLabel.text = score;
    // });

    /*hp counter*/
    const hp = add([
        text("HP: 3"),
        pos(445, 15),
        { value: 3 },
        scale(0.25),
    ])
});

/*lose scene*/
scene("lose", (score) => {
    add([
        sprite("standing_donkey_kong"),
        pos(width() / 2, height() / 2 - 80),
        scale(0.5),
        origin("center"),
    ]);

    /*display score*/
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(1.5),
        origin("center"),
    ]);

    /*play again*/
    add([
        text("Press 'Enter' to play again!"),
        pos(width() / 2, height() / 2 + 160),
        scale(0.40),
        origin("center"),
    ]);

    /*go back to game*/
    onKeyPress("enter", () => go("intro"));
})

/*win scene*/
scene("win", (score) => {
    add([
        sprite("running_princess_right_2"),
        pos(width() / 2 - 160, height() / 2 - 80),
        scale(1),
        origin("center"),
    ]);

    add([
        sprite("heart"),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        origin("center"),
    ]);

    add([
        sprite("running_mario_left_2"),
        pos(width() / 2 + 160, height() / 2 - 80),
        scale(1),
        origin("center"),
    ]);

    /*display score*/
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(1.5),
        origin("center"),
    ]);

    /*play again*/
    add([
        text("Press 'Enter' to play again!"),
        pos(width() / 2, height() / 2 + 160),
        scale(0.40),
        origin("center"),
    ]);

    /*go back to game*/
    onKeyPress("enter", () => go("intro"));
})

var walk = play("walk", {
    volume:.2,
    loop: false
})
var imusic = play("intro", {
    volume:.3,
    loop: true
})
var bgmusic= play("backmusic", {
    volume: .3,
    loop: true
})

go ("intro")
/*go("game")*/