<template>

  <modal-dialog :show="showModal" @close="showModal = false">
    <template #header>
      <h3>Something went wrong</h3>
    </template>
    <template #body>
      <div>
        <p>Error: '{{error}}'</p>
        <p>Component: {{instance}}</p>
        <p>Info: {{info}}</p>
      </div>
    </template>
  </modal-dialog>

  <header>
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

    <div class="wrapper">
      Web XR

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/piano">Piano</RouterLink>
        <RouterLink to="/portal">Portal</RouterLink>
<!--&lt;!&ndash;        <RouterLink to="/webxr">WebXR</RouterLink>&ndash;&gt;-->
<!--        <RouterLink to="/tutorial">Tutorial</RouterLink>-->
      </nav>
    </div>

  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {  ref, watch } from 'vue'
import ModalDialog from '@/components/ModalDialog.vue'
import { useErrorStore } from '@/stores/error'
import { storeToRefs } from 'pinia'

const showModal = ref<boolean>(false);
const errorStore = useErrorStore();

const { error, instance, info } = storeToRefs(errorStore);

watch(error, (oldValue, newValue) => {
  if (newValue !== null) {
    console.log(JSON.stringify(newValue));
    showModal.value = true;
  } else {
    showModal.value = false;
  }
})
// const showModel = computed({
//   get() {
//     return error.value !== undefined;
//   },
//   set(value) {
//     showModal.value = value;
//   }
// })

</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    //padding-right: calc(var(--section-gap) / 0.5);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
