<template>
  <div v-if="errorObj">{{ errorObj.errorMessage }}</div>
  <div v-else><slot></slot></div>
</template>

<script setup lang="ts">
import { onErrorCaptured, reactive } from 'vue'

interface ErrorObject {
  error: Error | null,
  errorMessage: string
}

const errorObj: ErrorObject = reactive({
  error: null,
  errorMessage: ''
});

onErrorCaptured( (error: Error) => {
  errorObj.error = error;
  errorObj.errorMessage = error.message;
});
</script>