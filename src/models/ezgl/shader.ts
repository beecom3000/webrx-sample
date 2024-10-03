

// known as a program in WebGL2, just joins and links shaders
import { useWebGlStore } from '@/stores/webgl'
import { storeToRefs } from 'pinia'
import type { SubShader } from '@/models/ezgl/sub-shader'

const { gl } = storeToRefs(useWebGlStore())

export class Shader {
  program: WebGLProgram;
  constructor() {
    this.program = gl.value.createProgram();
  }
  free() {
    gl.value.deleteProgram(this.program);
  }

  join(subshader: SubShader) {
    gl.value.attachShader(this.program, subshader.shader);
    return this;
  }
  link() {
    gl.value.linkProgram(this.program);
    gl.value.useProgram(this.program);
    gl.value.useProgram(null);
    return this;
  }

  bind() {
    gl.value.useProgram(this.program);
    return this;
  }
  unbind() {
    gl.value.useProgram(null);
    return this;
  }

  // these are used for setting uniforms in shaders
  set1i(name: string, val: number) { // mostly for texture IDs
    gl.value.uniform1i(gl.value.getUniformLocation(this.program, name), val);
    return this;
  }
  set1f(name: string, val: number) { // maybe will find some kind of a use
    gl.value.uniform1f(gl.value.getUniformLocation(this.program, name), val);
    return this;
  }
  set2f(name: string, x: number, y: number) { // maybe will find some kind of a use
    gl.value.uniform2f(gl.value.getUniformLocation(this.program, name), x, y);
    return this;
  }
  set3f(name: string, x: number, y: number, z: number) { // maybe will find some kind of a use
    gl.value.uniform3f(gl.value.getUniformLocation(this.program, name), x, y, z);
    return this;
  }
  set4f(name: string, x: number, y: number, z: number, w: number) { // maybe will find some kind of a use (most likely colors)
    gl.value.uniform4f(gl.value.getUniformLocation(this.program, name), x, y, z, w);
    return this;
  }
  set4x4f(name: string, mat: Float32List) { // for matrices (projection, view, model)
    gl.value.uniformMatrix4fv(gl.value.getUniformLocation(this.program, name), false, mat);
    return this;
  }
}