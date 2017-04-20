"use strict";

class TimeTrial extends Game {

	constructor(config){
		super(config);
		const self = this;
		this.clock = new Clock(config.clockID, config.addID);
		this.gameOver = new OverMenu(config, true, function(){
            self.gameReset();
        });
	}

	run(maze){
		if (!maze){ 
			return;
		}else if (this.difficulty > 5){
            this.clock.addTime(7 * 2);
        }

		this.clock.showTime();
		super.run(maze);
	}

	introLoop(){
		if (this.clock.isAdd){ 
			this.clock.animAdd() 
		}

		super.introLoop();
	}

	gameLoop(){
		this.clock.tickTime();

		if (this.clock.outOfTime()){
            this.player.listen = false;
            this.gameOver.showScreen('lose');
            return;
        }

        super.gameLoop();
	}

	gameReset(){
		this.clock.reSet();
		super.gameReset();
	}
}