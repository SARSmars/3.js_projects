import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);


renderer.render(scene, camera);

// Add objects
// 1. Create a geometry : set of vectors that define the shape of an object
//    - BoxGeometry, SphereGeometry, PlaneGeometry, etc.
//    - Geometry can be created using THREE.BoxGeometry, THREE.SphereGeometry, etc.
//    - Example: const geometry = new THREE.BoxGeometry(1, 1, 1);
//    - Geometry can also be created using BufferGeometry for more complex shapes
//    - Example: const geometry = new THREE.BufferGeometry();
// 2. Create a material : the wrapping of the geometry
//    - Material defines how the geometry will be rendered
//    - Material can be created using THREE.MeshBasicMaterial, THREE.MeshStandardMaterial, etc
//    - Example: const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//    - Material can also be created using THREE.MeshPhongMaterial, THREE.MeshLambertMaterial, etc.
//    - Material can also be created using THREE.MeshPhysicalMaterial for more realistic
//      rendering with reflections, refractions, and other advanced features
//    - Example: const material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, metalness: 0.5, roughness: 0.5 });
// 3. Create a mesh: geometry + material
//    - Mesh is the combination of geometry and material
//    - Mesh can be created using THREE.Mesh
//    - Example: const mesh = new THREE.Mesh(geometry, material);
// 4. Add the mesh to the scene
//    - Mesh can be added to the scene using scene.add(mesh)


const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
const material = new THREE.MeshStandardMaterial({ color: 0xABABAB});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);


// ---------------------------------------------------------------------- Add a light source to the scene
// 1. Create a light source
//    - Light source can be created using THREE.PointLight, THREE.AmbientLight,
//      THREE.DirectionalLight, etc.
//    - Example: const light = new THREE.PointLight(0xFFFFFF);
// 2. Set the position of the light source
//    - Light source can be positioned using light.position.set(x, y, z)
//    - Example: light.position.set(10, 10, 10);
// 3. Add the light source to the scene
//    - Light source can be added to the scene using scene.add(light)


const PointLight = new THREE.PointLight(0xFFFFFF, 15); // White light, intensity 5
PointLight.position.set(10, 10, 10);

const AmbientLight = new THREE.AmbientLight(0x404040, 15); // Soft white light

// Add helpers to visualize the lights

const lightHelper = new THREE.PointLightHelper(PointLight, 1); // Optional: to visualize the point light
const gridHelper = new THREE.GridHelper(200, 50); // Optional: to visualize the grid


scene.add(PointLight, AmbientLight, lightHelper, gridHelper);




// ----------------------------

// add orbit controls to the camera
// OrbitControls allows the camera to orbit around a target
// It is useful for creating a first-person or third-person camera view
const controls = new OrbitControls(camera, renderer.domElement);


//-------------------------------------  Filling the space with randomly generated stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); // Parameters: radius, widthSegments, heightSegments
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(geometry, material);

  // Set random position for the star
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x, y, z);
  
  scene.add(star);
}

Array(200).fill().forEach(addStar); // Create 200 stars

// ---------------------------- Add a background texture to the scene
const spaceTexture = new THREE.TextureLoader().load('space.jpg'); // Load the texture
scene.background = spaceTexture; // Set the background of the scene



// ---------------------------------------texture mapping for the moon
// 1. Load the texture using THREE.TextureLoader
// 2. Create a mesh with a sphere geometry and the loaded texture
// 3. Set the position of the moon mesh
// 4. Add the moon mesh to the scene
const moonTexture = new THREE.TextureLoader().load('moon.jpg'); // Load the texture for
const moonNormalTexture = new THREE.TextureLoader().load('normal.jpg'); // Optional: Load a normal map for better lighting effects
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32), // Create a s phere
  new THREE.MeshStandardMaterial({ 
    map: moonTexture, 
    normalMap: moonNormalTexture // Use the loaded texture and normal map
   }) // Use the loaded texture
);
moon.position.setZ = (30); // Set the position of the moon 
moon.position.setX(2); // Set the X position of the moon
scene.add(moon); // Add the moon to the scene


// --------------------------------------- Add a function to move the camera and animate moon on scroll
function moveCamera() {
  // Get the current scroll position
  const t = document.body.getBoundingClientRect().top; 
  // Move the camera based on the scroll position
  moon.rotation.x += 0.05; // Rotate the moon on the X axis
  moon.rotation.y += 0.075; // Rotate the moon on the Y axis
  moon.rotation.z += 0.05; // Rotate the moon on the Z axis


  // camera.position.z = t * -0.01; // Move the camera back based on the scroll position
  // camera.position.x = t * -0.0002; // Move the camera left/right based on the scroll position
  camera.position.y = t * -0.0002; // Move the camera up/down based on the scroll position
}
// Add an event listener to call the moveCamera function on scroll
document.body.onscroll = moveCamera;

// ------------------------- create a function to animate the scene in a loop for rendering instead of rendering once by renderer.render(scene, camera);

function animate() {
  // Request the next frame 
  // This will call the animate function again before the next repaint
  // This creates a loop that will run continuously
  // requestAnimationFrame is a method that tells the browser that you wish to perform an animation
  requestAnimationFrame(animate);

  // Rotate the torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  // Update the controls
  controls.update();
  
  // Render the scene
  renderer.render(scene, camera);

 

}

// call the animate function to start the animation loop
animate();

