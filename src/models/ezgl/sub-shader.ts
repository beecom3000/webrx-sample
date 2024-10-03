import { useWebGlStore } from '@/stores/webgl'
import { storeToRefs } from 'pinia'

const { gl } = storeToRefs(useWebGlStore())

// known as shader in WebGL2, simply contains shader code and type
export class SubShader {
  shader: WebGLShader | null;
  constructor(type: GLenum, str: string) {
    this.shader = gl.value.createShader(type);
    gl.value.shaderSource(this.shader, str);
    gl.value.compileShader(this.shader);
  }
  free() {
    gl.value.deleteShader(this.shader);
  }
}