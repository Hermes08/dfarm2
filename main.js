import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";


import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/image3.png";
import image4 from "./images/image4.png";
import image5 from "./images/image5.png";
import image6 from "./images/image6.jpeg";
import image7 from "./images/image7.jpeg";
import image8 from "./images/image8.jpeg";
import image9 from "./images/image9.jpeg";
import image10 from "./images/image10.jpeg";

import image11 from "./images/image11.jpeg";
import image12 from "./images/image12.jpeg";

const targetScale = new THREE.Vector3(1, 1, 1);
const targetColor = new THREE.Color(0x800080);

const galleryContainer = document.getElementById("gallery-container");
const scrollingText = document.querySelector(".scrolling-text");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

galleryContainer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


const images = [image1, image2 , image3, image4 ,image5 , image6, image7, image8, image9, image10,image11, image12];

const textureLoader = new THREE.TextureLoader();
const materials = images.map((img) => new THREE.MeshBasicMaterial({ map: textureLoader.load(img), transparent: true }));

const geometries = materials.map(() => new THREE.PlaneGeometry(2, 2));

const copies = 5;
const meshes = [];

const fontLoader = new FontLoader();
let textMesh;

fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Dragon Fruit Panama", {
    font: font,
    size: 1,
    height: 0.2,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x800080, emissive: 0x800080 });

  textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.castShadow = true;
  textMesh.receiveShadow = true;
  scene.add(textMesh);

const pointLight = new THREE.PointLight(0x800080, 1, 10);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

});


for (let i = 0; i < copies; i++) {
  geometries.forEach((geo, index) => {
    const mesh = new THREE.Mesh(geo, materials[index].clone());
    scene.add(mesh);
    mesh.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, -5 - Math.random() * 10);
    mesh.scale.set(0, 0, 0);
    meshes.push(mesh);
  });
}

camera.position.z = 14;
camera.position.x = 15

const targetScales = meshes.map(() => new THREE.Vector3(1, 1, 1));


function animate() {
  requestAnimationFrame(animate);

  meshes.forEach((mesh) => {
    const elapsedTime = (Date.now() / 1000) % 5;
    const scaleFactor = elapsedTime <= 6 ? elapsedTime / 5: (10 - elapsedTime) / 2.5;

    mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  raycaster.setFromCamera(mouse, camera);

  raycaster.setFromCamera(mouse, camera);

  if (textMesh) {
    const intersects = raycaster.intersectObjects([textMesh]);
    const deltaTime = 0.1;

    if (intersects.length > 0) {
      targetScale.set(1.2, 1.2, 1.2); // Set the target scale when hovered
      targetColor.set(0x00ff00); // Set the target color to green when hovered
    } else {
      targetScale.set(1, 1, 1); // Set the target scale when not hovered
      targetColor.set(0x800080); // Set the target color to purple when not hovered
    }

    // Interpolate the scale and color
    textMesh.scale.lerp(targetScale, deltaTime);
    textMesh.material.color.lerp(targetColor, deltaTime);
  }


  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("scroll", () => {
    const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollingText.style.transform = `translateY(${scrollPercentage * 100}%)`;
  
    if (textMesh) {
      const textPosY = scrollPercentage * 20 - 10;
      textMesh.position.y = textPosY;
      pointLight.position.y = textPosY;
  
      // Check for collisions
      meshes.forEach((mesh) => {
        if (mesh.position.distanceTo(textMesh.position) < 2) {
          mesh.position.z = -2;
        } else {
          mesh.position.z = -5 - Math.random() * 10;
        }
      });
    }
  });
  
  window.addEventListener("mousemove", (event) => {
    event.preventDefault();
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
  