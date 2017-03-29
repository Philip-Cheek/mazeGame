"use strict";

class Clock{
	constructor(clockID, addID, startTime, interval){
		this.clock = document.getElementById(clockID);
		this.add = document.getElementById(addID);
		this.time = startTime ? startTime : 15;
		this.left = this.time;
		this.interval = interval ? interval * 1000: 1000;
		this.addTop = 18;
		this.stamp;
		this.fSize = 4;
		this.isAdd = false;
	}


	outOfTime(){
		if (this.left < 0){
			this.clock.style.display = 'none';
			return true;
		}

		return false
	}

	addTime(amount){
		const self = this;

		this.left += amount
		this.add.innerHTML = "+" + amount.toString();
		this.addTop = 18;
		this.isAdd = true;
		this.add.style.opacity = '0'
		this.add.style.display = 'initial';
	}

	animAdd(){
		const self = this,
			  dist = (18 - 8)/2, mid = (18 + 8)/2,
		      opVal = 1 - Math.abs(mid - this.addTop)/dist;

		this.add.style.top = this.addTop.toString() + '%'
		this.add.style.opacity = opVal;
		this.addTop -= .15;

		if (this.addTop < 8){
			this.isAdd = false;
			this.add.style.display = 'none';
		}
	}

	reSet(time){
		if (time){ this.time = time }
		this.left = this.time;
	}

	showTime(){
		this.clock.style.display = 'initial';
        this.clock.innerHTML = this.left.toString();
        this.clock.style.color = 'white'
        this.clock.style.fontSize = '3em';
	}

	tickTime(){
        if (!this.stamp){
            this.stamp = new Date();
        }else if (new Date() - this.stamp >= this.interval){
            this.stamp = new Date();
            this.left -= this.interval/1000;
            this.clock.innerHTML = this.left.toString();
            if (this.left < 11) { this.fSize = 4 };
        }

        if (this.left < 11){
        	this.clock.style.fontSize
        	this.clock.style.fontSize = this.fSize.toString() + 'em';
        	this.fSize -= .03;
        }
	}
}

	// addTime(){
	// 	this.addTop *= .98;
	// 	this.add.style.top = this.addTop.string();
	// }