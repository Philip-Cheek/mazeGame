class Game {

    constructor(canvasID){
        this.canvas = document.getElementById('canvas'),
        this.context = this.canvas.getContext('2d');
        this.camera = [0, 0];
        this.map = new Map(130);
        this.player = new Player([0, 0]);
        this.viewPort = new ViewPort(50);
        this.sRate = 800;
        this.scale;
        this.stamp = true;
    }

    start(){
        const self = this;

        // this.player.listenForMovement();
        this.map.buildMaze(10);
        this.stamp = 0
        // this.setPCoordAtStart();
        this.sRate = 4000;

        window.requestAnimFrame(function(){
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

        this.map.visualForm(this.context, offset, this.stamp);

        this.stamp = !this.stamp;
        this.context.restore();

        if (this.map.visualComplete()){
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
        const offset = this.viewPort.zoom(
            this.player.coord,
            this.scale,
            .935
        );


        this.context.save();
        this.context.scale(this.scale, this.scale);
        this.map.draw(this.context, offset);
        this.player.draw(this.context, this.scale, offset);
        this.context.restore;

        window.requestAnimFrame(function(){
            if (self.sRate > 800){
                self.segueLoop();
            }else{
                self.player.listenForMovement();
                self.gameLoop();

            }
        });
    }

    gameLoop(){
        this.setScreen();

        const self = this;

       
        
        const offset = this.viewPort.offset(
                this.player.coord, 
                this.scale
              );

        const pCollision = this.map.checkCollision(
                this.player.coord,
                this.player.dimen
              );


        if (pCollision){
            this.setPCoordAtStart();
        }

        this.context.save();
        this.context.scale(this.scale, this.scale);

        this.map.draw(this.context, offset);
        this.player.draw(this.context, this.scale, offset);

        this.context.restore();


        window.requestAnimFrame(function(){
            self.gameLoop()
        });


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
}