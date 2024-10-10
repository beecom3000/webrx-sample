<template>
  <div>
    <canvas ref="canvas" id="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue'
import XrExperience from '@/models/xr-experience'

let xrExperience: XrExperience;

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  new XrExperience({
    debug: false,
    canvas: canvas.value,
    canvasId: 'renderCanvas'
  });
})
</script>