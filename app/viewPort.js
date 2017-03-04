class ViewPort {

    constructor(maxDist){
        this.coord = [0, 0];
        this.maxDist = maxDist;
    }

    offset(pCoord, scale){
        const center = [
            this.coord[0] + (window.innerWidth/2)/scale,
            this.coord[1] + (window.innerHeight/2)/scale
        ], 
            maxDist = this.maxDist * scale,
            xDist = pCoord[0] - center[0],
            yDist = pCoord[1] - center[1],
            distance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));

        if (distance > maxDist){
            const angle = Math.asin(yDist/distance);
            let xOffset = Math.cos(angle) * maxDist,
                yOffset = Math.sin(angle) * maxDist;

            if (pCoord[0] < center[0]){ xOffset *= -1; }

            const mX = center[0] + xOffset,
                  mY = center[1] + yOffset;

            this.coord[0] += pCoord[0] - mX
            this.coord[1] += pCoord[1] - mY;
        }

        return this.coord;
    }
};