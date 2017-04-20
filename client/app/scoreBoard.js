class ScoreBoard {
	constructor(leftID, rightID, scoreBoardID){
		this.score = {'left': 0, 'right': 0}
		this.left = document.getElementById(leftID);
		this.right = document.getElementById(rightID);

		document.getElementById(scoreBoardID).style.display = 'initial';
	}

    scorePoint(dir){
		if (dir != 'left' && dir != 'right'){ return };

		this.score[dir]++;
		this[dir].innerHTML = this.score[dir].toString();
	}

	over(){
		if (this.score.right - this.score.left > 1){
			return 'lose';
		}else if (this.score.left - this.score.right > 1){
			return 'win';
		}else{
			return false;
		}
	}
}