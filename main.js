import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';
import { DirectionalLight } from 'three';
import { TextureLoader, Texture } from 'three';

import { LightDrone } from '/js/LightDrone.js';
import { Swarm } from '/js/Swarm.js';
import { DronePatterns } from '/js/DronePatterns.js';
import { Sequencer } from '/js/Sequencer.js';

const sizex=16, sizey=8;


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
//const loader = new THREE.TextureLoader();
//scene.background = loader.load( "/img/athens1.png"); //1 and 4 .png

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//create lights
//const light = new DirectionalLight('white', 8);
//light.position.set(0, 0, 0);
const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
scene.add( ambientLight );
const pointLight = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
pointLight.position.set(0,0,5);
camera.add( pointLight );

//make the ground as a box
const geomGround = new THREE.BoxGeometry( 10, 0.1, 10 );
const matGround = new THREE.MeshBasicMaterial( { color: 0x008000 } );
const ground = new THREE.Mesh( geomGround, matGround );
ground.position.y=-0.1; // so the top of the box sits at y=0
scene.add( ground );

//add an origin point for orientation - red 1m box
const geomOrigin = new THREE.BoxGeometry(1,1,1);
const matOrigin = new THREE.MeshBasicMaterial( { color: 0xff0000 });
const origin = new THREE.Mesh( geomOrigin, matOrigin );
//scene.add( origin ); //zero, zero, zero - box is going to be partly underground though as 1x1x1


//const geometry = new THREE.SphereGeometry( 1, 16, 8 ).toNonIndexed(); //we need per face normals not indexed
//const wiregeometry = new THREE.SphereGeometry( 1, 16, 8);
//const count = geometry.attributes.position.count;
//geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );
//const material = new THREE.MeshBasicMaterial( { flatShading: false, vertexColors: true } );
//const wirematerial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
//const material = new THREE.MeshLambertMaterial({ color: 0xff0000, vertexColors: true });
//const material = new THREE.MeshStandardMaterial(
//	{ flatShading: true, vertexColors: true, wireframe: false }
//);
//const sphere = new THREE.Mesh( geometry, material );
//const wiresphere = new THREE.Mesh( wiregeometry, wirematerial);
//console.log(geometry);
//console.log("count=",count);

//var drone = new LightDrone();
//drone.tick();
let swarm = new Swarm();
swarm.spawn(scene,10,10);
//swarm.drones[11].setLightState(false);
//for (var i=0; i<100; i++)
//{
//	//swarm.drones[i].setLightState(true);
//	swarm.drones[i].setLightColour(0x000060);
//	//swarm.drones[25].setLightColour(0xff0000);
//	//swarm.drones[i].setDeltaTarget(0,5,0);
//}
//swarm.setPattern(DronePatterns.f,-5,3,0);
let pat_forward = function() {
	console.log("hello from function 1!");
	for (let i=0; i<swarm.drones.length; i++) {
		if (swarm.drones[i].lightIsOn) {
			swarm.drones[i].setDeltaTarget(0,0,4);
		}
	}
}
let pat1_kala = function() {
	console.log("hello from function 1!");
	let pat = swarm.compositePattern([
		DronePatterns.KAPPA, DronePatterns.space2,
		DronePatterns.alpha, DronePatterns.space2,
		DronePatterns.lambda, DronePatterns.space2,
		DronePatterns.alpha
	]);
	swarm.setPattern(pat,-5,3,0);
}
let pat2_genethlia = function() {
	console.log("hello from function 1!");
	let pat = swarm.compositePattern([
		DronePatterns.GAMMA, DronePatterns.space2,
		DronePatterns.epsilon, DronePatterns.space2,
		DronePatterns.ni, DronePatterns.space2,
		DronePatterns.epsilon, DronePatterns.space2,
		DronePatterns.theta, DronePatterns.space2,
		DronePatterns.lambda, DronePatterns.space2,
		DronePatterns.yiota, DronePatterns.space2,
		DronePatterns.alpha
	]);
	swarm.setPattern(pat,-5,3,0);
}
let pat3_f = function() {
	console.log("hello from function 1!");
	let pat = swarm.compositePattern([
		DronePatterns.PHI, DronePatterns.space2,
		DronePatterns.lambda, DronePatterns.space2,
		DronePatterns.omega, DronePatterns.space2,
		DronePatterns.rho, DronePatterns.space2,
		DronePatterns.alpha
	]);
	swarm.setPattern(pat,-5,3,0);
}
let pat4_happy = function() {
	let pat = swarm.compositePattern(
		[DronePatterns.emojiHappy]
	);
	swarm.setPattern(pat,0,4,0);
}
//swarm.setPattern(pat1,-5,3,0);
let sequencer = new Sequencer();
sequencer.push(pat1_kala);
sequencer.push(pat_forward); //essentially a wait pattern so you can read the word
sequencer.push(pat2_genethlia);
sequencer.push(pat_forward);
sequencer.push(pat3_f);
sequencer.push(pat_forward);
sequencer.push(pat4_happy);

//origin.material.color.set(0x00ff00);


//scene.add(sphere);
//sphere.add(wiresphere);

camera.position.y = 2;
camera.position.z = 10;

//sequencer.next(); //kick it off...
//pat1.call();

function animate() {
	requestAnimationFrame( animate );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	//sphere.rotation.x += 0.002;
	//sphere.rotation.y += 0.002; //earth

	swarm.tick();
	if (swarm.allAtTarget) sequencer.next();

	renderer.render( scene, camera );
}

window.addEventListener("resize", () => {
	onWindowResize(); // your function?
	});
    

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();






