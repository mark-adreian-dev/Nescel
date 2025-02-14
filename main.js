import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const cursor = document.querySelector(".cursor-follower")
const canvas = document.querySelector("#bg")

const aspectRatio = window.innerWidth / window.innerHeight

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFBDBD);
// scene.background = new THREE.Color(0xFFC0CB); // Set background to blue
const camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;


const ambientLight = new THREE.AmbientLight(0xFFC0CB, 5);

// const fog = new THREE.Fog(0xffffff, 1, 10)
// scene.fog = fog
// scene.background = new THREE.Color(0xffffff)
let model;

const flower = new GLTFLoader();
flower.load(
	// resource URL
	'/mesh/Boquet/scene.glb',
	// called when the resource is loaded
	function ( gltf ) {
    model = gltf

    gltf.scene.scale.x = 5
    gltf.scene.scale.z = 5
    gltf.scene.scale.y = 5
    gltf.scene.position.y = -1.3
  
    scene.add( gltf.scene );
    

	},
	// called while loading is progressing
	xhr => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
	// called when loading has errors
	error => {console.log( error );}
);

window.addEventListener('mousemove', (event) => {
  cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  
  const scrollTop = event.pageY; // Current scroll position from top
  const windowHeight = window.innerHeight; // Viewport height
  const documentHeight = document.documentElement.scrollHeight; // Total page height
  const cursorText = document.querySelector(".text-cursor");

  if (scrollTop + windowHeight >= documentHeight) {
   
    cursorText.textContent = "Drag the flower"
  }
  else {
    cursorText.textContent= "Scroll Down"
  }
})

let x = 0, y = 0; // Current position
let targetX = 0, targetY = 0; // Target position
let speed = 0.1; // Adjust lag speed (0.1 = slow, 1 = instant)

document.addEventListener("mousemove", (event) => {
  targetX = event.pageX;
  targetY = event.PageY;
});

document.addEventListener("scroll", (event) => {
  targetX = event.pageX;
  targetY = event.PageY;
  
});






function animateCursor() {
  x += (targetX - x) * speed;
  y += (targetY - y) * speed;
  cursor.style.transform = `translate(${x}px, ${y}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();







//Helpers
const axisHelpers = new THREE.AxesHelper();
// scene.add(axisHelpers)


scene.add(topLight);
scene.add(ambientLight);
// scene.add(camera)
// scene.add(Mesh)
// scene.add(Mesh2)
// scene.add(Mesh3)



//Controls
// const dragControls = new DragControls([cubeMesh], camera, renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.enableZoom = false;

controls.dampingFactor = 0.05;
controls.enableRotate = false; // Disable object rotation via OrbitControls


let isDragging = false;
let velocity = new THREE.Vector2(0, 0);
let lastMousePos = new THREE.Vector2();
let decay = 0.95; // Friction to slow down rotation after release

document.addEventListener("mousedown", (event) => {
  isDragging = true;
  lastMousePos.set(event.clientX, event.clientY);
  velocity.set(0, 0); // Reset velocity on click
});

document.addEventListener("mousemove", (event) => {
  if (isDragging && model) {
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;

    velocity.set(deltaX * 0.002, deltaY * 0.002); // Adjust sensitivity
    lastMousePos.set(event.clientX, event.clientY);

    // 🔄 Rotate object WHILE dragging
    model.scene.rotation.y += velocity.x;
    model.scene.rotation.x += velocity.y;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});




document.addEventListener("touchstart", (event) => {
  isDragging = true;
  lastMousePos.set(event.clientX, event.clientY);
  velocity.set(0, 0); // Reset velocity on click
});

document.addEventListener("touchmove", (event) => {
  if (isDragging && model) {
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;

    velocity.set(deltaX * 0.002, deltaY * 0.002); // Adjust sensitivity
    lastMousePos.set(event.clientX, event.clientY);

    // 🔄 Rotate object WHILE dragging
    model.scene.rotation.y += velocity.x;
    model.scene.rotation.x += velocity.y;
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});







window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
})
// cubeMesh.rotation.x = THREE.MathUtils.radToDeg(0.001)



const animate = () => {
  requestAnimationFrame(animate)
  
  if (model) {
    if (!isDragging) {
      // Continue rotating with inertia
      model.scene.rotation.y += velocity.x;
      model.scene.rotation.x += velocity.y;

      // Apply friction to slow down rotation naturally
      velocity.multiplyScalar(decay);
    }
  }

  controls.update();
  renderer.render(scene, camera)
}





animate();



