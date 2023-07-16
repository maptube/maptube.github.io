/**
 * Swarm.js
 * Manage a swarm of drones as a collection.
 * Used to create the initial pattern and control them in flight.
 * NOTE: x is the x axis, but y in this sense is along z so the grid is sitting
 * on the ground. It's meaningless once they start moving anyway.
*/

import { LightDrone } from '/js/LightDrone.js';

export { Swarm }

class Swarm
{
    constructor() {
        this.numX = -1;
        this.numY = -1;
        this.drones = [];
        this.allAtTarget=true;
    }

    spawn = (scene,nx,ny) => {
        //todo: delete existing drones? you can't really just delete them in real life!

        //assumes a default spacing of 1 metre and centred on the origin as ground level
        this.numX=nx;
        this.numy=ny;
        for (var x=0; x<nx; x++) {
            for (var y=0; y<ny; y++) {
                let drone = new LightDrone(scene,-nx/2+x,0,-ny/2+y);
                this.drones.push(drone);
            }
        }

    }

    tick = () => {
        //console.log("swarm::tick ",this.drones.length);
        this.allAtTarget=true;
        for (var i=0; i<this.drones.length; i++)
        {
            this.drones[i].tick();
            //track whether all the drones have arrived at target
            if (!this.drones[i].isAtTarget)
                this.allAtTarget=false;
            //console.log(drone);
        }
    }

    //todo: flying functions...

    setPattern = (pattern,x,y,z) => {
        //set drones to given pattern with top left at (x,y,z)
        //note: orientation is vertical, so drones are in the xy plane
        //pattern is [ "O..O", "O..O", ... ]
        console.log("swarm::setPattern", pattern);
        var drone_num=0;
        var px=x, py=y;
        for (let j=0; j<pattern.length; j++) {
            px=x;
            var line = pattern[j]; //"O....O" where "O" is a drone and "." is not
            for (let i=0; i<line.length; i++) {
                if (line.charAt(i)!='.') {
                    if (drone_num>=this.drones.length) break;
                    this.drones[drone_num].setTarget(px,py,z);
                    this.drones[drone_num].setLightState(true);
                    this.drones[drone_num].setLightColour(0xffffff);
                    ++drone_num;
                }
                px+=0.25; //spacing .. TODO... implicit!
            }
            py-=0.25; //spacing  IMPLICIT TODO!!!!
        }
        //now set the unused ones to off and put them back on the ground
        for (let i=drone_num; i<this.drones.length; i++) {
            this.drones[i].setLightState(false);
            this.drones[i].setTarget(this.drones[i].x,0.1,this.drones[i].z);
        }
    }

    compositePattern = (patterns) => {
        //take a list of patterns and roll them into one big one e.g. stick letters together
        //NOTE: this is a horizontal composite
        //ASSUMES ALL PATTERNS ARE THE SAME HEIGHT
        let compPat = [];
        for (let j=0; j<patterns[0].length; j++) //assumes all patterns same height as [0]: todo: fix!
        {
            let line=""; //just go along horizontally and add the strings together
            for (let i=0; i<patterns.length; i++) {
                line+=patterns[i][j];
            }
            compPat[j]=line;
        }
        return compPat;
    }


}