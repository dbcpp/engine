/**
 * @category 3d/primitive
 */

import { Vec3 } from '../math';
import { IGeometry, IGeometryOptions } from './define';
import { eMath } from '../../physics/cannon/cannon-eMath';

/**
 * @zh
 * 球参数选项。
 */
interface ISphereOptions extends IGeometryOptions {
    segments: number;
}

/**
 * @en
 * Generate a shpere with radius 0.5.
 * @zh
 * 生成一个球。
 * @param radius 球半径。
 * @param options 参数选项。
 */
export default function sphere (radius = 0.5, opts: RecursivePartial<ISphereOptions> = {}): IGeometry {
  const segments = opts.segments !== undefined ? opts.segments : 32;

  // lat === latitude
  // lon === longitude

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const minPos = new Vec3(-radius, -radius, -radius);
  const maxPos = new Vec3(radius, radius, radius);
  const boundingRadius = radius;

  for (let lat = 0; lat <= segments; ++lat) {
    const theta = lat * eMath.PI / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = -Math.cos(theta);

    for (let lon = 0; lon <= segments; ++lon) {
      const phi = lon * 2 * eMath.PI / segments - eMath.PI / 2.0;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = sinPhi * sinTheta;
      const y = cosTheta;
      const z = cosPhi * sinTheta;
      const u = lon / segments;
      const v = lat / segments;

      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);

      if ((lat < segments) && (lon < segments)) {
        const seg1 = segments + 1;
        const a = seg1 * lat + lon;
        const b = seg1 * (lat + 1) + lon;
        const c = seg1 * (lat + 1) + lon + 1;
        const d = seg1 * lat + lon + 1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return {
    positions,
    indices,
    normals,
    uvs,
    minPos,
    maxPos,
    boundingRadius,
  };
}
