import {
  Scene,
  Vector3,
  WebXRDefaultExperience,
  ShadowGenerator,
  DirectionalLight,
  HemisphericLight,
  WebXRFeaturesManager,
  Quaternion,
  PolygonMeshBuilder,
  Vector2,
  Mesh,
  StandardMaterial,
  type IWebXRPlane,
  Color3,
  type Nullable,
  WebXRPlaneDetector,
  WebXRFeatureName
} from '@babylonjs/core'

import { Inspector } from '@babylonjs/inspector';
import { Engine } from '@babylonjs/core/Engines/engine'

type classArguments = {
  debug: boolean;
  canvas: HTMLCanvasElement;
  canvasId: string;
}

/**
 * Represents the available session modes.
 * Possible values are "immersive-ar", "immersive-vr", and "inline".
 */
type SessionModes = "immersive-ar" | "immersive-vr" | "inline";

/**
 * Represents the type of reference space.
 * Possible values are "local-floor", "bounded-floor", "unbounded", "local", and "viewer".
 */
type ReferenceSpaceType = "local-floor" | "bounded-floor" | "unbounded" | "local" | "viewer";


class XrExperience {
  _canvas: HTMLCanvasElement;
  _engine: Engine;
  _scene: Scene;
  _debug: boolean;
  _xr: WebXRDefaultExperience | null;
  _sessionMode: SessionModes;
  _referenceSpaceType: ReferenceSpaceType;
  _optionalFeatures: boolean;
  _fm: WebXRFeaturesManager | null;
  _shadowGenerator: ShadowGenerator | null;
  _xrPlanes: WebXRPlaneDetector | null;
  _planes: Mesh[] = [];

  /**
   * Constructs a new instance of the class.
   * @throws {string} Throws an error if WebGL is not supported.
   */
  constructor(args: classArguments) {
    if (!Engine.isSupported()) {
      throw 'WebGL not supported';
    }

    this._canvas = (args.canvas ?? document.getElementById(args.canvasId) )as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);
    this._debug = args.debug;
    this._sessionMode = "immersive-ar";
    this._referenceSpaceType = "viewer";
    this._optionalFeatures = true;
    this._xr = null;
    this._fm = null;
    this._shadowGenerator = null;
    this._xrPlanes = null;
    this._planes = [];

    this.createXrExperience().then(() => {
      this.createScene().then(() => {
        this._engine.runRenderLoop(() => {
          this._scene.render();
        });
        window.addEventListener('resize', () => {
          this._engine.resize();
        });
      });
    }).catch((error) => {
      console.log(error);
    });
  }


  /**
   *  Enables the WebXR default experience helper
   This enables default XR features such as as session, a camera, xr input, default UI to enter XR and scene transitions.
   We also configure the session to use AR and floor tracking.
   All optional features are enabled to allow for the most immersive experience..
   *  @returns A promise that resolves when the XR experience is created.
   */
  async createXrExperience(): Promise<void> {
    this._xr = await WebXRDefaultExperience.CreateAsync(this._scene, {
      uiOptions: {
        sessionMode: this._sessionMode,
        referenceSpaceType: this._referenceSpaceType,
        onError: (error) => {
          alert(error);
        }
      },
      optionalFeatures: this._optionalFeatures,
    });

    if (!this._xr.baseExperience) {
      throw new Error('Unable to create XR experience');
    }
  }


  /**
   * Adds features to the session.
   */
  addFeaturesToSession() {
    if (this._xr === null) {
      return;
    }
    this._fm = this._xr.baseExperience.featuresManager;

    try {
      this._xrPlanes = this._fm.enableFeature(WebXRFeatureName.PLANE_DETECTION, "latest") as WebXRPlaneDetector;
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * Creates the scene for the XR experience.
   * This function is called once when the scene is first created.
   * @returns A promise that resolves when the scene is created.
   */
  async createScene(): Promise<Scene> {

    this.createLightsAndShadows();
    this.createPlaneMeshesFromXrPlane();

    if (this._debug) Inspector.Show(this._scene, {});

    return this._scene;
  }


  /**
   * Creates a plane mesh from a detected plane.
   * @param xrPlane The detected plane.
   * @returns A plane mesh.
   */
  createPlaneMeshesFromXrPlane(): void {
    interface IWebXRPlaneWithMesh extends IWebXRPlane {
      mesh?: Mesh;
    }

    let mat: Nullable<StandardMaterial>;

    if (this._xrPlanes === null) {
      return;
    }

    this._xrPlanes.onPlaneAddedObservable.add((plane: IWebXRPlaneWithMesh) => {
      this._debug && console.log("plane added", plane);
      mat = new StandardMaterial("mat", this._scene);
      mat.alpha = 0.35;
      mat.diffuseColor = Color3.Random();
      this.initPolygon(plane, mat);
    });

    this._xrPlanes.onPlaneUpdatedObservable.add((plane: IWebXRPlaneWithMesh) => {
      if (this._planes[plane.id].material) {
        mat = this._planes[plane.id].material as StandardMaterial;
        this._planes[plane.id].dispose(false, false);
      }
      const some = plane.polygonDefinition.some(p => !p);
      if (some) {
        return;
      }
      this.initPolygon(plane, mat!);
    });

    this._xrPlanes.onPlaneRemovedObservable.add((plane: IWebXRPlaneWithMesh) => {
      if (plane && this._planes[plane.id]) {
        this._planes[plane.id].dispose()
      }
    })

    if (this._xr !== null) {
      this._xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
        this._planes.forEach((plane: Mesh) => plane.dispose());
        while (this._planes.pop());
      });
    }
  }


  /**
   * Initializes the polygon that represents the plane.
   * @param plane The plane.
   * @param mat The material.
   */
  initPolygon(plane: IWebXRPlane, mat?: StandardMaterial): Mesh {
    plane.polygonDefinition.push(plane.polygonDefinition[0]);
    const polygonTriangulation = new PolygonMeshBuilder(plane.xrPlane.orientation, plane.polygonDefinition.map((p: Vector3) => new Vector2(p.x, p.z)), this._scene);
    const polygon = polygonTriangulation.build(false, 0.01);

    polygon.createNormals(false);

    if (mat) {
      polygon.material = mat;
    }

    polygon.rotationQuaternion = new Quaternion();
    polygon.checkCollisions = true;
    polygon.receiveShadows = true;

    plane.transformationMatrix.decompose(polygon.scaling, polygon.rotationQuaternion, polygon.position);

    this._planes[plane.id] = (polygon);

    return polygon;
  }


  /**
   * Creates a shadow generator for the scene.
   * ! shadowGenerator can only be created with a directional light
   * @returns A shadow generator.
   */
  createLightsAndShadows() {
    const lights: DirectionalLight = this.createLights();

    const shadowGenerator = new ShadowGenerator(1024, lights as DirectionalLight);

    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
  }


  /**
   * Creates a light for the scene.
   * @returns A directional light.
   */
  createLights() {

    const directionalLight = new DirectionalLight("directionalLight", new Vector3(0, 1, 1), this._scene);
    directionalLight.intensity = 0.7;
    directionalLight.position = new Vector3(0, 2, 0);

    const hemiLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), this._scene);
    hemiLight.intensity = 0.7;

    return directionalLight;
  }
}

export default XrExperience;
// new XrExperience({ debug: false });