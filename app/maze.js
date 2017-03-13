class Maze{

    constructor(size){
        this.map = [];
        this.size = size > 5 ? size : 5;
        this.start;
        this.end;
        this.directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ]
    }

    assemble(){
        for (let c = 0; c < this.size; c++){
            var row = [];

            for (var r = 0; r < this.size; r++){
                row.push({
                    'carve': [], 
                    'visited': false
                })
            }

            this.map.push(row);
        }

        this.carve(0, 0);
        this.pickEnds();
    }

    carve(x, y){
        this.map[y][x].visited = true;
        shuffle(this.directions);

        for (let i = 0; i < this.directions.length; i++){
            const dir = this.directions[i],
                newX = x + dir[0],
                newY = y + dir[1],
                inXBounds = newX < this.size && newX >= 0,
                inYBounds = newY < this.size && newY >= 0;

            if (inXBounds && inYBounds && !this.map[newY][newX].visited){
                this.map[y][x].carve.push(dir);
                this.carve(newX, newY);
            }
        }
    }

    pickEnds(){
        if (!this.start || !this.end){

            const sides = [
                [0, null], 
                [this.size - 1, null], 
                [null, 0], 
                [null, this.size - 1]
            ], mSize = this.size;

            let side = sides[Math.floor(Math.random() * sides.length)];

            for (let i = 0; i < side.length; i++){
                if (side[i] !== 0 && !side[i]){
                    side[i] = Math.floor(Math.random() * (mSize - 1)) + 1;
                }
            }

            const endTile = this.map[side[1]][side[0]];

            if (endTile && endTile.visited && !this.start){
                this.start = side;
                console.log(side);
            }else if (endTile && endTile.visited){
                this.end = side;
            }

            this.pickEnds();
        }
    }
};

function shuffle(a){
    for (var i = a.length - 1; i >= 0; i--){
        var index = Math.floor(Math.random() * (i + 1)),
            temp = a[index];

        a[index] = a[i];
        a[i] = temp;
    }
}