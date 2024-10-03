import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

// type State = {
//   gl: WebGL2RenderingContext
// }

export const useWebGlStore = defineStore('webgl', () => {
  const gl = ref<WebGL2RenderingContext | null>();
  const setWebGl = (webgl: WebGL2RenderingContext | null): void => {
    gl.value = webgl;
  }
  return { gl, setWebGl };
})

// export const useWebGlStore = defineStore({
//   id: 'webgl',
//   state: (): State => ({
//     gl: undefined
//   }),
//   getters: {
//     getWebGl(state): WebGL2RenderingContext | undefined {
//       return state.gl;
//     }
//   },
//   actions: {
//     setWebGl(gl: WebGL2RenderingContext | undefined): void  {
//       this.gl = gl;
//     }
//   }
// });
