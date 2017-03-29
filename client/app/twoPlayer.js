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

	gameLoop(){
		const mode = this;

		if (this.enemy.finish){
            this.player.listen = false;
            this.gameOver.showScreen();
            return;
        }

        const sendData = {
        	'room': this.roomID,
        	'coord': this.player.coord
        }

        this.socketEmit('updatePlayerCoord', sendData);
        super.gameLoop();
	}

	drawScreen(offset){
		this.enemy.draw(this.context, offset, scale);
		super.drawScreen(offset);
	}

	win(){
		const id = this.roomID;
		this.socketEmit("playerWin", id);
        this.player.listen = false;
	}

	communicateMovement(){
		const self = this;

		this.socket.on('receiveEnemyUpdate', function(data){
			self.enemy.coord = data.coord;
			self.enemy.history.push(data.history);
		});

		this.socket.on('enemyFinish', function(){
			self.enemyFinish = false;
		});
	}
}