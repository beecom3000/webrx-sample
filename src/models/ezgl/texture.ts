import { useWebGlStore } from '@/stores/webgl'
import { storeToRefs } from 'pinia'

const { gl } = storeToRefs(useWebGlStore())

// Just a simple texture, and it can be loaded from a file
export class Texture {
  texture: WebGLTexture | null;
  constructor() {
    this.texture = gl.value.createTexture();
    gl.value.bindTexture(gl.value.TEXTURE_2D, this.texture);
    gl.value.bindTexture(gl.value.TEXTURE_2D, null);
  }
  free() {
    gl.value.deleteTexture(this.texture);
  }

  fromFile(url: string, options = {wrap: gl.value.REPEAT, filter: gl.value.NEAREST}) {
    gl.value.bindTexture(gl.value.TEXTURE_2D, this.texture);
    gl.value.texImage2D(gl.value.TEXTURE_2D, 0, gl.value.RGBA, 1, 1, 0, gl.value.RGBA, gl.value.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_S, options.wrap);
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_T, options.wrap);
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MIN_FILTER, options.filter);
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MAG_FILTER, options.filter);
    const that: Texture = this;
    const img = new Image();
    img.onload = function() {
      gl.value.bindTexture(gl.value.TEXTURE_2D, that.texture);
      gl.value.texImage2D(gl.value.TEXTURE_2D, 0, gl.value.RGBA, gl.value.RGBA, gl.value.UNSIGNED_BYTE, img);
    };
    img.src = url;
  }
  fromData(data: number, options = {wrap: gl.value.REPEAT, filter: gl.value.NEAREST}) {
    gl.value.bindTexture(gl.value.TEXTURE_2D, this.texture);
    gl.value.texImage2D(gl.value.TEXTURE_2D, 0, gl.value.RGBA, 1, 1, 0, gl.value.RGBA, gl.value.UNSIGNED_BYTE, new Uint8Array(data));
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_S, options.wrap);
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_T, options.wrap);
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MIN_FILTER, options.filter);
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MAG_FILTER, options.filter);
  }

  bind(slot = 0) {
    gl.value.activeTexture(gl.value.TEXTURE0 + slot);
    gl.value.bindTexture(gl.value.TEXTURE_2D, this.texture);
  }
}