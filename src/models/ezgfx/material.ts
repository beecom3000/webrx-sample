import { SubShader } from '@/models/ezgl/sub-shader'
import { Shader } from '@/models/ezgl/shader'
import ezgfxGlobals from '@/models/ezgfx/ezgfx-globals'
import { storeToRefs } from 'pinia'
import type { Texture } from '@/models/ezgfx/texture'
import type { Texture as ezglTexture } from '@/models/ezgl/texture'
import { useWebGlStore } from '@/stores/webgl'

const { gl } = storeToRefs(useWebGlStore())

export class Material {
  shader: Shader;
  textures: Array<ezglTexture> = [];
  constructor(customShader: string = null) {
    this.shader = new Shader();
    this.shader.join(ezgfxGlobals.vSS);
    if(!customShader) {
      this.shader.join(ezgfxGlobals.fSS);
      this.shader.link();
    }
    else {
      const fSS = new SubShader(gl.value.FRAGMENT_SHADER, ezgfxGlobals.fSSC0 + customShader + ezgfxGlobals.fSSC1);
      this.shader.join(fSS);
      this.shader.link();
      fSS.free();
    }

    this.shader.bind();
    this.textures = [];
    this.shader.set4f("u_Color", 1.0, 1.0, 1.0, 1.0);
    for(let i = 0; i < 16; i++) {
      this.shader.set1i("u_TexID[" + i + "]", i);
    }
    this.shader.unbind();
  }
  free() {
    this.shader.free();
  }

  setProjection(mat: Float32List) {
    this.shader.bind();
    this.shader.set4x4f("u_Projection", mat);
    this.shader.unbind();
  }
  setView(mat: Float32List) {
    this.shader.bind();
    this.shader.set4x4f("u_View", mat);
    this.shader.unbind();
  }
  setModel(mat: Float32List) {
    this.shader.bind();
    this.shader.set4x4f("u_Model", mat);
    this.shader.unbind();
  }

  setColor(rgba = [1.0, 1.0, 1.0, 1.0]) {
    this.shader.bind();
    this.shader.set4f("u_Color", rgba[0], rgba[1], rgba[2], rgba[3]);
    this.shader.unbind();
  }
  setTexture(texture: Texture, slot: number = 0) {
    this.textures[slot] = texture.texture;
  }
}