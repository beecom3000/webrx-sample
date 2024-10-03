import { useWebGlStore } from '@/stores/webgl'
import { storeToRefs } from 'pinia'

const { gl } = storeToRefs(useWebGlStore())


// both vertex buffer and vertex array, whereas the vertex array is here only to store the vertex layout
export class VertexBuffer {
  va: WebGLVertexArrayObject | null;
  vb: WebGLBuffer | null;
  stride: number;
  length: number;
  vertices: number;
  constructor() {
    this.va = gl.value.createVertexArray();
    gl.value.bindVertexArray(this.va);

    this.vb = gl.value.createBuffer();
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, this.vb);

    this.stride = 0;
    this.length = 0;
    this.vertices = 0;

    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, null);
    gl.value.bindVertexArray(null);
  }
  free() { // free functions - they just delete all the WebGL2 objects created with the object
    gl.value.deleteBuffer(this.vb);
    gl.value.deleteVertexArray(this.va);
  }

  vertexLayout(layout = [3, 2, 3]) { // this function supplies the vertex layout - it says how many elements there are per vertex, and how much floats they take up. we will mostly use the [3, 2, 3] combination, because it's the one used by OBJ models
    for(let i = 0; i < layout.length; i++) {
      this.stride += layout[i] * 4;
    }

    gl.value.bindVertexArray(this.va);
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, this.vb);

    let istride = 0;
    for(let i = 0; i < layout.length; i++) {
      gl.value.vertexAttribPointer(i, layout[i], gl.value.FLOAT, false, this.stride, istride);
      gl.value.enableVertexAttribArray(i);

      istride += layout[i] * 4;
    }

    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, null);
    gl.value.bindVertexArray(null);

    this.stride = this.stride / 4;
    this.vertices = this.length / this.stride;
  }
  vertexData(data: number[]) { // simply takes in a Float32Array and supplies it to the buffer
    this.length = data.length;
    gl.value.bindVertexArray(this.va);
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, this.vb);
    gl.value.bufferData(gl.value.ARRAY_BUFFER, new Float32Array(data), gl.value.STATIC_DRAW);
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, null);
    gl.value.bindVertexArray(null);
    this.vertices = this.length / this.stride;
  }
  draw() { // draws our mesh
    gl.value.bindVertexArray(this.va);
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, this.vb);

    gl.value.drawArrays(gl.value.TRIANGLES, 0, this.vertices);

    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, null);
    gl.value.bindVertexArray(null);
  }

}