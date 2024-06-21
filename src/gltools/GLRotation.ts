import {
    unwrap
} from "../wtools/unwrap";

import * as scene from "../data/scene";

import Matrix4 from "./Matrix";
import * as mat4 from "./Matrix";

import req_attr, { WebGLAttributeLocation } from "./req_attr";
import req_ufrm from "./req_ufrm";


namespace GLRotation {
    // Atrributes
    let a_pos: WebGLAttributeLocation; // vec3
    let a_normal: WebGLAttributeLocation; // vec3

    // Uniforms
    let u_object: WebGLUniformLocation; // mat4
    let u_normals: WebGLUniformLocation; // mat3
    let u_projection: WebGLUniformLocation; // mat4
    let u_light1_color: WebGLUniformLocation; // vec4
    let u_light2_color: WebGLUniformLocation; // vec4
    let u_light1_pos: WebGLUniformLocation; // vec3
    let u_light2_pos: WebGLUniformLocation; // vec3

    // Buffers
    let positions_buffer: WebGLBuffer;
    let normals_buffer: WebGLBuffer;

    // Environment-wise variables
    let plane_size: [number, number] = [1, 1];
    let pointer_pos: [number, number];

    // GL base objects
    let gl: WebGLRenderingContext;
    let program: WebGLProgram;

    // Initialization check
    let initialized: boolean = false;


    // Initialization


    export function init(
        input_gl: WebGLRenderingContext,
        input_program: WebGLProgram,
        pointer_pos_init: [number, number],
        input_plane_size: [number, number],
    ): void {
        gl = input_gl;
        program = input_program;
        plane_size = input_plane_size;

        // Attributes
        a_pos = req_attr(gl, program, "a_pos");
        a_normal = req_attr(gl, program, "a_normal");

        // Uniforms
        u_object = req_ufrm(gl, program, "u_object");
        u_normals = req_ufrm(gl, program, "u_normals");
        u_projection = req_ufrm(gl, program, "u_projection");
        u_light1_color = req_ufrm(gl, program, "u_light1_color");
        u_light2_color = req_ufrm(gl, program, "u_light2_color");
        u_light1_pos = req_ufrm(gl, program, "u_light1_pos");
        u_light2_pos = req_ufrm(gl, program, "u_light2_pos");

        pointer_pos = pointer_pos_init;

        // Buffers
        positions_buffer = create_fill_buffer(gl, scene.VERTEX_POSITIONS);
        normals_buffer = create_fill_buffer(gl, scene.VERTEX_NORMALS);

        gl.useProgram(program);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Buffer data
        gl.enableVertexAttribArray(a_pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, positions_buffer);
        gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

        // Uniform data
        gl.uniform3fv(u_light1_color, new Float32Array(scene.LIGHT_1_COLOR));
        gl.uniform3fv(u_light2_color, new Float32Array(scene.LIGHT_2_COLOR));
        gl.uniform3fv(u_light1_pos, new Float32Array(scene.LIGHT_1_POS));
        gl.uniform3fv(u_light2_pos, new Float32Array(scene.LIGHT_2_POS));
        gl.uniformMatrix4fv(u_projection, false, new Float32Array(mat4.projection(
            90,
            .1,
            5,
            plane_size[0],
            plane_size[1]
        )));

        initialized = true;
    }

    export function set_pointer_pos(new_pointer_pos: [number, number]): void {
        pointer_pos = new_pointer_pos;
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
    function render_object(object_pos: [number, number]): void {
        const planar_distance: number = Math.hypot(object_pos[0] - pointer_pos[0], object_pos[1] - pointer_pos[1]);
        let depth_angle: number = Math.PI / 2.;
        if (planar_distance > 0) {
            depth_angle = Math.atan(scene.pointer_depth / planar_distance);
        }

        const object_rotation: Matrix4 = mat4.multiply(
            mat4.rotation_z(-Math.atan2(pointer_pos[0] - object_pos[0], pointer_pos[1] - object_pos[1])),
            mat4.rotation_x(depth_angle),
        );
        const object_transformation: Matrix4 = mat4.multiply(
            mat4.multiply(
                mat4.scale(.9, .9, 1),
                mat4.translation(object_pos[0], object_pos[1], -1.0 - Math.pow(planar_distance * .1, 1.5)),
            ),
            mat4.multiply(
                mat4.scale(.02, .02, .02),
                object_rotation,
            ),
        );
        gl.uniformMatrix4fv(u_object, false, new Float32Array(object_transformation));
        gl.uniformMatrix4fv(u_normals, false, new Float32Array(object_rotation));
        gl.drawArrays(gl.TRIANGLES, 0, scene.VERTEX_POSITIONS.length / 3);
    }

    
    // Rendering entrypoint
    

    export function render(): void {
        if (!initialized) { return; }
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i <= 50; ++i) {
            for (let j = 0; j <= 50; ++j) {
                render_object([i / 25 - 1, j / 25 - 1]);
            }
        }
    }
}


export default GLRotation;
