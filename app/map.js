class Map {

    constructor(tileSize){
        this.tSize = tileSize;
        this.tiles = [];
        this.start;
        this.sTiles = {};
        this.ends = [];
        this.vForm = [0, 0];
        this.colors = ["black", "white"];
        this.wIdx = 0
    }

    draw(ctx, offset, scale, stop){
        console.log("CALLED");
        const finish = this.ends.length > 0 ? this.ends[1] : null;
        let idx = 0;

        for (let y = 0; y < this.tiles.length; y++){
            if (y  * this.tSize - offset[1] > window.innerHeight/scale && this.colors[0] == this.colors[1]){ break };

            for (let x = 0; x < this.tiles[y].length; x++){
                if (x * this.tSize - offset[0] > window.innerWidth/scale && this.colors[0] == this.colors[1]){ break };

                if (this.tiles[y][x]){
                    ctx.fillStyle = this.colors[idx];
                    const tX = (x * this.tSize) - offset[0],
                          tY = (y * this.tSize) - offset[1];

                    ctx.fillRect(tX, tY, this.tSize, this.tSize);
                }else if (finish && x == finish[0] && y == finish[1]){
                    this.drawWin(ctx, offset);
                }

                idx = idx < 1 ? 1 : 0;

                if (stop && y == stop[1] && x == stop[0]){
                    break;
                }
            }

            if (stop && y == stop[1]){
                break;
            }

            idx = idx < 1 ? 1 : 0;
        }
    }

    dimen(){
        return [
            this.tiles[0].length * this.tSize,
            this.tiles.length * this.tSize
        ]
    }

    visualForm(ctx, offset, grow, scale){
        let col = this.vForm[1],
            row = this.vForm[0];

        while (col < this.tiles.length && !this.tiles[col][row]){
            if (row < this.tiles[col].length){
                row++;
            }else{
                row = 0;
                col++;
            }
        }

        this.draw(ctx, offset, scale, [row, col]);

        if (grow && col < this.tiles.length){
            if (row + 1 < this.tiles[col].length){
                this.vForm = [row + 1, col];
            }else{
                this.vForm = [0, col + 1];
            }
        }
    }

    visualComplete(){
        let end = [];

        for (let c = 0; c < this.tiles.length; c++){
            for (let r = 0; r < this.tiles[c].length; r++){
                if (this.tiles[c][r]){
                    end[0] = r;
                    if (!end[1] || end[1] < c){ end[1] = c }
                };
            }     
        }

        return (
            this.vForm[1] >= end[1] &&
            this.vForm[0] >= end[0]
        );
    }


    checkCollision(coord, dimensions){
        const width = dimensions.width,
              height = dimensions.height,
              pX = coord[0] - (width/2),
              pY = coord[1] - (height/2),
              finish = this.ends[1];

        for (let y = 0; y < this.tiles.length; y++){
            for (let x = 0; x < this.tiles[y].length; x++){
                if (this.tiles[y][x] || (x == finish[0] && y == finish[1])){
                    const tX = x * this.tSize,
                          tY = y * this.tSize,
                          lLeft = pX > tX,
                          lRight = pX < tX + this.tSize,
                          rLeft = pX + (width) > tX,
                          rRight = pX + (width) < tX + this.tSize;

                    if (lLeft && lRight || rLeft && rRight || !lLeft && !rRight){
                        const bTop = pY + (height) > tY,
                              bBottom = pY + (height) < tY + this.tSize,
                              tTop = pY > tY,
                              tBottom = pY  < tY + this.tSize;

                        if (bTop && bBottom || tTop && tBottom || !tTop && !bBottom){      
                            return {
                                'status': true, 
                                'finish': x == finish[0] && y == finish[1]
                            }
                        }
                    }
                }
            }
        }

        return {'status': false, 'finish': false};
    }

    buildBackground(size, color){
        const colors = [color, color];
        this.buildMaze(size, colors, true);
    }

    buildMaze(size, colors, skipEnds){
        const maze = new Maze(size),
              fullSize = (size * 2) + 1;

        if (colors){ this.colors = colors };
        this.vForm = [0, 0];
        maze.assemble();

        if(!skipEnds){
            this.addEnds(maze, fullSize);
        }else{
            this.sTiles = {'tiles':[], 'adjust': [0,0], 'pos': null}
        }

        this.assembleTMap(fullSize);

        for (let c = 0; c < size; c++){
            for (let r = 0; r < size; r++){

                const mTile = maze.map[c][r],
                      coord = [
                        (r * 2) + 1 + this.sTiles.adjust[0],
                        (c * 2) + 1 + this.sTiles.adjust[1]
                      ];

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

    assembleTMap(size, noEnds){
        const sTiles = this.sTiles.tiles,
              pos = this.sTiles.pos;

        for (let c = 0; c < size + sTiles.length; c++){
            this.tiles[c] = [];
            const rLen = sTiles.length > 0 ? sTiles[0].length : 0;
            console.log(rLen);
            for (let r = 0; r < size + rLen; r++){
                if(!pos){
                    this.tiles[c][r] = true;
                }else{
                    const inColStart = c >= pos[1] && c < pos[1] + sTiles.length,
                      inRowStart = r >= pos[0] && r < pos[0] + sTiles[0].length;

                    if (inColStart && inRowStart){
                        this.tiles[c].push(sTiles[c - pos[1]][r - pos[0]]);
                    }else if (pos[0] === 0 || pos[0] == size){
                        this.tiles[c].push((inColStart || !inRowStart) && c < size);
                    }else if (pos[1] === 0 || pos[1] == size){
                        this.tiles[c].push((!inColStart || inRowStart) && r < size);
                    }

                }
            }
        }

        for (let i = 0; i < this.ends.length; i++){
            const c = this.ends[i][1] + this.sTiles.adjust[1],
                  r = this.ends[i][0] + this.sTiles.adjust[0]

            this.tiles[c][r] = false;
            if (i > 0){this.ends[i] = [r, c]}
        }
    }

    addEnds(maze, fSize){
        this.ends = [];
        const ends = ['start', 'end'];
        var dir, sCoord;

        for (let x = 0; x < ends.length; x++){
            if (maze[ends[x]]){
                const end = maze[ends[x]],
                    eCoord = [end[0] * 2 + 1, end[1] * 2 + 1];
                if (end[0] === 0){
                    if (ends[x] == 'start'){
                        dir = 'left'
                        this[ends[x]] = [
                            eCoord[0] * this.tSize + this.tSize, 
                            eCoord[1] * this.tSize
                        ];
                    }

                    this.ends.push([eCoord[0] - 1, eCoord[1]]);
                }else if (end[0] == maze.size - 1){
                    if (ends[x] == 'start'){
                        dir = 'right';
                        this[ends[x]] = [
                            eCoord[0] * this.tSize + (this.tSize * 3),
                            eCoord[1] * this.tSize
                        ];
                    }

                    this.ends.push([eCoord[0] + 1, eCoord[1]]);
                }else if (end[1] === 0){
                    if (ends[x] == 'start'){
                        dir = 'top';
                        this[ends[x]] = [
                            eCoord[0] * this.tSize,
                            eCoord[1] * this.tSize + this.tSize
                        ];
                    }

                    this.ends.push([eCoord[0], eCoord[1] - 1]);
                }else if (end[1] == maze.size - 1){
                    if (ends[x] == 'start'){
                        dir = 'bottom';
                        this[ends[x]] = [
                            eCoord[0] * this.tSize,
                            eCoord[1] * this.tSize + (this.tSize * 3)
                        ];
                    }


                    this.ends.push([eCoord[0], eCoord[1] + 1]);
                }

                if (ends[x] == 'start'){ sCoord = [eCoord[0], eCoord[1]]}
            }
        }

        this.setStartTiles(dir, sCoord, fSize);
    }

    drawWin(ctx, offset){
        const color = ['#add9e6', '#0490d6'][this.wIdx],
              x = this.ends[1][0] * this.tSize + this.tSize/2 - offset[0],
              y = this.ends[1][1] * this.tSize + this.tSize/2 - offset[1],
              radius = this.tSize * .7;

        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        this.wIdx = this.wIdx > 0 ? 0 : 1
    }
    setStartTiles(dir, coord, size){
        this.sTiles.tiles = [];
        this.sTiles.pos = [];
        this.sTiles.adjust = [0, 0];

        for (let c = 0; c < 5; c++){
            const row = [];
            for (let r = 0; r < 5; r++){
                row.push(c < 1 || c > 3 || r < 1 || r > 3);
            }
            this.sTiles.tiles.push(row);
        }

        switch (dir){
            case 'top':
                this.sTiles.pos = [coord[0] - 2, 0]
                this.sTiles.adjust = [0, this.sTiles.tiles.length];

                for (let r = 1; r < 4; r++){
                    this.sTiles.tiles[4][r] = false;
                };

                break;

            case 'bottom':
                this.sTiles.pos = [coord[0] - 2, size]

                for (let r = 1; r < 4; r++){
                    this.sTiles.tiles[0][r] = false;
                };

                break;

            case 'right':
                this.sTiles.pos = [size, coord[1] - 2];

                for (let c = 1; c < 4; c++){
                    this.sTiles.tiles[c][0] = false;
                };

                break;

            case 'left':
                this.sTiles.pos = [0, coord[1] - 2];
                this.sTiles.adjust = [this.sTiles.tiles[0].length, 0];

                for (let c = 1; c < 4; c++){
                    this.sTiles.tiles[c][4] = false;
                };

                break;
        }
    }

    pickTColors(){
        const randomIDX = Math.floor(Math.random() * this.colorSet.length);

        if (this.colorHistory.length == this.colorSet.length){    
            this.colorHistory = [
                this.colorHistory[this.colorHistory.length - 1]
            ];
        }

        for (var i = 0; i < this.colorHistory.length; i++){
            if (this.colorHistory[i] == randomIDX){
                return this.pickTColors();
            }
        }

        this.colorHistory.push(randomIDX);
        return this.colorSet(this.colorHistory[randomIDX]);
    }
}