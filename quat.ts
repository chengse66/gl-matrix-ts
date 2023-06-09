import mat3 from "./mat3";
import mathf from "./mathf";
import vec3 from "./vec3";

export default class quat {
  private static readonly _identity: Float32Array = new Float32Array([0, 0, 0, 1]);
  /**
   * Quaternion in the format XYZW
   * @module quat
   */

  data: Float32Array;
  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.data = new Float32Array([x, y, z, w]);
  }

  /**
 * Creates a new quat initialized with values from an existing vector
 *
 * @param {quat} a vector to clone
 * @returns {quat} a new 4D vector
 */
  clone() {
    const x = this.data[0];
    const y = this.data[1];
    const z = this.data[2];
    const w = this.data[3];
    return new quat(x, y, z, w);
  }


  /**
   * Set a quat to the identity quaternion
   * @returns {quat} out
   */
  identity() {
    this.data.set(quat._identity);
    return this;
  }

  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   * @param {vec3} axis the axis around which to rotate
   * @param {number} rad the angle in radians
   * @returns {quat} out
   */
  setAxisAngle(axis: vec3, rad: number) {
    const a=axis.data;
    rad = rad * 0.5;
    let s = Math.sin(rad);
    return this.set(
      s * a[0],
      s * a[1],
      s * a[2],
      Math.cos(rad)
    );
  }

  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @param {vec3} out_axis Vector receiving the axis of rotation
   * @param {quat} rotation Quaternion to be decomposed
   * @return {number} Angle, in radians, of the rotation
   */
  getAxisAngle(out_axis: vec3, rotation: quat) {
    const a=out_axis.data;
    const q=rotation.data;
    let rad = Math.acos(q[3]) * 2.0;
    let s = Math.sin(rad / 2.0);
    if (s > mathf.EPSILON) {
      a[0] = q[0] / s;
      a[1] = q[1] / s;
      a[2] = q[2] / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      a[0] = 1;
      a[1] = 0;
      a[2] = 0;
    }
    return rad;
  }

  /**
   * Gets the angular distance between two unit quaternions
   *
   * @param  {quat} q     Destination unit quaternion
   * @return {number}     Angle, in radians, between the two quaternions
   */
  getAngle(q: quat) {
    let dotproduct = this.dot(q);
    return Math.acos(2 * dotproduct * dotproduct - 1);
  }

  /**
   * Calculates the dot product of two quat's
   * @param {quat} q the second operand
   * @returns {number} dot product of a and b
   */
  dot(q: quat) {
    const data=this.data
    const b=q.data;
    return data[0] * b[0] + data[1] * b[1] + data[2] * b[2] + data[3] * b[3];
  }

  /**
 * Set the components of a quat to the given values
 *
 * @param {number} x X component
 * @param {number} y Y component
 * @param {number} z Z component
 * @param {number} w W component
 * @returns {quat} out
 */
  set(x: number, y: number, z: number, w: number) {
    const data=this.data
    data[0] = x;
    data[1] = y;
    data[2] = z;
    data[3] = w;
    return this;
  }


  /**
   * Multiplies two quat's
   * @param {quat} q the second operand
   * @returns {quat} out
   */
  multiply(q: quat) {
    const data=this.data
    const b=q.data;
    let ax = data[0],
      ay = data[1],
      az = data[2],
      aw = data[3];
    let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
    return this.set(
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    );
  }

  /**
   * Rotates a quaternion by the given angle about the X axis
   *
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  rotateX(rad: number) {
    const data=this.data
    rad *= 0.5;

    let ax = data[0],
      ay = data[1],
      az = data[2],
      aw = data[3];
    let bx = Math.sin(rad),
      bw = Math.cos(rad);

    return this.set(
      ax * bw + aw * bx,
      ay * bw + az * bx,
      az * bw - ay * bx,
      aw * bw - ax * bx
    );
  }

  /**
   * Rotates a quaternion by the given angle about the Y axis
   *
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  rotateY(rad: number) {
    const data=this.data
    rad *= 0.5;

    let ax = data[0],
      ay = data[1],
      az = data[2],
      aw = data[3];
    let by = Math.sin(rad),
      bw = Math.cos(rad);

    return this.set(
      ax * bw - az * by,
      ay * bw + aw * by,
      az * bw + ax * by,
      aw * bw - ay * by
    );
  }

  /**
   * Rotates a quaternion by the given angle about the Z axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  rotateZ(rad: number) {
    const data=this.data
    rad *= 0.5;

    let ax = data[0],
      ay = data[1],
      az = data[2],
      aw = data[3];
    let bz = Math.sin(rad),
      bw = Math.cos(rad);

    return this.set(
      ax * bw + ay * bz,
      ay * bw - ax * bz,
      az * bw + aw * bz,
      aw * bw - az * bz
    );
  }

  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * @returns {quat} out
   */
  calculateW() {
    const data=this.data
    let x = data[0],
      y = data[1],
      z = data[2];

    return new quat(
      x, y, z,
      Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z))
    );
  }

  /**
   * Adds two quat's
   * @param {quat} q the second operand
   * @returns {quat} out
   */
  add(q: quat) {
    const data=this.data
    const b=q.data;
    data[0] = data[0] + b[0];
    data[1] = data[1] + b[1];
    data[2] = data[2] + b[2];
    data[3] = data[3] + b[3];
    return this;
  }

  /**
   * Subtracts vector b from vector a
   * @param {quat} q the second operand
   * @returns {quat} out
   */
  subtract(q: quat) {
    const data=this.data
    const b=q.data;
    data[0] = data[0] - b[0];
    data[1] = data[1] - b[1];
    data[2] = data[2] - b[2];
    data[3] = data[3] - b[3];
    return this;
  }

  /**
   * Divides two quat's
   * @param {quat} q the second operand
   * @returns {quat} out
   */
  divide(q: quat) {
    const data=this.data
    const b=q.data;
    data[0] = data[0] / b[0];
    data[1] = data[1] / b[1];
    data[2] = data[2] / b[2];
    data[3] = data[3] / b[3];
    return this;
  }


  /**
   * Performs a spherical linear interpolation between two quat
   * @param {quat} q the second operand
   * @param {number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */
  slerp(q: quat, t: number) {
    const data=this.data
    const b=q.data;
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    let ax = data[0],
      ay = data[1],
      az = data[2],
      aw = data[3];
    let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];

    let omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    // calculate coefficients
    if (1.0 - cosom > mathf.EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    }
    // calculate final values
    return new quat(
      scale0 * ax + scale1 * bx,
      scale0 * ay + scale1 * by,
      scale0 * az + scale1 * bz,
      scale0 * aw + scale1 * bw
    );
  }

  /**
   * Calculates the inverse of a quat
   *
   * @returns {quat} out
   */
  invert() {
    const data=this.data
    let a0 = data[0],
      a1 = data[1],
      a2 = data[2],
      a3 = data[3];
    let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    let invDot = dot ? 1.0 / dot : 0;

    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    return this.set(
      -a0 * invDot,
      -a1 * invDot,
      -a2 * invDot,
      a3 * invDot
    );
  }

  /**
   * Calculates the conjugate of a quat
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   * @returns {quat} out
   */
  conjugate() {
    const data=this.data
    data[0] = -data[0];
    data[1] = -data[1];
    data[2] = -data[2];
    data[3] = data[3];
    return this;
  }

  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   * 
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   * @param {mat3} matrix rotation matrix
   * @returns {quat} out
   * @function
   */
  fromMat3(matrix: mat3) {
    const data=this.data
    const m=matrix.data;
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    let fTrace = m[0] + m[4] + m[8];
    let fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w
      data[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)
      data[0] = (m[5] - m[7]) * fRoot;
      data[1] = (m[6] - m[2]) * fRoot;
      data[2] = (m[1] - m[3]) * fRoot;
    } else {
      // |w| <= 1/2
      let i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      let j = (i + 1) % 3;
      let k = (i + 2) % 3;

      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      data[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      data[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      data[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      data[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return this;
  }

  /**
   * Creates a quaternion from the given euler angle x, y, z using the provided intrinsic order for the conversion.
   *
   * @param {x} x Angle to rotate around X axis in degrees.
   * @param {y} y Angle to rotate around Y axis in degrees.
   * @param {z} z Angle to rotate around Z axis in degrees.
   * @param {'zyx'|'xyz'|'yxz'|'yzx'|'zxy'|'zyx'} order Intrinsic order for conversion, default is zyx.
   * @returns {quat} out
   * @function
   */
  fromEuler(x: number, y: number, z: number, order = mathf.ANGLE_ORDER) {
    const data=this.data
    let halfToRad = Math.PI / 360;
    x *= halfToRad;
    z *= halfToRad;
    y *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    switch (order) {
      case "xyz":
        data[0] = sx * cy * cz + cx * sy * sz;
        data[1] = cx * sy * cz - sx * cy * sz;
        data[2] = cx * cy * sz + sx * sy * cz;
        data[3] = cx * cy * cz - sx * sy * sz;
        break;

      case "xzy":
        data[0] = sx * cy * cz - cx * sy * sz;
        data[1] = cx * sy * cz - sx * cy * sz;
        data[2] = cx * cy * sz + sx * sy * cz;
        data[3] = cx * cy * cz + sx * sy * sz;
        break;

      case "yxz":
        data[0] = sx * cy * cz + cx * sy * sz;
        data[1] = cx * sy * cz - sx * cy * sz;
        data[2] = cx * cy * sz - sx * sy * cz;
        data[3] = cx * cy * cz + sx * sy * sz;
        break;

      case "yzx":
        data[0] = sx * cy * cz + cx * sy * sz;
        data[1] = cx * sy * cz + sx * cy * sz;
        data[2] = cx * cy * sz - sx * sy * cz;
        data[3] = cx * cy * cz - sx * sy * sz;
        break;

      case "zxy":
        data[0] = sx * cy * cz - cx * sy * sz;
        data[1] = cx * sy * cz + sx * cy * sz;
        data[2] = cx * cy * sz + sx * sy * cz;
        data[3] = cx * cy * cz - sx * sy * sz;
        break;

      case "zyx":
        data[0] = sx * cy * cz - cx * sy * sz;
        data[1] = cx * sy * cz + sx * cy * sz;
        data[2] = cx * cy * sz - sx * sy * cz;
        data[3] = cx * cy * cz + sx * sy * sz;
        break;

      default:
        throw new Error('Unknown angle order ' + order);
    }

    return this;
  }

  /**
 * Calculates the length of a vec4
 *
 * @returns {number} length of a
 */
  length() {
    const x=this.data[0];
    const y=this.data[1];
    const z=this.data[2];
    const w=this.data[3];
    return Math.hypot(x, y, z, w);
  }

  /**
   * Calculates the squared length of a vec4
   *
   * @returns {number} squared length of a
   */
  squaredLength() {
    const x=this.data[0];
    const y=this.data[1];
    const z=this.data[2];
    const w=this.data[3];
    return x * x + y * y + z * z + w * w;
  }

  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {vec3} a the initial vector
   * @param {vec3} b the destination vector
   * @returns {quat} out
   */
  rotationTo(a: vec3, b: vec3) {
    const data=this.data
    let tmpvec3 = new vec3();
    let xUnitVec3 = new vec3(1, 0, 0);
    let yUnitVec3 = new vec3(0, 1, 0);
    let dot = a.dot(b);
    if (dot < -0.999999) {
      xUnitVec3.cross(a)
      tmpvec3.copy(xUnitVec3.clone().cross(a));
      if (tmpvec3.length() < 0.000001) tmpvec3.cross(yUnitVec3);
      tmpvec3.normalize();
      this.setAxisAngle(tmpvec3, Math.PI);
      return this;
    } else if (dot > 0.999999) {
      data[0] = 0;
      data[1] = 0;
      data[2] = 0;
      data[3] = 1;
      return this;
    } else {
      tmpvec3.copy(a.clone().cross(b));
      data[0] = tmpvec3.data[0];
      data[1] = tmpvec3.data[1];
      data[2] = tmpvec3.data[2];
      data[3] = 1 + dot;
      return this.normalize();
    }
  };


  /**
   * Normalize a quat
   *
   * @returns {quat} out
   */
  normalize() {
    const data=this.data
    let x = data[0];
    let y = data[1];
    let z = data[2];
    let w = data[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    data[0] = x * len;
    data[1] = y * len;
    data[2] = z * len;
    data[3] = w * len;
    return this;
  }


  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} b the second operand
   * @param {quat} c the third operand
   * @param {quat} d the fourth operand
   * @param {number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */
  sqlerp(b: quat, c: quat, d: quat, t: number) {
    const temp1 = this.clone().slerp(d, t);
    const temp2 = b.clone().slerp(c, t);
    temp1.slerp(temp2, 2 * t * (1 - t));
    return temp1;
  };

  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {vec3} view  the vector representing the viewing direction
   * @param {vec3} right the vector representing the local "right" direction
   * @param {vec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */
  setAxes(view: vec3, right: vec3, up: vec3) {
    let _matrix = new mat3();
    const { data: matr } = _matrix;
    const { data: r } = right;
    const { data: v } = view;
    const { data: u } = up;
    matr[0] = r[0];
    matr[3] = r[1];
    matr[6] = r[2];

    matr[1] = u[0];
    matr[4] = u[1];
    matr[7] = u[2];

    matr[2] = -v[0];
    matr[5] = -v[1];
    matr[8] = -v[2];
    return this.fromMat3(_matrix).normalize();
  }
}