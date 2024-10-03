import { VertexBuffer } from '@/models/ezgl/vertex-buffer'
import ezobj from '@/models/ezobj'
import ezgfxGlobals from '@/models/ezgfx/ezgfx-globals'

export class Mesh {
  vertexbuffer: VertexBuffer;

  constructor() {
    this.vertexbuffer = new VertexBuffer();
    this.vertexbuffer.vertexLayout([3, 2, 3]);
  }
  free() {
    this.vertexbuffer.free();
  }

  loadFromData(data: number[]) {
    this.vertexbuffer.vertexData(data);
  }
  loadFromOBJ(url: string) {
    this.vertexbuffer.vertexData(ezgfxGlobals.triangle);
    fetch(url).then(response => {
      response.text().then(text => {
        const verticesLoaded = ezobj.load(text);
        this.vertexbuffer.vertexData(verticesLoaded);
      });
    });
  }
}