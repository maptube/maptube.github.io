/**
 * LightDrone.js
 * Encapsulation of a drone which has a coloured light that turns on and off
 */

import * as THREE from 'three';

export { LightDrone }

//private
let __drone__id = 0; //unique drone id counter - adds one each time a drone is created

class LightDrone {
    constructor (scene,x,y,z) {
        //console.log("LightDrone::constructor id=",__drone__id);
        this.id = __drone__id++; //should be read only
        this.colour = 0xffffff;
        this.lightIsOn = true;
        this.x = x;
        this.y = y;
        this.z = z;
        this.targetx = x;
        this.targety = y;
        this.targetz = z;
        this.isAtTarget=true;
        //threejs objects needed for rendering and scene
        this.geom = new THREE.SphereGeometry(0.08,16,8);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff } );
        this.mesh = new THREE.Mesh(this.geom,this.material);
        this.mesh.position.set(this.x,this.y,this.z);
        scene.add(this.mesh); //and add my light into the scene so that I'm visible
    }

    setLightState = (isOn) => {
        //console.log("LightDrone::setLightState "+this.id,isOn,this.mesh.material.color);
        //light on/off
        this.lightIsOn = isOn;
        //if it's off, the material colour is black - OK, it's a cheat
        //todo: proper visibility - although black is actually right because it can't just disappear from the universe
        if (this.lightIsOn)
            this.mesh.material.color.setHex(this.colour,THREE.SRGBColorSpace);
        else
            this.mesh.material.color.setHex(0x000000,THREE.SRGBColorSpace);
    }

    setLightColour = (newColour) => {
        //console.log("LightDrone::setLightColour "+this.id,newColour.toString(16));
        //change colour
        this.colour=newColour;
        if (this.lightIsOn) { //only if the light is on, otherwise it could revert from black
            this.mesh.material.color.setHex(this.colour,THREE.SRGBColorSpace);
        }
    }

    setTarget = (nx,ny,nz) => {
        //console.log("LightDrone::setTarget "+this.id,nx,ny,nz);
        this.targetx = nx;
        this.targety = ny;
        this.targetz = nz;
        this.isAtTarget=false; //todo: unless target==current pos -> error!???
    }

    //same as set target but the dx,dy,dz is a delta on the current position
    //e.g. 0,10,0 is go up 10
    setDeltaTarget = (dx,dy,dz) => {
        //console.log("LightDrone::setTarget "+this.id,dx,dy,dz);
        this.targetx = this.x+dx;
        this.targety = this.y+dy;
        this.targetz = this.z+dz;
        this.isAtTarget=false;
    }

    //todo: technically, you could just move it in the swarm tick
    tick = () => {
        //console.log("LightDrone::tick()")
        //time tick i.e. move
        if (!this.isAtTarget)
        {
            //todo: put the vector code into the setTarget so you only do it once
            //move towards the target
            let dx=this.targetx-this.x;
            let dy=this.targety-this.y;
            let dz=this.targetz-this.z;
            //need a direction unit vector so we can move evenly in the right direction
            let mag=Math.sqrt(dx*dx+dy*dy+dz*dz);
            dx/=mag;
            dy/=mag;
            dz/=mag;
            const speed=0.01;
            this.x+=dx*speed; //speed per tick
            this.y+=dy*speed;
            this.z+=dz*speed;
            //don't forget to update the mesh position
            this.mesh.position.set(this.x,this.y,this.z);
            if (mag</*0.05*/speed) this.isAtTarget=true;
        }
    }

}

