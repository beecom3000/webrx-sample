<template>
  <main>
    <div id="container">
      <canvas ref="canvas"></canvas>
    </div>
  </main>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue'
import * as THREE from 'three';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const renderer = new THREE.WebGLRenderer({ antialias : true });
  canvas.value = renderer.domElement;
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create Scene
  const scene = new THREE.Scene();

  // Create a Camera and add it to the scene
  const camera = new THREE.PerspectiveCamera(
    45, //Field of View Angle
    window.innerWidth / window.innerHeight, //Aspect Ratio
    0.1, //Clipping for things closer than this amount
    1000 //Clipping for things farther than this amount
  );
  camera.position.setY(1.7); //Height of your eyes
  scene.add(camera);

  //Create Sphere + Cube
  let sphereRadius = 1;
  let sphereGeometry = new THREE.BoxGeometry(
    sphereRadius,
    16, //Width segments
    16 //Height segments
  );
  let sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000 //Red
  });
  let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  let cubeGeometry = new THREE.BoxGeometry(
    1.5 * sphereRadius, //Width
    1.5 * sphereRadius, //Height
    1.5 * sphereRadius //Depth
  );
  let cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00FF00 //Green
  });
  let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

//Group shapes together and add group to the scene
  let shapes = new THREE.Object3D();
  shapes.add(sphereMesh);
  shapes.add(cubeMesh);
  shapes.position.setY(1.7); //Place at eye level
  shapes.position.setZ(-10); //Move shape forward so we can see it
  scene.add(shapes);

  //Add light to the scene
  let light = new THREE.PointLight();
  light.position.setY(2);
  scene.add(light);

//Our animation loop
  let clock = new THREE.Clock(); //Need to keep track of time elapsed between frames
  function update() {
    let timeDelta = clock.getDelta();
    let rotationAmount = 2 * Math.PI * timeDelta * 0.1; //0.1 rotations per second
    shapes.rotation.x += rotationAmount;
    shapes.rotation.y += rotationAmount;
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(update);
})

</script>