type Matrix4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];


export default Matrix4;


export function mat4_translation(tx: number, ty: number, tz: number): Matrix4 {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1,
    ];
}


/**
 * @param {number} angle In radians
 */
export function mat4_rotation_x(angle: number): Matrix4 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
    ];
}

/**
 * @param {number} angle In radians
 */
export function mat4_rotation_y(angle: number): Matrix4 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
    ];
}

/**
 * @param {number} angle In radians
 */
export function mat4_rotation_z(angle: number): Matrix4 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return [
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}


export function mat4_scale(sx: number, sy: number, sz: number): Matrix4 {
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1,
    ];
}


/**
 * Warning: Matrices must have OpenGL in-memory layout.
 */
export function mat4_multiply(a: Matrix4, b: Matrix4) {
    let result: Matrix4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            let sum = 0;
            for (let k = 0; k < 4; ++k) {
                sum += a[i + k * 4] * b[j * 4 + k];
            }
            result[i + j * 4] = sum;
        }
    }
    return result;
}


/**
 * Calculates a projection matrix with the given parameters.
 *
 * @param {number} fov In degrees
 * @param {number} near Near clip-plane distance
 * @param {number} far Far clip-plane distance
 */
export function mat4_projection(fov: number, near: number, far: number, width: number, height: number): Matrix4 {
    const f = Math.tan((.5 - fov / 360.) * Math.PI);
    const range_inverse = 1. / (near - far);
    return [
        f / width, 0, 0, 0,
        0, f / height, 0, 0,
        0, 0, (near + far) * range_inverse, -1,
        0, 0, near * far * range_inverse * 2, 0,
    ];
}
