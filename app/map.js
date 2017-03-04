class Map {

    constructor(tileSize){
        this.tSize = tileSize;
        this.tiles = [];
        this.history = [];
        this.start;
        this.end;
    }

    draw(ctx, offset){
        ctx.save();

        for (let y = 0; y < this.tiles.length; y++){
            for (let x = 0; x < this.tiles[y].length; x++){
                if (this.tiles[y][x]){
                    if (x % 2 === 0 && y % 2 === 0){
                        ctx.fillStyle = '#3D1860'
                    }else{
                        ctx.fillStyle = '#643579'
                    }
                    const tX = (x * this.tSize) - offset[0],
                          tY = (y * this.tSize) - offset[1];

                    ctx.fillRect(tX, tY, this.tSize, this.tSize);
                }
            }
        }

        ctx.restore();
    }

    buildMaze(size){
        const maze = new Maze(size),
              fullSize = (size * 2) + 1;

        maze.assemble();
        this.assembleTMap(fullSize);
        this.addEnds(maze, fullSize);

        for (let c = 0; c < size; c++){
            for (let r = 0; r < size; r++){

                const mTile = maze.map[c][r],
                      coord = [(r * 2) + 1, (c * 2) + 1];

                if (mTile && mTile.visited){

                    this.tiles[coord[1]][coord[0]] = false;

                    for (let i = 0; i < mTile.carve.length; i++){

                        const cCoord = [
                            coord[0] + mTile.carve[i][0], 
                            coord[1] + mTile.carve[i][1]
                        ];

                        this.tiles[cCoord[1]][cCoord[0]] = false;
                    }
                }
            }
        }
    }

    assembleTMap(size){
        for (let c = 0; c < size; c++){
            this.tiles[c] = [];

            for (let r = 0; r < size; r++){
                this.tiles[c].push(true);
            }
        }
    }

    addEnds(maze, fSize){
        const ends = ['start', 'end'];

        for (let x = 0; x < ends.length; x++){
            if (maze[ends[x]]){
                const end = maze[ends[x]],
                    eCoord = [end[0] * 2 + 1, end[1] * 2 + 1];

                if (end[0] === 0){
                    this.tiles[eCoord[1]][eCoord[0] - 1] = false;

                    this[ends[x]] = [
                        eCoord[0] * (this.tSize * .95), 
                        eCoord[1] * this.tSize
                    ];

                }else if (end[0] == maze.size - 1){
                    this.tiles[eCoord[1]][eCoord[0] + 1] = false;

                    this[ends[x]] = [
                        eCoord[0] * (this.tSize * 1.05), 
                        eCoord[1] * this.tSize
                    ];


                }else if (end[1] === 0){
                    this.tiles[eCoord[1] - 1][eCoord[0]] = false;

                    this[ends[x]] = [
                        eCoord[0] * this.tSize, 
                        eCoord[1] * (this.tSize * .95)
                    ];


                }else if (end[1] == maze.size - 1){
                    this.tiles[eCoord[1] + 1][eCoord[0]] = false;

                    this[ends[x]] = [
                        eCoord[0] * this.tSize,
                        eCoord[1] * (this.tSize * 1.05)
                    ];
                }
            }
        }
    }
}