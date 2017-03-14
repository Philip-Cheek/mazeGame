class Player { 

    constructor(initCoord){
        this.coord = initCoord;
        this.speed = 8;
        this.maxDistance = 500;
        this.pointer = [0, 0];
        this.dimen = {
            'width': 60,
            'height': 60
        };
        this.history = [];
        this.listen = false;
    }

    draw(ctx, scale, offset){
        const x = (this.coord[0] - (this.dimen.width/2) - offset[0]), 
              y = (this.coord[1] - (this.dimen.width/2) - offset[1]);

        this.handleHistory(ctx, offset, scale);
       
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, this.dimen.width, this.dimen.height);
        ctx.restore();

        this.updateCoord(scale, offset, ctx);
    }

    reSet(){
        this.history = [];
        this.listen = !this.listen;
        this.pointer = [null, null];
        console.log(this.listen);
    }

    listenForMovement(){
        console.log("IN",this.listen);
        if (!this.listen){
            this.listen = true;
            return;
        }

        const self = this;

        document.addEventListener('mousemove', function(e){
            if (self.listen){ self.pointer = [e.x, e.y] };
        });

        document.addEventListener('mouseout', function(e){
            self.pointer = [null, null];
        });
    }

    handleHistory(ctx, offset, scale){
        const bounds = [
            window.innerWidth * -0.5,
            window.innerHeight * -0.5,
            window.innerWidth * 1.5,
            window.innerHeight * 1.5
        ], c = this.coord;

        let novel = true;

        ctx.save();
        ctx.fillStyle = '#4c6b8a';

        for (let i = this.history.length - 1; i >= 0; i--){
            const h = this.history[i],
                      x = (h[0] - offset[0]),
                      y = (h[1] - offset[1]),
                      inXBounds = x * scale > bounds[0] && x * scale < bounds[2],
                      inYBounds = y * scale > bounds[1] && y * scale < bounds[3];

            if (inXBounds && inYBounds){
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, 2 * Math.PI);
                ctx.fill();
            }

            if (novel){ 
                const dist = Math.sqrt(
                    Math.pow(c[0] - h[0], 2) + Math.pow(c[1] - h[1], 2)
                );

                novel = dist > 4;
            }
        }

        ctx.restore();

        if (novel){
            this.history.push([this.coord[0], this.coord[1]]);
        } 
    }

    updateCoord(scale, offset, ctx){
        if (!this.pointer[0] || !this.pointer[1]){
            return;
        };

        const maxDist = this.maxDistance,
              pointer = [
                this.pointer[0]/scale + offset[0],
                this.pointer[1]/scale + offset[1]
              ], 
              pCoord = [
                this.coord[0],
                this.coord[1]
              ],


              xDist = pointer[0] - pCoord[0],
              yDist = pointer[1] - pCoord[1],
              dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)),

              speed = dist <  maxDist ? this.speed * (dist/maxDist) : this.speed,
              angle = dist > 0 ? Math.asin(yDist/dist) : 0;

        let xVelocity = speed * Math.cos(angle),
            yVelocity = speed * Math.sin(angle);

        if (pointer[0] < this.coord[0]){ xVelocity *= -1 };

        this.coord[0] += xVelocity;
        this.coord[1] += yVelocity;
    }
}