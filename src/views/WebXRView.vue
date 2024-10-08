<template>
  <main>
    <div id="drawing-area">
      <canvas ref="canvas"></canvas>
    </div>
    <div class="btn-container">
      <button @click="activateXr()">Activate XR</button>
    </div>
    <modal-dialog :show="showModal" @close="showModal = false">
      <template #header>
        <h3>Something went wrong</h3>
      </template>
      <template #body>
        <div>
          Error occurred: {{ message }}
        </div>
      </template>
    </modal-dialog>
  </main>


</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted, ref } from 'vue'
import * as THREE from 'three';
import ModalDialog from '@/components/ModalDialog.vue'

const canvas = ref<HTMLCanvasElement | OffscreenCanvas>();
// const gl = ref<WebGL2RenderingContext>();
const message = ref<string>('');
const showModal = ref<boolean>(false);

// The cube will have a different color on each side.
const materials = [
  new THREE.MeshBasicMaterial({color: 0xff0000}),
  new THREE.MeshBasicMaterial({color: 0x0000ff}),
  new THREE.MeshBasicMaterial({color: 0x00ff00}),
  new THREE.MeshBasicMaterial({color: 0xff00ff}),
  new THREE.MeshBasicMaterial({color: 0x00ffff}),
  new THREE.MeshBasicMaterial({color: 0xffff00})
];

onErrorCaptured((error: Error) => {
  console.log(error);
  message.value= 'Failed to activate XR: ' + (error?.message ?? 'None');
  alert(message.value);
  showModal.value = true;
  return false;
});

onMounted(() => {
  // Add a canvas element and initialize a WebGL context that is compatible with WebXR.
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
  // webgl2 (WebGL2RenderingContext) or webgpu (GPUCanvasContext)
  // gl.value = canvas.value.getContext('webgl2', { xrCompatible: true });
      // || canvas.value.getContext("webgpu");

  message.value = 'First time runner';
  // message.value =
  //     gl.value instanceof WebGL2RenderingContext
  //     // || gl.value instanceof GPUCanvasContext
  //     ? "Your browser supports WebGL" : "This browser does not support WebGL";
})

const activateXr = async () => {

  // try {
  //   gl.value.makeXRCompatible();
  // } catch (err) {
  //   switch (err) {
  //     case AbortError:
  //       showSimpleMessageBox(
  //         "Unable to transfer the game to your XR headset.",
  //         "Cancel",
  //       );
  //       break;
  //     case InvalidStateError:
  //       showSimpleMessageBox(
  //         "You don't appear to have a compatible XR headset available.",
  //         "Cancel",
  //       );
  //       break;
  //     default:
  //       handleFatalError(err);
  //       break;
  //   }
  // }

  // if (true) {
  //   throw new Error('Error not found');
  // }

  const gl: WebGL2RenderingContext | undefined = canvas.value?.getContext('webgl2', { xrCompatible: true }) || undefined;
  // const glNotFound: WebGLRenderingContext | undefined = canvas.value?.getContext('webgl', { xrCompatible: true }) || undefined;
  if (gl === undefined) {
    throw new Error('No webgl found');
  }
  const scene = new THREE.Scene();

  // Create the cube and add it to the demo scene.
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    materials
  );
  cube.position.set(1, 1, 1);
  scene.add(cube);

  // Set up the WebGLRenderer, which handles rendering to the session's base layer.
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canvas: canvas.value,
    context: gl
  });
  renderer.autoClear = false;

// The API directly updates the camera matrices.
// Disable matrix auto updates so three.js doesn't attempt
// to handle the matrices independently.
  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;



  // Initialize a WebXR session using "immersive-ar".
  // Check to see if there is an XR device available that supports immersive VR
  // presentation (for example: displaying in a headset). If the device has that
  // capability the page will want to add an "Enter VR" button to the page (similar to
  // a "Fullscreen" button) that starts the display of immersive VR content.
  const mode: XRSessionMode = 'immersive-ar';
  const supported = await navigator.xr?.isSessionSupported(mode) ?? false;
  if (!supported) {
    throw new Error(`${mode} is not supported in this browser`);
  }
  let session: XRSession | undefined  = await navigator.xr?.requestSession(mode) ?? undefined;
  if (!session) { throw new Error(`${mode} session is undefined`); }
    await session.updateRenderState({
      baseLayer: new XRWebGLLayer(session, gl)
    });

// A 'local' reference space has a native origin that is located
// near the viewer's position at the time the session was created.
  const referenceSpace = await session.requestReferenceSpace('local');

  // Create a render loop that allows us to draw on the AR view.
  const onXRFrame = (time: DOMHighResTimeStamp, frame: XRFrame): void => {
    // Queue up the next draw request.
    session.requestAnimationFrame(onXRFrame);

    // Bind the graphics framebuffer to the baseLayer's framebuffer
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      session.renderState.baseLayer?.framebuffer || null
    )

    // Retrieve the pose of the device.
    // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
      // In mobile AR, we only have one view.
      const view = pose.views[0];

      const viewport: XRViewport | undefined = session.renderState?.baseLayer?.getViewport(view);
      if (viewport === undefined) {
        throw Error('there is no XRViewport');
      }
      renderer.setSize(viewport.width, viewport.height)

      // Use the view's transform matrix and projection matrix to configure the THREE.camera.
      camera.matrix.fromArray(view.transform.matrix)
      camera.projectionMatrix.fromArray(view.projectionMatrix);
      camera.updateMatrixWorld(true);

      // Render the scene with THREE.WebGLRenderer.
      renderer.render(scene, camera)
    }
  }
  session.requestAnimationFrame(onXRFrame);
}

// async function checkForSupport(mode: XRSessionMode) {
//   // Check to see if there is an XR device available that supports immersive VR
//   // presentation (for example: displaying in a headset). If the device has that
//   // capability the page will want to add an "Enter VR" button to the page (similar to
//   // a "Fullscreen" button) that starts the display of immersive VR content.
//   navigator.xr.isSessionSupported(mode).then((supported) => {
//     if (supported) {
//       const enterXrBtn = document.createElement("button");
//       enterXrBtn.innerHTML = "Enter VR";
//       enterXrBtn.addEventListener("click", beginXRSession);
//       document.body.appendChild(enterXrBtn);
//     } else {
//       console.log("Session not supported: " + reason);
//     }
//   });
// }

</script>

<style scoped>
.btn-container {
  align-items: center;
}
</style>