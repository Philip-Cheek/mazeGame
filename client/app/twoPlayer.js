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
		const initID = this.roomID.split('#')[0];
		this.communicateMovement()
		if (initID != this.socket.id){
			// const self = this;

			window.requestAnimFrame(function(){
			// 	const w = self.canvas.width,
			// 	      h = self.canvas.height;

			// 	self.context.clearRect(0,0 w, h);
			});

			return;
		}

		const data = {
			'size': this.difficulty,
			'room': this.roomID
		};

		console.log("ROOMID", this.roomID, "initID", initID);

        this.socket.emit('requestMazeForRoom', data);
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
		console.log("COO", this.enemy.coord);
		this.enemy.draw(this.context, offset, this.scale);
		super.drawScreen(offset);
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