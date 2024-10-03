import { useWebGlStore } from '@/stores/webgl'
import { storeToRefs } from 'pinia';
import { Texture as ezglTexture }  from '@/models/ezgl/texture'

const { gl } = storeToRefs(useWebGlStore())

export class Texture {
  texture: ezglTexture;
  constructor() {
    this.texture = new ezglTexture();
  }
  free() {
    this.texture.free();
  }

  loadFromFile(url: string, options = {wrap: gl.value.REPEAT, filter: gl.value.NEAREST}) {
    this.texture.fromFile(url, options);
  }
  loadFromData(data: number, options = {wrap: gl.value.REPEAT, filter: gl.value.NEAREST}) {
    this.texture.fromData(data, options);
  }
}