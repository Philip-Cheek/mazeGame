"use strict";

class App {

	constructor(config){
		this.config = config;
		this.canvas = document.getElementById(config.canvasID);
		this.context = this.canvas.getContext('2d');
		this.timeTrial = false;
		this.twoPlayer = false;
	    this.menu;
	    this.setMenu();
	}

	setMenu(){
		const self = this;

		this.menu = new HomeMenu(this.config, {
			time: function(){
				self.timeTrial = true 
			},
			two: function(roomID){ 
				self.twoPlayer = roomID;
			}
		});
	}

	run(inFrame){
		if (this.timeTrial){
			const game = new TimeTrial(this.config);
			game.start();
		}else if (this.twoPlayer){
			const roomID = this.twoPlayer,
			      game = new TwoPlayer(this.config, this.twoPlayer);

			console.log("what?");
			game.start();
		}else{
			const self = this;
			if (inFrame){ this.menu.animate() };

			window.requestAnimFrame(function(){
				self.run(true);
			});
		}
	}
};
