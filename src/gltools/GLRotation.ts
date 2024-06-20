import { unwrap } from "../wtools/unwrap";
import { geo_block, geo_block_normals } from "./Geometry";
import { mat4_projection } from "./Matrix";
import req_attr, { WebGLAttributeLocation } from "./req_attr";
import req_ufrm from "./req_ufrm";


namespace GLRotation {
    const LIGHT_1_COLOR: [number, number, number, number] = [1, 0, 0, 1];
    const LIGHT_2_COLOR: [number, number, number, number] = [1, 0, 0, 1];

    let a_pos: WebGLAttributeLocation; // vec3
    let a_normal: WebGLAttributeLocation; // vec3

    let u_object: WebGLUniformLocation; // mat4
    let u_normals: WebGLUniformLocation; // mat3
    let u_projection: WebGLUniformLocation; // mat4
    let u_light1_color: WebGLUniformLocation; // vec4
    let u_light2_color: WebGLUniformLocation; // vec4

    let positions_buffer: WebGLBuffer;
    let normals_buffer: WebGLBuffer;
    
    const VERTEX_POSITIONS: number[] = geo_block(
        [-.5, -.75, .5],
        [.5, -.75, .5],
        [.5, .75, .5],
        [-.5, .75, .5],
        [-.5, -.75, -.5],
        [.5, -.75, -.5],
        [.5, .75, -.5],
        [-.5, .75, -.5],
    );
    const VERTEX_NORMALS: number[] = geo_block_normals();

    let pointer_pos: [number, number, number];

    let initialized: boolean = false;


    // Initialization


    export function init(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        pointer_pos_ref: [number, number, number]
    ): void {
        // Attributes
        a_pos = req_attr(gl, program, "a_pos");
        a_normal = req_attr(gl, program, "a_normal");

        // Uniforms
        u_object = req_ufrm(gl, program, "u_object");
        u_normals = req_ufrm(gl, program, "u_normals");
        u_projection = req_ufrm(gl, program, "u_projection");
        u_light1_color = req_ufrm(gl, program, "u_light1_color");
        u_light2_color = req_ufrm(gl, program, "u_light2_color");

        pointer_pos = pointer_pos_ref;

        // Buffers
        positions_buffer = create_fill_buffer(gl, VERTEX_POSITIONS);
        normals_buffer = create_fill_buffer(gl, VERTEX_NORMALS);

        gl.useProgram(program);

        // Buffer data
        gl.bindBuffer(gl.ARRAY_BUFFER, positions_buffer);
        gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

        // Uniform data
        gl.uniform4f(u_light1_color, LIGHT_1_COLOR[0], LIGHT_1_COLOR[1], LIGHT_1_COLOR[2], LIGHT_1_COLOR[3]);
        gl.uniform4f(u_light2_color, LIGHT_2_COLOR[0], LIGHT_2_COLOR[1], LIGHT_2_COLOR[2], LIGHT_2_COLOR[3]);
        gl.uniformMatrix4fv(u_projection, false, mat4_projection(80, .3, 5));

        initialized = true;
    }

    function create_fill_buffer(
        gl: WebGLRenderingContext,
        buffer_values: number[],
    ): WebGLBuffer {
        const buffer: WebGLBuffer = unwrap(gl.createBuffer(), "Unable to create a WebGLBuffer object.");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer_values), gl.STATIC_DRAW);
        return buffer;
    }


    // Single object rendering


    /**
     * Warning: Does not set iteration-wide uniforms
     */
    function render_object(object_pos: [number, number, number]): void {

    }
}


export default GLRotation;
