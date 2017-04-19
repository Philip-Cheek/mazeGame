"use strict";

class TwoPlayer extends Game {

	constructor(config, roomID){
		super(config);
		this.enemy = new Player([0, 0], {
            'player': 'gray',
            'history': 'gray'
		});

		this.enemyFinish = false;
		this.roomID = roomID;
	}
	
	start(){
		const initID = this.roomID.split('#')[0],
		      self = this;

		this.communicateMovement();

		if (initID == this.socket.id){
			const data = {
				'size': this.difficulty,
				'room': this.roomID
			};

        	this.socket.emit('requestMazeForRoom', data);
		}


		window.requestAnimFrame(function(){
			const w = self.canvas.width,
			      h = self.canvas.height;

			console.log(self);
			self.context.clearRect(0,0, w, h);
		});

    }

    segueLoop(){
    	if (this.enemy.coord[0] != this.map.start[0] || this.enemy.coord[0] != this.map.start[1]){
    		this.enemy.coord = [this.map.start[0], this.map.start[1]]
    	};

    	super.segueLoop();

    }

	gameLoop(){
		if (this.enemy.finish){
            this.player.listen = false;
            this.gameOver.showScreen();
            return;
        }

        const sendData = {
        	'room': this.roomID,
        	'coord': this.player.coord
        }

        this.socket.emit('updatePlayerCoord', sendData);
        super.gameLoop();
	}

	drawScreen(offset){
		const ctx = this.context,
              scale = this.scale;

        this.map.draw(ctx, offset, scale);
        this.enemy.handleHistory(ctx, offset, scale);
        this.player.handleHistory(ctx, offset, scale);
        this.enemy.draw(ctx, offset, scale);
        this.player.draw(ctx, offset, scale);
	}

	win(){
		const id = this.roomID;
		this.socket.emit("playerWin", id);
        this.player.listen = false;
	}

	communicateMovement(){
		const self = this;

		this.socket.on('enemyUpdate', function(coord){
			self.enemy.coord = coord;
		});

		this.socket.on('enemyFinish', function(){
			self.enemyFinish = false;
		});
	}
}