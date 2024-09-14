<template>
  <div v-if="errorObj">{{ errorObj.errorMessage }}</div>
  <div v-else><slot></slot></div>
</template>

<script setup lang="ts">
import { type ComponentInternalInstance, onErrorCaptured, reactive } from 'vue'

const errorObj = reactive({
  error: null,
  errorMessage: ''
});

onErrorCaptured( (error: ErrorCapturedHook, target?: ComponentInternalInstance | null) => {
  errorObj.error = error;
  errorObj.errorMessage = error.message;
});
</script>