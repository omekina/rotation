import { geo_block, geo_block_normals } from "../gltools/Geometry";


// Light colors
export const LIGHT_1_COLOR: [number, number, number] = [0.7686, 0.6549, 0.9058];
export const LIGHT_2_COLOR: [number, number, number] = [0.1921, 0.4549, 0.5607];


// Light positions
export const LIGHT_1_POS: [number, number, number] = [1., 0., 1.];
export const LIGHT_2_POS: [number, number, number] = [-1., 0., -1.];


// Pointer
export const pointer_depth: number = .25;


// Buffer data
export const VERTEX_POSITIONS: number[] = geo_block(
    [-.5, -.75, .5],
    [.5, -.75, .5],
    [.5, .75, .5],
    [-.5, .75, .5],
    [-.5, -.75, -.5],
    [.5, -.75, -.5],
    [.5, .75, -.5],
    [-.5, .75, -.5],
);
export const VERTEX_NORMALS: number[] = geo_block_normals();
