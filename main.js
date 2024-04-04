import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { ssrModuleExportsKey } from "vite/runtime";
import helvetiker_regular from "./static/helvetiker_regular.typeface.json";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9900ff);

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
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff33,
  wireframe: true,
});
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
});
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

camera.position.set(0, 0, 50);

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
  const paddleSpeed = 0.2; // Adjust paddle speed as needed
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
const cubeSpeed = 0.15; // Adjust cube speed as needed
let cubeDirectionX = 1; // 1 for right, -1 for left
let cubeDirectionY = 1; // 1 for up, -1 for down
let cubePositionX = 0;
let cubePositionY = Math.random() * 16 - 8; // Random initial y position of the cube (-8 to 8)

function resetCubePosition() {
  cubeDirectionX *= -1;
  cubeDirectionY = 1;
  cubePositionX = Math.random() * 20 - 10;
  cubePositionY = 0;
  // setTimeout(launchCube, 1000);
}

function launchCube() {
  cubePositionX += cubeSpeed * cubeDirectionX;
  cubePositionY += cubeSpeed * cubeDirectionY;
  cube.position.x = cubePositionX;
  cube.position.y = cubePositionY;
}

function updateCubePosition() {
  setTimeout(launchCube, 1000);

  //If theres a goal score
  if (cubePositionX >= 45) {
    leftScore++;
    updateLeftScoreValue(leftScore);
    resetCubePosition();
  } else if (cubePositionX <= -45) {
    rightScore++;
    updateRightScoreValue(rightScore);
    resetCubePosition();
  }

  // TOP AND BOTTOM
  if (cubePositionY >= 15 || cubePositionY <= -15) {
    cubeDirectionY *= -1;
  }
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
const font = loader.parse(helvetiker_regular);

let leftScore = 0;
let rightScore = 0;

let leftTextMesh;
let rightTextMesh;

function updateLeftScore() {
  const leftText = new TextGeometry(leftScore.toString(), {
    font: font,
    size: 100,
    depth: 2,
    curveSegments: 12,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const lefttextMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const leftMesh = new THREE.Mesh(leftText, lefttextMaterial);
  leftMesh.position.set(-200, 275, -600);

  if (leftTextMesh) {
    scene.remove(leftTextMesh);
  }

  leftTextMesh = leftMesh;
  scene.add(leftMesh);
}
function updateRightScore() {
  const rightText = new TextGeometry(rightScore.toString(), {
    font: font,
    size: 100,
    depth: 2,
    curveSegments: 12,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const righttextMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const rightMesh = new THREE.Mesh(rightText, righttextMaterial);
  rightMesh.position.set(200, 275, -600);

  if (rightTextMesh) {
    scene.remove(rightTextMesh);
  }

  rightTextMesh = rightMesh;
  scene.add(rightMesh);
}

function updateLeftScoreValue(newScore) {
  leftScore = newScore;
  updateLeftScore();
}
function updateRightScoreValue(newScore) {
  rightScore = newScore;
  updateRightScore();
}

updateLeftScoreValue(leftScore);
updateRightScoreValue(rightScore);


const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000});
const points = [];

points.push( new THREE.Vector3( -45, -16, 0 ) );
points.push( new THREE.Vector3( -45, 16, 0 ) );
points.push( new THREE.Vector3( 45, 16, 0 ) );
points.push( new THREE.Vector3( 45, -16, 0 ) );
points.push( new THREE.Vector3( -45, -16, 0 ) );

const firstspots = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( firstspots, lineMaterial );
scene.add(line);

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
