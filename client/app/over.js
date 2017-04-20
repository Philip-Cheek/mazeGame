"use strict";

class OverMenu {

	constructor(config, restart, rCallback){
		this.overlay = document.getElementById(config.overlay);
		this.titles = {
            'win': document.getElementById(config.winID),
            'lose': document.getElementById(config.loseID)
        }
		this.menu = document.getElementById(config.overMenu);
		this.homeButton = document.getElementById(config.home);
        if (restart){ this.restart = rCallback };
		this.oVal = .01;
		this.restartButton = document.getElementById(config.restart);
		this.setMenu(restart);
	}

	setMenu(restart){
		const s = this;

		this.homeButton.onclick = function(){
			window.location.href = '/';
		}

        if (restart){
            this.restartButton.style.display = 'initial';
            this.restartButton.onclick = function(){
                s.overlay.style.opacity = 0;
                s.menu.style.opacity = 0;
                s.titles.win.style.display = 'none';
                s.titles.lose.style.display = 'none';
                s.oVal = .01;

                s.restart();
            }
        }else{
            this.restartButton.style.display = 'none';
        }

		this.overlay.style.opacity = 0;
		this.menu.style.opacity = 0;
		this.overlay.style.display = 'initial';
		this.menu.style.display = 'none';
		this.titles.win.style.display = 'none';
        this.titles.lose.style.display = 'none';
	}

	showScreen(state){
        if (state != 'win' && state != 'lose'){
            return;
        }

        const title = this.titles[state],
		      self = this;
        
		title.style.display = 'initial';
		this.menu.style.display = 'initial'

		window.requestAnimFrame(function(){
			self.animate();
		});
	}

	animate(){
		const o = this.oVal;
		this.menu.style.opacity = o * 2 < 1 ? 0 * 2 : 1;
		this.overlay.style.opacity = o;
		this.oVal += .03;
		
		if (o < .5){
			const self = this;
			window.requestAnimFrame(function(){
				self.animate();
			});
		}
	}

}