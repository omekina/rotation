type Geometry = number[];
type Point = number[];


export default Geometry;


/**
 * The direction (anti-clockwise) goes: p1 -> p2 -> p3 -> p4
 */
export function geo_quad(p1: Point, p2: Point, p3: Point, p4: Point): Geometry {
    return p1
        .concat(p2)
        .concat(p3)
        .concat(p1)
        .concat(p3)
        .concat(p4);
}


export function geo_quad_normals(n: Point): Geometry {
    return n
        .concat(n)
        .concat(n)
        .concat(n)
        .concat(n)
        .concat(n);
}


export function geo_block(
    f1: Point,
    f2: Point,
    f3: Point,
    f4: Point,
    b1: Point,
    b2: Point,
    b3: Point,
    b4: Point,
): Geometry {
    return geo_quad(f1, f2, f3, f4) // front
        .concat(geo_quad(b1, f1, f4, b4)) // left
        .concat(geo_quad(b1, b2, f2, f1)) // bottom
        .concat(geo_quad(f2, b2, b3, f3)) // right
        .concat(geo_quad(f4, f3, b3, b4)) // up
        .concat(geo_quad(b2, b1, b4, b3)); // back
}


export function geo_block_normals(): Geometry {
    return geo_quad_normals([0, 0, 1]) // front
        .concat(geo_quad_normals([-1, 0, 0])) // left
        .concat(geo_quad_normals([0, -1, 0])) // bottom
        .concat(geo_quad_normals([1, 0, 0])) // right
        .concat(geo_quad_normals([0, 1, 0])) // up
        .concat(geo_quad_normals([0, 0, -1])); // back
}
