const ezobj = {
  insertXYZ: function(array: number[], x: number, y: number, z: number) {
    array.push(x);
    array.push(y);
    array.push(z);
  },
  insertUV: function(array: number[], u: number, v: number) {
    array.push(u);
    array.push(v);
  },
  getX: function(array: number[], index: number) {
    return array[index * 3];
  },
  getY: function(array: number[], index: number) {
    return array[index * 3 + 1];
  },
  getZ: function(array: number[], index: number) {
    return array[index * 3 + 2];
  },
  getU: function(array: number[], index: number) {
    return array[index * 2];
  },
  getV: function(array: number[], index: number) {
    return array[index * 2 + 1];
  },
  getIndex: function(index: string) {
    return parseInt(index) - 1;
  },
  insertVertex: function(dest: number[], positions: number[], texcoords: number[], normals: number[], vertstr: string) {
    const indicesStr: string[] = vertstr.split("/");
    const indexPos: number = ezobj.getIndex(indicesStr[0]);
    const indexTex: number = ezobj.getIndex(indicesStr[1]);
    const indexNor: number = ezobj.getIndex(indicesStr[2]);

    dest.push(ezobj.getX(positions, indexPos));
    dest.push(ezobj.getY(positions, indexPos));
    dest.push(ezobj.getZ(positions, indexPos));

    dest.push(ezobj.getU(texcoords, indexTex));
    dest.push(ezobj.getV(texcoords, indexTex));

    dest.push(ezobj.getX(normals, indexNor));
    dest.push(ezobj.getY(normals, indexNor));
    dest.push(ezobj.getZ(normals, indexNor));
  },
  load: function(obj: string) {
    const dest: number[] = [];
    const positions: number[] = [];
    const texcoords: number[] = [];
    const normals: number[] = [];

    const lines = obj.split("\n");
    for(let i: number = 0; i < lines.length; i++) {
      const line = lines[i].split(" ");

      if(line[0] == "vt") {
        ezobj.insertUV(texcoords, parseFloat(line[1]), parseFloat(line[2]));
      }
      else if(line[0] == "vn") {
        ezobj.insertXYZ(normals, parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]));
      }
      else if(line[0] == "v") {
        ezobj.insertXYZ(positions, parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]));
      }
      else if(line[0] == "f") {
        ezobj.insertVertex(dest, positions, texcoords, normals, line[1]);
        ezobj.insertVertex(dest, positions, texcoords, normals, line[2]);
        ezobj.insertVertex(dest, positions, texcoords, normals, line[3]);
      }
    }
    return dest;
  },
};

export default ezobj;