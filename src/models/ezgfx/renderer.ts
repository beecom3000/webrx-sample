import ezgfxGlobals from '@/models/ezgfx/ezgfx-globals'
import { SubShader } from '@/models/ezgl/sub-shader'
import { useWebGlStore } from '@/stores/webgl'
import { storeToRefs } from 'pinia'
import type { Mesh } from '@/models/ezgfx/mesh'
import type { Material } from '@/models/ezgfx/material'

const { gl } = storeToRefs(useWebGlStore())

export class Renderer {
  color: number[];
  masks: number;
  depthTest: boolean;

  constructor() {
    this.color = [0.0, 0.0, 0.0, 1.0];
    gl.value.clearColor(0.0, 0.0, 0.0, 1.0);

    this.masks = gl.value.COLOR_BUFFER_BIT;
    this.depthTest = false;

    ezgfxGlobals.fSSC0 = "#version 300 es\n\
			precision mediump float;\n\
			\n\
			out vec4 o_Color;\n\
			\n\
			in vec2 v_TexCoord;\n\
			\n\
			uniform vec4 u_Color;\n\
			uniform sampler2D u_TexID[16];\n";
    ezgfxGlobals.fSSC1 = "\nvoid main() {\n\
				o_Color = shader();\n\
			}";
    ezgfxGlobals.vSS = new SubShader(gl.value.VERTEX_SHADER, "#version 300 es\n\
			precision mediump float;\n\
			\n\
			layout(location = 0) in vec3 a_Position;\n\
			layout(location = 1) in vec2 a_TexCoord;\n\
			layout(location = 2) in vec3 a_Normal;\n\
			\n\
			uniform mat4 u_Projection;\n\
			uniform mat4 u_View;\n\
			uniform mat4 u_Model;\n\
			\n\
			out vec2 v_TexCoord;\n\
			\n\
			void main() {\n\
			gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);\n\
				v_TexCoord = a_TexCoord;\n\
				v_TexCoord.y = 1.0 - v_TexCoord.y;\n\
			}");
    ezgfxGlobals.fSS = new SubShader(gl.value.FRAGMENT_SHADER,
      ezgfxGlobals.fSSC0 + "\nvec4 shader() { return u_Color; }\n" + ezgfxGlobals.fSSC1);

      ezgfxGlobals.triangle = [
        -0.5, -0.5, 0.0,
        0.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.5, 0.0,
        0.5, 1.0,
        0.0, 0.0, 1.0,
        0.5, -0.5, 0.0,
        1.0, 0.0,
        0.0, 0.0, 1.0
      ];
  }
  depthTesting(enable: boolean) {
    if(enable && !this.depthTest) {
      this.masks = gl.value.COLOR_BUFFER_BIT | gl.value.DEPTH_BUFFER_BIT;
      gl.value.enable(gl.value.DEPTH_TEST);

      this.depthTest = true;
    }
    else if(!enable && this.depthTest) {
      this.masks = gl.value.COLOR_BUFFER_BIT;
      gl.value.disable(gl.value.DEPTH_TEST);

      this.depthTest = false;
    }
  }
  clear(color: number[] = [0.0, 0.0, 0.0, 1.0]) {
    if(color != this.color) {
      gl.value.clearColor(color[0], color[1], color[2], color[3]);
      this.color = color;
    }
    gl.value.clear(this.masks);
  }
  draw(mesh: Mesh, material: Material) {
    material.shader.bind();
    for(let i = 0; i < material.textures.length; i++) {
      material.textures[i].bind(i);
    }
    mesh.vertexbuffer.draw();
    material.shader.unbind();
  }
}