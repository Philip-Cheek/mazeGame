"use strict";

class Game {

    constructor(config){
        this.canvas = document.getElementById(config.canvasID);
        this.context = this.canvas.getContext('2d');
        this.map = new Map(130);
        this.player = new Player([0, 0], {
            'player': 'white',
            'history': '#4c6b8a'
        });
        this.viewPort = new ViewPort(50);
        this.sRate = 800;
        this.stamp = true;
        this.colorHistory = [];
        this.difficulty = 5;
        this.colorSet = [];
        this.gameOver;
        this.scale;
        this.socket = config.socket;
        this.initASettings(config)
    }

    initASettings(config){
        const self = this;
        this.colorSet = [
            ['#69111e', '#7D1424'],
            ['#27ae60', '#2ecc71'],
            ['#e67e22', '#d35400'],
            ['#95a5a6', '#7f8c8d'],
            ['#9b59b6', '#8e44ad']
        ]

        this.gameOver = new OverMenu(config, function(){
            self.gameReset();
        });

        this.socket.on('incomingMaze', function(maze){
            self.run(maze);
        });
    }

    start(){
        this.socket.emit('requestMaze', this.difficulty);
    }

    run(maze){
        const self = this,
              colors = this.pickTColors();

        this.map.buildMaze(this.difficulty, colors, maze);
        this.player.reSet();
        this.sRate = 4000;
        window.requestAnimFrame(function(){
            self.player.listen = false;
            self.introLoop()
        });

    }

    introLoop(){
        const self = this;

        this.setScreen();
        this.context.save();
        this.context.scale(this.scale, this.scale);

        const vCenter = [
            this.map.dimen()[0]/2,
            this.map.dimen()[1]/2
        ], offset = this.viewPort.offset(vCenter, this.scale);

        this.map.visualForm(this.context, offset, this.stamp, this.scale);
        this.stamp = !this.stamp;
        this.context.restore();

        if (this.map.visualComplete()){
            this.player.listen = false;
            this.setPCoordAtStart();
            window.requestAnimFrame(function(){
                self.segueLoop();
            });
        }else{
             window.requestAnimFrame(function(){
                self.introLoop();
             });
        }
    }

    segueLoop(){
        const self = this,
              oldScale = this.scale;

        this.sRate *= .99;
        this.setScreen();
        const percent = (4000 - this.sRate)/(4000 - 800)
        const offset = this.viewPort.zoom(
            this.player.coord,
            this.scale,
            percent
        );


        this.context.scale(this.scale, this.scale);
        this.drawScreen(offset);

        window.requestAnimFrame(function(){
            if (self.sRate > 800){
                self.segueLoop();
            }else{
                self.player.listen = true;
                self.player.listenForMovement();
                self.gameLoop();

            }
        });
    }

    gameLoop(){
        this.setScreen();
        const self = this,
              offset = this.viewPort.offset(
                this.player.coord, 
                this.scale
              ),
              pCollision = this.map.checkCollision(
                this.player.coord,
                this.player.dimen
              );

        if (pCollision.status && pCollision.finish){
            this.win();
            return;
        }else if (pCollision.status){
            this.setPCoordAtStart();
        }

        this.context.scale(this.scale, this.scale);
        this.drawScreen(offset)

        window.requestAnimFrame(function(){
            self.gameLoop()
        });
    }


    drawScreen(offset){
        const ctx = this.context,
              scale = this.scale;

        this.map.draw(ctx, offset, scale);
        this.player.handleHistory(ctx, offset, scale);
        this.player.draw(ctx, offset, scale);
    }

    win(){
        this.player.reSet(true);
        this.finishLoop();
    }

    finishLoop(){
        const self = this;
        this.sRate *= 1.01;

        this.setScreen();
        const vCenter = [
            this.map.dimen()[0]/2,
            this.map.dimen()[1]/2
        ];

        const percent = (this.sRate - 800)/(4000 - 800),
              offset = this.viewPort.zoom(
                vCenter,
                this.scale,
                percent
              );

        this.context.scale(this.scale, this.scale);
        this.drawScreen(offset);

        window.requestAnimFrame(function(){
            if (self.sRate < 4000){
                self.finishLoop();
            }else{
                self.difficulty += 2;
                self.start();
            }
        });
    }

    gameReset(){
        this.difficulty = 5;
        this.start();
    }

    setScreen(){
        this.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.scale = window.innerHeight/this.sRate;

    }

    setPCoordAtStart(){
        this.player.coord = [this.map.start[0], this.map.start[1]];
    }

    pickTColors(){
        const randomIDX = Math.floor(Math.random() * this.colorSet.length);

        if (this.colorHistory.length == this.colorSet.length){    
            this.colorHistory = [
                this.colorHistory[this.colorHistory.length - 1]
            ];
        }

        for (var i = 0; i < this.colorHistory.length; i++){
            if (this.colorHistory[i] == randomIDX){
                return this.pickTColors();
            }
        }

        this.colorHistory.push(randomIDX);
        return this.colorSet[randomIDX];
    }
}