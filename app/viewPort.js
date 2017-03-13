class ViewPort {

    constructor(maxDist){
        this.coord = [0, 0];
        this.maxDist = maxDist;
        this.zChange = .9
    }

    offset(pCoord, scale, cMax){
        const center = this.getCenter(scale),
              maxDist = cMax ? cMax : this.maxDist * scale,
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

        if (!cMax && this.zMax){ this.zMax = null}
        return this.coord;
    }

    zoom(zCoord, scale, zRate){
        const vCoord = this.getCenter(scale),
              xDist = zCoord[0] - vCoord[0],
              yDist = zCoord[1] - vCoord[1],
              dist = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));

        let cMax = dist - dist * zRate > 15 ? dist * zRate : dist - 15;
        if (cMax < 0){ cMax = 0}


        return this.offset(
            zCoord, scale, cMax
        );
    }

    getCenter(scale){
        return [
            this.coord[0] + (window.innerWidth/2)/scale,
            this.coord[1] + (window.innerHeight/2)/scale
        ];
    }
}