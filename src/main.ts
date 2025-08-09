import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VoxelWorld } from './voxelWorld';

// --- renderer, scene, camera ---
const container = document.getElementById('app')!;
const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(10, 10, 20);

// controls (dev-friendly)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(8, 8, 8);
controls.update();

// lights
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(10, 20, 10);
scene.add(dir);

// create a simple voxel world
const world = new VoxelWorld(scene);
world.generateFlatChunk(); // a simple flat terrain
world.renderChunk();

// resize handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// simple raycast block breaking/placing
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown', (ev) => {
  mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hit = world.raycast(raycaster);
  if (hit) {
    // left click remove, right click place (use ev.button to distinguish)
    if (ev.button === 0) world.setBlock(hit.x, hit.y, hit.z, 0);
    else world.setBlock(hit.x + hit.nx, hit.y + hit.ny, hit.z + hit.nz, 1);
    world.updateChunkMesh();
  }
});

// animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
