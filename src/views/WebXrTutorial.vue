<template>
  <main>
    <div id="drawing-area">
      <canvas ref="canvas" class="canvas-container"></canvas>
    </div>
    <div class="btn-container">
      <button @click="activateXr()">Enable XR</button>
    </div>

    <div class="btn-container">
      <button ref="enableVrButton" @click="enableVR()">Initialising...</button>
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
import ModalDialog from '@/components/ModalDialog.vue'
import { Renderer } from '@/models/ezgfx/renderer'
import { Mesh } from '@/models/ezgfx/mesh'
import { Material } from '@/models/ezgfx/material'
import ezgfxGlobals from '@/models/ezgfx/ezgfx-globals'
import { storeToRefs } from 'pinia'
import { useWebGlStore } from '@/stores/webgl'

const canvas = ref<HTMLCanvasElement>();
const message = ref<string>('');
const showModal = ref<boolean>(false);

const enableVrButton = ref<HTMLButtonElement>();

const xrSession = ref<XRSession | null>(null);
const xrRefSpace = ref<XRReferenceSpace | XRBoundedReferenceSpace>();

// const showConsole = () => {
//   console.log('On web tutorial');
// }
//
onErrorCaptured((error: Error) => {
  console.log(error);
  message.value= 'Failed to activate XR: ' + (error?.message ?? 'None');
  alert(message.value);
  showModal.value = true;
  return false;
});
//
const onResize = () => { // this function resizes our canvas in a way, that makes it fit the entire screen perfectly!
  canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio;
  canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio;
}

const onSessionEnded = () => { // this function defines what happens when the session has ended
  xrSession.value = null; // we set our xrSession to be null, so that our button will be able to reinitialize it when we click it the next time
}

const onSessionStarted = (_session: XRSession) => { // this function defines what happens when the session is started
  xrSession.value = _session; // we set our session to be the session our request created
  xrSession.value.addEventListener('end', onSessionEnded); // we set what happenes when our session is ended

  initWebGL2({xrCompatible: true}); // we initialize WebGL2, in a way that makes it compatible with WebXR

  xrSession.value.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession.value, gl.value)
  }); // this line simply sets our session's WebGL context to our WebGL2 context
  xrSession.value.requestReferenceSpace('local').then((refSpace: XRReferenceSpace | XRBoundedReferenceSpace) => { // we request our referance space - an object that defines where the center of our space lies. Here we request a local referance space - that one defines the center of the world to be where player's head is at the start of our application.
    xrRefSpace.value = refSpace; // we set our referance space to be the one returned by this function
    xrSession.value.requestAnimationFrame(onSessionFrame); // at this point everything has been set up, so we can finally request an animation frame, on a function with the name of onSessionFrame
  });

  const onSessionFrame = (t: DOMHighResTimeStamp, frame: XRFrame) => { // this function will happen every frame
    const session: XRSession = frame.session; // frame is a frame handling object - it's used to get frame sessions, frame WebGL layers and some more things
    session.requestAnimationFrame(onSessionFrame); // we simply set our animation frame function to be this function again

    let pose = frame.getViewerPose(xrRefSpace.value); // gets the pose of the headset, relative to the previously gotten referance space

    if (pose) { // if the pose was possible to get (if the headset responds)
      let glLayer: XRWebGLLayer = session.renderState.baseLayer; // get the WebGL layer (it contains some important information we need)

      gl.value.bindFramebuffer(gl.value.FRAMEBUFFER, glLayer.framebuffer); // sets the framebuffer (drawing target of WebGL) to be our WebXR display's framebuffer
      gl.value.clearColor(0.4, 0.7, 0.9, 1.0);
      gl.value.clear(gl.value.COLOR_BUFFER_BIT | gl.value.DEPTH_BUFFER_BIT); // clears the framebuffer (in the next episode we'll implement our ezgfx renderer here - for now, let's just use vanilla WebGL2, as we're not doing anything else than clearing the screen)
      for (let view of pose.views) { // we go through every single view out of our camera's views
        let viewport: XRViewport = glLayer.getViewport(view); // we get the viewport of our view (the place on the screen where things will be drawn)
        gl.value.viewport(
          viewport.x,
          viewport.y,
          viewport.width,
          viewport.height
        ); // we set our viewport appropriately

        // Here we will draw our scenes
      }
    }
  }
}

onMounted(async () => {
//
//   console.log('On web tutorial');
//   // Add a canvas element and initialize a WebGL context that is compatible with WebXR.
//   // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
//   // webgl2 (WebGL2RenderingContext) or webgpu (GPUCanvasContext)
//   // gl.value = canvas.value.getContext('webgl2', { xrCompatible: true });
//       // || canvas.value.getContext("webgpu");
//
//   message.value = 'First time runner';
//   // message.value =
//   //     gl.value instanceof WebGL2RenderingContext
//   //     // || gl.value instanceof GPUCanvasContext
//   //     ? "Your browser supports WebGL" : "This browser does not support WebGL";
//
//   window.onresize = onResize;
  if (navigator.xr) { // Check if the device supports WebXR
    const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
    if (isSupported && enableVrButton.value) {
      enableVrButton.value.disabled = false;
      enableVrButton.value.textContent = 'Enter VR'
    }
  }
});

const { gl } = storeToRefs(useWebGlStore());

const initWebGL2 = (attributes: WebGLContextAttributes) => {
  gl.value = canvas.value!.getContext('webgl2', attributes || {alpha: false}); // creates a WebGL2 context using the canvas and the given attributes, with an addition of {alpha: false} attribute, which just disables transparency of our canvas
  if (!gl.value) { // if the gl DIDN'T create properly
    alert("This browser does not support WebGL 2."); // alert the user about it
    return; // go out of the function; stop this function
  }
  canvas.value!.setAttribute('style',
    'position: absolute; ' +
          'width: 100%; height: 100%; left: 0; top: 0; right: 0; bottom: 0; margin: 0; z-index: -1;'); // we add a simple style to our canvas
  onResize(); // resizes the canvas (it needs to be done, because otherwise it will not resize until you resize your window)
}

const enableVR = async () => {
  if (xrSession.value) {
    xrSession.value!.end();
  } else {
    navigator.xr!.requestSession('immersive-vr').then(onSessionStarted);
  }
}

const activateXr = async () => {

  gl.value = canvas.value?.getContext('webgl2', { xrCompatible: true }) || undefined;
  //
  // // const glNotFound: WebGLRenderingContext | undefined = canvas.value?.getContext('webgl', { xrCompatible: true }) || undefined;
  if (!gl.value) {
    alert('No webgl found');
  }

  onResize();

  const renderer = new Renderer();
  renderer.clear([0.3, 1.0, 0.4, 1.0]);

  const mesh = new Mesh();
  mesh.loadFromData(ezgfxGlobals.triangle);

  // new Material(null);
  const material = new Material();

  // We're setting all our matrices to identity (i'll talk about it in a minute)
  const identityMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  material.setProjection(identityMatrix);
  material.setView(identityMatrix);
  material.setModel(identityMatrix);

  // we declare this function inside of the init function to make passing variables between them easier
  // yes js allows that
  // yes it looks horrible
  const onFrame = () => { // this function specifies what will happen every frame
    gl.value!.viewport(
      0,
      0,
      canvas.value!.width,
      canvas.value!.height
    ); // resizes the webgl2's virtual viewport to fit the entire screen
    renderer.clear([0.3, 1.0, 0.4, 1.0]); // clears the screen with the specified green color (RGBA)

    renderer.draw(mesh, material); // draws our triangle combined with the material of our choice

    // we also have to tell our browser that we want this function to be called again in the next frame
    window.requestAnimationFrame(onFrame);
  }
  // here we have to tell our browser what function we will call during the next frame
  window.requestAnimationFrame(onFrame);
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

.canvas-container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  z-index: -1;
}
</style>