<template>
  <div>
    <canvas ref="canvas" id="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue'
import { Engine } from '@babylonjs/core/Engines/engine'
import {
  ActionManager,
  ArcRotateCamera,
  Color3, Color4,
  ExecuteCodeAction, HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3
} from '@babylonjs/core'
import type { ActionEvent } from '@babylonjs/core/Actions/actionEvent'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience'

const canvas = ref<HTMLCanvasElement>();
// let engine: Engine;

onMounted(async () => {

  const engine = new Engine(canvas.value, true);
  const sceneToRender = await createScene(engine);

  engine.runRenderLoop(() => {
    sceneToRender.render();
  });

});

const createScene = (engine: Engine) => {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0);

  const alpha = Math.PI / 4;
  const beta = Math.PI / 3;
  const radius = 8;
  const target = new Vector3(0, 0, 0);

  const camera = new ArcRotateCamera('Camera', alpha, beta, radius, target);
  camera.attachControl(canvas.value, true);

  const light = new HemisphericLight('light', new Vector3(1, 1, 0));

  const box = MeshBuilder.CreateBox('box', {});
  box.position.x = 0.5;
  box.position.y = 1;

  const boxMaterial = new StandardMaterial('material', scene);
  boxMaterial.diffuseColor = Color3.Random();
  box.material = boxMaterial;

  box.actionManager = new ActionManager(scene);
  box.actionManager.registerAction(
    new ExecuteCodeAction(
      ActionManager.OnPickTrigger,
      (evt: ActionEvent) => {
        const sourceBox = evt.meshUnderPointer;
        sourceBox.position.x += 0.1;
        sourceBox.position.y += 0.1;
        boxMaterial.diffuseColor = Color3.Random();
      }
    )
  );

  const ground = MeshBuilder.CreateGround('ground', {width: 4, height: 4});
  const xrPromise: Promise<WebXRDefaultExperience> = scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground]
  });

  return xrPromise.then((xrExperience: WebXRDefaultExperience) => {
    console.log('Done, WebXR is enabled');
    return scene;
  });
}

</script>

<style scoped>
#renderCanvas {
  width: 100%;
  height: 100%;
}
</style>