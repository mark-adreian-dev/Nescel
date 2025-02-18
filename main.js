import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const canvas = document.querySelector("#canvas")



// =============================  3D Model Environment Setup  =====================
//Scene
const scene = new THREE.Scene()

//Camera
const aspectRatio = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(9, aspectRatio, 1, 1000)
camera.position.z = 3

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

//Light
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500) 
topLight.castShadow = true;

// =============================  3D Model Environment Setup  =====================









// =============================  Load Model   ====================================  
const svgLoadMobile = document.querySelectorAll("path")[1]
const svgLoadDesktop = document.querySelectorAll("path")[0]

const pathLengthMobile = svgLoadMobile.getTotalLength()
const pathLengthDesktop = svgLoadDesktop.getTotalLength()

svgLoadMobile.style.strokeDasharray = pathLengthMobile + " " + pathLengthMobile;
svgLoadDesktop.style.strokeDasharray = pathLengthDesktop + " " + pathLengthDesktop;

svgLoadMobile.style.strokeDashoffset = pathLengthMobile;
svgLoadDesktop.style.strokeDashoffset = pathLengthDesktop;


let model;
const flower = new GLTFLoader();
flower.load('boquet/scene.glb', gltf => {
    model = gltf
    gltf.scene.rotation.z = -0.2; 
    gltf.scene.rotation.x = 0.4; 
    gltf.scene.rotation.y = 0.1; 
    gltf.scene.position.y = -0.2;
    gltf.scene.position.x = -0.01;
    scene.add( gltf.scene );

    const content = document.querySelector('#content-section')
    const loadingScreen = document.querySelector('#loading-screen')
    loadingScreen.style.height = "0px";
    content.style.display = "block"
    
	},
	// called while loading is progressing
	xhr => {
    const loading = document.querySelector('#loading-indicator')
    const percentage = Math.trunc((xhr.loaded / xhr.total) * 100 );
    if(percentage <= 100) {
      loading.textContent = `Loading ${percentage}%`
    }


    let drawLengthMobile = pathLengthMobile * (xhr.loaded / xhr.total);
    let drawLengthDesktop = pathLengthDesktop * (xhr.loaded / xhr.total);

    svgLoadMobile.style.strokeDashoffset = pathLengthMobile - drawLengthMobile;
    svgLoadDesktop.style.strokeDashoffset = pathLengthDesktop - drawLengthDesktop;
  

  
  },
	// called when loading has errors
	error => {console.log( error );}
);
// =============================  Load Model  ====================================







const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.dampingFactor = 0.05;
controls.enableRotate = false; 
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,  // One finger rotates
};


scene.add(topLight);
scene.add(ambientLight);






// =============================   Draging Interaction  ==========================
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
    const sensitivity = 0.001

    velocity.set(deltaX * sensitivity, deltaY * sensitivity);
    lastMousePos.set(event.clientX, event.clientY);

    model.scene.rotation.y += velocity.x;
    model.scene.rotation.x += velocity.y;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
// =============================   Draging Interaction  ==========================







// =============================   Canvas Responsive =============================   
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    renderer.setPixelRatio(window.devicePixelRatio);
})
// =============================   Canvas Responsive =============================   







// =============================  Animate 3D Model  ============================= 
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

    model.scene.rotation.y += 0.004;
    // model.scene.rotation.x += 0.001;

  }

  controls.update();
  renderer.render(scene, camera)
}

animate();
// =============================  Animate 3D Model  ============================= 



