"use strict";

class TwoPlayer extends Game {

	constructor(config, roomID){
		super(config);
		this.enemy = new Player([0, 0], {
            'player': 'gray',
            'history': 'gray'
		});

		this.roomID = roomID;
		this.gameOver = new OverMenu(config, false);
		this.scoreBoard = new ScoreBoard(config.scoreLeft, config.scoreRight, config.scoreBoard);
		this.communicateMovement();
	}

	run(maze){
		this.enemy.reSet();
		super.run(maze);
	}
	
	start(){
		const initID = this.roomID.split('#')[0],
		      self = this;

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
		const oStat = this.scoreBoard.over();
		if (oStat){
            this.gameOver(oStat);
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
		this.socket.emit("playerWin", this.roomID);
        this.scoreBoard.scorePoint('left');
        this.difficulty += 2;
        if (!this.scoreBoard.over()){
        	this.socket.emit('requestMazeForRoom', {
				'size': this.difficulty,
				'room': this.roomID
			});
        }
	}

	communicateMovement(){
		const self = this;

		this.socket.on('enemyUpdate', function(coord){
			self.enemy.coord = coord;
		});

		this.socket.on('enemyFinish', function(){
			self.scoreBoard.scorePoint('right');
		});
	}
}