import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import helvetiker_regular from "./static/helvetiker_regular.typeface.json";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff33 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Paddles
const paddleWidth = 2;
const paddleHeight = 5;
const paddleDepth = 0.5;
const paddleGeometry = new THREE.BoxGeometry(
  paddleWidth,
  paddleHeight,
  paddleDepth
);
const paddleMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
}); // Red color
const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
leftPaddle.position.x = -35;
leftPaddle.position.z = 0;
leftPaddle.position.y = 4;
rightPaddle.position.x = 35;
rightPaddle.position.y = 4;
rightPaddle.position.z = 0;
scene.add(leftPaddle);
scene.add(rightPaddle);

camera.position.z = 40;

const keys = {
  up: false,
  down: false,
  w: false,
  s: false,
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    keys.up = true;
  } else if (event.key === "ArrowDown") {
    keys.down = true;
  } else if (event.key === "w" || event.key === "W") {
    keys.w = true;
  } else if (event.key === "s" || event.key === "S") {
    keys.s = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    keys.up = false;
  } else if (event.key === "ArrowDown") {
    keys.down = false;
  } else if (event.key === "w" || event.key === "W") {
    keys.w = false;
  } else if (event.key === "s" || event.key === "S") {
    keys.s = false;
  }
});

function updatePaddles() {
  const paddleSpeed = 0.1; // Adjust paddle speed as needed
  if (keys.up && rightPaddle.position.y < 12) {
    rightPaddle.position.y += paddleSpeed;
  }
  if (keys.down && rightPaddle.position.y > -12) {
    rightPaddle.position.y -= paddleSpeed;
  }
  if (keys.w && leftPaddle.position.y < 12) {
    leftPaddle.position.y += paddleSpeed;
  }
  if (keys.s && leftPaddle.position.y > -12) {
    leftPaddle.position.y -= paddleSpeed;
  }
}

const cubeSpeed = 0.1; // Adjust cube speed as needed
let cubeDirectionX = 1; // 1 for right, -1 for left
let cubeDirectionY = 1; // 1 for up, -1 for down
let cubePositionX = Math.random() * 20 - 10; // Random initial x position of the cube (-10 to 10)
let cubePositionY = Math.random() * 16 - 8; // Random initial y position of the cube (-8 to 8)

function updateCubePosition() {
  // Move the cube in the x direction
  cubePositionX += cubeSpeed * cubeDirectionX;

  // Check if the cube reaches the left or right edge of the screen
  if (cubePositionX >= 45 || cubePositionX <= -45) {
    cubeDirectionX *= -1;
  }

  // Move the cube in the y direction
  cubePositionY += cubeSpeed * cubeDirectionY;

  // Check if the cube hits the top or bottom edge of the screen
  if (cubePositionY >= 15 || cubePositionY <= -15) {
    // Change the direction when the cube hits the edge
    cubeDirectionY *= -1;
  }

  // Update the position of the cube
  cube.position.x = cubePositionX;
  cube.position.y = cubePositionY;
}

function checkCollision() {
  // Check collision with left paddle
  if (
    cube.position.x - 0.5 <= leftPaddle.position.x + paddleWidth / 2 && // Right edge of cube
    cube.position.x + 0.5 >= leftPaddle.position.x - paddleWidth / 2 && // Left edge of cube
    cube.position.y - 0.5 <= leftPaddle.position.y + paddleHeight / 2 && // Top edge of cube
    cube.position.y + 0.5 >= leftPaddle.position.y - paddleHeight / 2 // Bottom edge of cube
  ) {
    cubeDirectionX = 1; // Change direction to the right
  }

  // Check collision with right paddle
  if (
    cube.position.x - 0.5 <= rightPaddle.position.x + paddleWidth / 2 && // Right edge of cube
    cube.position.x + 0.5 >= rightPaddle.position.x - paddleWidth / 2 && // Left edge of cube
    cube.position.y - 0.5 <= rightPaddle.position.y + paddleHeight / 2 && // Top edge of cube
    cube.position.y + 0.5 >= rightPaddle.position.y - paddleHeight / 2 // Bottom edge of cube
  ) {
    cubeDirectionX = -1; // Change direction to the left
  }
}

const loader = new FontLoader();
console.log(helvetiker_regular);
const font = loader.parse(helvetiker_regular);

const textGeo = new TextGeometry("My Text", {
  font: font,

  size: 200,
  depth: 50,
  curveSegments: 12,

  bevelThickness: 2,
  bevelSize: 5,
  bevelEnabled: true,
});

const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

const mesh = new THREE.Mesh(textGeo, textMaterial);
mesh.position.set(1, 1, -100);

scene.add(mesh);

function render() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  updateCubePosition();
  checkCollision();
  updatePaddles();
  renderer.render(scene, camera);
}

render();
