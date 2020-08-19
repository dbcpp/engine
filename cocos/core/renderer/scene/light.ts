import { Vec3 } from '../../math';
import { TransformBit } from '../../scene-graph/node-enum';
import { RenderScene } from './render-scene';
import { Node } from '../../scene-graph';
import { eMath } from '../../../physics/cannon/cannon-eMath';

// Color temperature (in Kelvin) to RGB
export function ColorTemperatureToRGB (rgb: Vec3, kelvin: number) {
    if (kelvin < 1000.0) {
        kelvin = 1000.0;
    } else if (kelvin > 15000.0) {
        kelvin = 15000.0;
    }

    // Approximate Planckian locus in CIE 1960 UCS
    const kSqr = kelvin * kelvin;
    const u = (0.860117757 + 1.54118254e-4 * kelvin + 1.28641212e-7 * kSqr) / ( 1.0 + 8.42420235e-4 * kelvin + 7.08145163e-7 * kSqr);
    const v = (0.317398726 + 4.22806245e-5 * kelvin + 4.20481691e-8 * kSqr) / ( 1.0 - 2.89741816e-5 * kelvin + 1.61456053e-7 * kSqr);

    const d = (2.0 * u - 8.0 * v + 4.0);
    const x = 3.0 * u / d;
    const y = 2.0 * v / d;
    const z = 1.0 - x - y;

    const X = 1.0 / y * x;
    const Z = 1.0 / y * z;

    // XYZ to RGB with BT.709 primaries
    rgb.x =  3.2404542 * X + -1.5371385 + -0.4985314 * Z;
    rgb.y = -0.9692660 * X +  1.8760108 +  0.0415560 * Z;
    rgb.z =  0.0556434 * X + -0.2040259 +  1.0572252 * Z;
}

export enum LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    UNKNOWN,
}

export const nt2lm = (size: number) => 4 * eMath.PI * eMath.PI * size * size;

export class Light {

    set color (color: Vec3) {
        this._color.set(color);
    }

    get color (): Vec3 {
        return this._color;
    }

    set useColorTemperature (enable: boolean) {
        this._useColorTemp = enable;
    }

    get useColorTemperature (): boolean {
        return this._useColorTemp;
    }

    set colorTemperature (val: number) {
        this._colorTemp = val;
        ColorTemperatureToRGB(this._colorTempRGB, this._colorTemp);
    }

    get colorTemperature (): number {
        return this._colorTemp;
    }

    get colorTemperatureRGB (): Vec3 {
        return this._colorTempRGB;
    }

    set node (n) {
        this._node = n;
        if (this._node) {
            this._node.hasChangedFlags |= TransformBit.ROTATION;
        }
    }

    get node () {
        return this._node;
    }

    get type () {
        return this._type;
    }

    get name () {
        return this._name;
    }

    get scene () {
        return this._scene;
    }

    protected _color: Vec3 = new Vec3(1, 1, 1);
    protected _useColorTemp: boolean = false;
    protected _colorTemp: number = 6550.0;
    protected _colorTempRGB: Vec3 = new Vec3(1, 1, 1);
    protected _scene: RenderScene | null = null;
    protected _node: Node | null = null;
    protected _type: LightType;
    protected _name: string | null = null;

    constructor () {
        this._type = LightType.UNKNOWN;
    }

    public initialize (name: string, node: Node) {
        this._name = name;
        this._type = LightType.UNKNOWN;
        this._node = node;
    }

    public attachToScene (scene: RenderScene) {
        this._scene = scene;
    }

    public detachFromScene () {
        this._scene = null;
    }

    public destroy () {
        this._name = null;
        this._type = LightType.UNKNOWN;
        this._node = null;
    }

    public update () {}
}
