var I=Object.defineProperty;var k=(r,e,t)=>e in r?I(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var d=(r,e,t)=>k(r,typeof e!="symbol"?e+"":e,t);import{h as Y,r as x,s as S,d as M,b as X,e as j,o as G,c as O,a as p,f as W,w as V,g as N,t as H,_ as $}from"./index-DfuJDJuI.js";const g={fSSC0:null,vSS:null,fSSC1:null,fSS:null,triangle:[]},R=Y("webgl",()=>{const r=x();return{gl:r,setWebGl:t=>{r.value=t}}}),{gl:C}=S(R());class B{constructor(e,t){d(this,"shader");this.shader=C.value.createShader(e),C.value.shaderSource(this.shader,t),C.value.compileShader(this.shader)}free(){C.value.deleteShader(this.shader)}}const{gl:c}=S(R());class q{constructor(){d(this,"color");d(this,"masks");d(this,"depthTest");this.color=[0,0,0,1],c.value.clearColor(0,0,0,1),this.masks=c.value.COLOR_BUFFER_BIT,this.depthTest=!1,g.fSSC0=`#version 300 es
			precision mediump float;
			
			out vec4 o_Color;
			
			in vec2 v_TexCoord;
			
			uniform vec4 u_Color;
			uniform sampler2D u_TexID[16];
`,g.fSSC1=`
void main() {
				o_Color = shader();
			}`,g.vSS=new B(c.value.VERTEX_SHADER,`#version 300 es
			precision mediump float;
			
			layout(location = 0) in vec3 a_Position;
			layout(location = 1) in vec2 a_TexCoord;
			layout(location = 2) in vec3 a_Normal;
			
			uniform mat4 u_Projection;
			uniform mat4 u_View;
			uniform mat4 u_Model;
			
			out vec2 v_TexCoord;
			
			void main() {
			gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
				v_TexCoord = a_TexCoord;
				v_TexCoord.y = 1.0 - v_TexCoord.y;
			}`),g.fSS=new B(c.value.FRAGMENT_SHADER,g.fSSC0+`
vec4 shader() { return u_Color; }
`+g.fSSC1),g.triangle=[-.5,-.5,0,0,0,0,0,1,0,.5,0,.5,1,0,0,1,.5,-.5,0,1,0,0,0,1]}depthTesting(e){e&&!this.depthTest?(this.masks=c.value.COLOR_BUFFER_BIT|c.value.DEPTH_BUFFER_BIT,c.value.enable(c.value.DEPTH_TEST),this.depthTest=!0):!e&&this.depthTest&&(this.masks=c.value.COLOR_BUFFER_BIT,c.value.disable(c.value.DEPTH_TEST),this.depthTest=!1)}clear(e=[0,0,0,1]){e!=this.color&&(c.value.clearColor(e[0],e[1],e[2],e[3]),this.color=e),c.value.clear(this.masks)}draw(e,t){t.shader.bind();for(let s=0;s<t.textures.length;s++)t.textures[s].bind(s);e.vertexbuffer.draw(),t.shader.unbind()}}const{gl:a}=S(R());class Z{constructor(){d(this,"va");d(this,"vb");d(this,"stride");d(this,"length");d(this,"vertices");this.va=a.value.createVertexArray(),a.value.bindVertexArray(this.va),this.vb=a.value.createBuffer(),a.value.bindBuffer(a.value.ARRAY_BUFFER,this.vb),this.stride=0,this.length=0,this.vertices=0,a.value.bindBuffer(a.value.ARRAY_BUFFER,null),a.value.bindVertexArray(null)}free(){a.value.deleteBuffer(this.vb),a.value.deleteVertexArray(this.va)}vertexLayout(e=[3,2,3]){for(let s=0;s<e.length;s++)this.stride+=e[s]*4;a.value.bindVertexArray(this.va),a.value.bindBuffer(a.value.ARRAY_BUFFER,this.vb);let t=0;for(let s=0;s<e.length;s++)a.value.vertexAttribPointer(s,e[s],a.value.FLOAT,!1,this.stride,t),a.value.enableVertexAttribArray(s),t+=e[s]*4;a.value.bindBuffer(a.value.ARRAY_BUFFER,null),a.value.bindVertexArray(null),this.stride=this.stride/4,this.vertices=this.length/this.stride}vertexData(e){this.length=e.length,a.value.bindVertexArray(this.va),a.value.bindBuffer(a.value.ARRAY_BUFFER,this.vb),a.value.bufferData(a.value.ARRAY_BUFFER,new Float32Array(e),a.value.STATIC_DRAW),a.value.bindBuffer(a.value.ARRAY_BUFFER,null),a.value.bindVertexArray(null),this.vertices=this.length/this.stride}draw(){a.value.bindVertexArray(this.va),a.value.bindBuffer(a.value.ARRAY_BUFFER,this.vb),a.value.drawArrays(a.value.TRIANGLES,0,this.vertices),a.value.bindBuffer(a.value.ARRAY_BUFFER,null),a.value.bindVertexArray(null)}}const l={insertXYZ:function(r,e,t,s){r.push(e),r.push(t),r.push(s)},insertUV:function(r,e,t){r.push(e),r.push(t)},getX:function(r,e){return r[e*3]},getY:function(r,e){return r[e*3+1]},getZ:function(r,e){return r[e*3+2]},getU:function(r,e){return r[e*2]},getV:function(r,e){return r[e*2+1]},getIndex:function(r){return parseInt(r)-1},insertVertex:function(r,e,t,s,u){const o=u.split("/"),b=l.getIndex(o[0]),n=l.getIndex(o[1]),F=l.getIndex(o[2]);r.push(l.getX(e,b)),r.push(l.getY(e,b)),r.push(l.getZ(e,b)),r.push(l.getU(t,n)),r.push(l.getV(t,n)),r.push(l.getX(s,F)),r.push(l.getY(s,F)),r.push(l.getZ(s,F))},load:function(r){const e=[],t=[],s=[],u=[],o=r.split(`
`);for(let b=0;b<o.length;b++){const n=o[b].split(" ");n[0]=="vt"?l.insertUV(s,parseFloat(n[1]),parseFloat(n[2])):n[0]=="vn"?l.insertXYZ(u,parseFloat(n[1]),parseFloat(n[2]),parseFloat(n[3])):n[0]=="v"?l.insertXYZ(t,parseFloat(n[1]),parseFloat(n[2]),parseFloat(n[3])):n[0]=="f"&&(l.insertVertex(e,t,s,u,n[1]),l.insertVertex(e,t,s,u,n[2]),l.insertVertex(e,t,s,u,n[3]))}return e}};class z{constructor(){d(this,"vertexbuffer");this.vertexbuffer=new Z,this.vertexbuffer.vertexLayout([3,2,3])}free(){this.vertexbuffer.free()}loadFromData(e){this.vertexbuffer.vertexData(e)}loadFromOBJ(e){this.vertexbuffer.vertexData(g.triangle),fetch(e).then(t=>{t.text().then(s=>{const u=l.load(s);this.vertexbuffer.vertexData(u)})})}}const{gl:i}=S(R());class J{constructor(){d(this,"program");this.program=i.value.createProgram()}free(){i.value.deleteProgram(this.program)}join(e){return i.value.attachShader(this.program,e.shader),this}link(){return i.value.linkProgram(this.program),i.value.useProgram(this.program),i.value.useProgram(null),this}bind(){return i.value.useProgram(this.program),this}unbind(){return i.value.useProgram(null),this}set1i(e,t){return i.value.uniform1i(i.value.getUniformLocation(this.program,e),t),this}set1f(e,t){return i.value.uniform1f(i.value.getUniformLocation(this.program,e),t),this}set2f(e,t,s){return i.value.uniform2f(i.value.getUniformLocation(this.program,e),t,s),this}set3f(e,t,s,u){return i.value.uniform3f(i.value.getUniformLocation(this.program,e),t,s,u),this}set4f(e,t,s,u,o){return i.value.uniform4f(i.value.getUniformLocation(this.program,e),t,s,u,o),this}set4x4f(e,t){return i.value.uniformMatrix4fv(i.value.getUniformLocation(this.program,e),!1,t),this}}const{gl:K}=S(R());class Q{constructor(e=null){d(this,"shader");d(this,"textures",[]);if(this.shader=new J,this.shader.join(g.vSS),!e)this.shader.join(g.fSS),this.shader.link();else{const t=new B(K.value.FRAGMENT_SHADER,g.fSSC0+e+g.fSSC1);this.shader.join(t),this.shader.link(),t.free()}this.shader.bind(),this.textures=[],this.shader.set4f("u_Color",1,1,1,1);for(let t=0;t<16;t++)this.shader.set1i("u_TexID["+t+"]",t);this.shader.unbind()}free(){this.shader.free()}setProjection(e){this.shader.bind(),this.shader.set4x4f("u_Projection",e),this.shader.unbind()}setView(e){this.shader.bind(),this.shader.set4x4f("u_View",e),this.shader.unbind()}setModel(e){this.shader.bind(),this.shader.set4x4f("u_Model",e),this.shader.unbind()}setColor(e=[1,1,1,1]){this.shader.bind(),this.shader.set4f("u_Color",e[0],e[1],e[2],e[3]),this.shader.unbind()}setTexture(e,t=0){this.textures[t]=e.texture}}const ee={id:"drawing-area"},te={class:"btn-container"},re={class:"btn-container"},se=M({__name:"WebXrTutorial",setup(r){const e=x(),t=x(""),s=x(!1),u=x(),o=x(null),b=x();X(v=>(console.log(v),t.value="Failed to activate XR: "+((v==null?void 0:v.message)??"None"),alert(t.value),s.value=!0,!1));const n=()=>{e.value.width=e.value.clientWidth*window.devicePixelRatio,e.value.height=e.value.clientHeight*window.devicePixelRatio},F=()=>{o.value=null},y=v=>{o.value=v,o.value.addEventListener("end",F),U({xrCompatible:!0}),o.value.updateRenderState({baseLayer:new XRWebGLLayer(o.value,f.value)}),o.value.requestReferenceSpace("local").then(m=>{b.value=m,o.value.requestAnimationFrame(h)});const h=(m,_)=>{const w=_.session;w.requestAnimationFrame(h);let A=_.getViewerPose(b.value);if(A){let E=w.renderState.baseLayer;f.value.bindFramebuffer(f.value.FRAMEBUFFER,E.framebuffer),f.value.clearColor(.4,.7,.9,1),f.value.clear(f.value.COLOR_BUFFER_BIT|f.value.DEPTH_BUFFER_BIT);for(let D of A.views){let T=E.getViewport(D);f.value.viewport(T.x,T.y,T.width,T.height)}}}};j(async()=>{navigator.xr&&await navigator.xr.isSessionSupported("immersive-vr")&&u.value&&(u.value.disabled=!1,u.value.textContent="Enter VR")});const{gl:f}=S(R()),U=v=>{if(f.value=e.value.getContext("webgl2",v||{alpha:!1}),!f.value){alert("This browser does not support WebGL 2.");return}e.value.setAttribute("style","position: absolute; width: 100%; height: 100%; left: 0; top: 0; right: 0; bottom: 0; margin: 0; z-index: -1;"),n()},P=async()=>{o.value?o.value.end():navigator.xr.requestSession("immersive-vr").then(y)},L=async()=>{var A;f.value=((A=e.value)==null?void 0:A.getContext("webgl2",{xrCompatible:!0}))||void 0,f.value||alert("No webgl found"),n();const v=new q;v.clear([.3,1,.4,1]);const h=new z;h.loadFromData(g.triangle);const m=new Q,_=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);m.setProjection(_),m.setView(_),m.setModel(_);const w=()=>{f.value.viewport(0,0,e.value.width,e.value.height),v.clear([.3,1,.4,1]),v.draw(h,m),window.requestAnimationFrame(w)};window.requestAnimationFrame(w)};return(v,h)=>(G(),O("main",null,[p("div",ee,[p("canvas",{ref_key:"canvas",ref:e,class:"canvas-container"},null,512)]),p("div",te,[p("button",{onClick:h[0]||(h[0]=m=>L())},"Enable XR")]),p("div",re,[p("button",{ref_key:"enableVrButton",ref:u,onClick:h[1]||(h[1]=m=>P())},"Initialising...",512)]),W(N,{show:s.value,onClose:h[2]||(h[2]=m=>s.value=!1)},{header:V(()=>h[3]||(h[3]=[p("h3",null,"Something went wrong",-1)])),body:V(()=>[p("div",null," Error occurred: "+H(t.value),1)]),_:1},8,["show"])]))}}),ie=$(se,[["__scopeId","data-v-32025db5"]]);export{ie as default};
