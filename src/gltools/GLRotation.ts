import { unwrap } from "../wtools/unwrap";
import { geo_block, geo_block_normals } from "./Geometry";
import Matrix4, { mat4_multiply, mat4_projection, mat4_rotation_y, mat4_scale, mat4_translation } from "./Matrix";
import req_attr, { WebGLAttributeLocation } from "./req_attr";
import req_ufrm from "./req_ufrm";


namespace GLRotation {
    const LIGHT_1_COLOR: [number, number, number] = [1, .686, .369];
    const LIGHT_2_COLOR: [number, number, number] = [.38, .835, 1];

    const pointer_depth: number = 1;

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

    let pointer_pos: [number, number];

    let gl: WebGLRenderingContext;
    let program: WebGLProgram;

    let initialized: boolean = false;


    // Initialization


    export function init(
        input_gl: WebGLRenderingContext,
        input_program: WebGLProgram,
        pointer_pos_init: [number, number]
    ): void {
        gl = input_gl;
        program = input_program;

        // Attributes
        a_pos = req_attr(gl, program, "a_pos");
        a_normal = req_attr(gl, program, "a_normal");

        // Uniforms
        u_object = req_ufrm(gl, program, "u_object");
        u_normals = req_ufrm(gl, program, "u_normals");
        u_projection = req_ufrm(gl, program, "u_projection");
        u_light1_color = req_ufrm(gl, program, "u_light1_color");
        u_light2_color = req_ufrm(gl, program, "u_light2_color");

        pointer_pos = pointer_pos_init;

        // Buffers
        positions_buffer = create_fill_buffer(gl, VERTEX_POSITIONS);
        normals_buffer = create_fill_buffer(gl, VERTEX_NORMALS);

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
        gl.uniform3fv(u_light1_color, new Float32Array(LIGHT_1_COLOR));
        gl.uniform3fv(u_light2_color, new Float32Array(LIGHT_2_COLOR));
        gl.uniformMatrix4fv(u_projection, false, new Float32Array(mat4_projection(90, .1, 5)));

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
            depth_angle = Math.atan(pointer_depth / planar_distance);
        }

        const object_rotation: Matrix4 = mat4_rotation_y(depth_angle);
        const object_transformation: Matrix4 = mat4_multiply(
            mat4_multiply(
                mat4_translation(object_pos[0], object_pos[1], -1.0),
                mat4_scale(.1, .1, .1),
            ),
            object_rotation,
        );
        gl.uniformMatrix4fv(u_object, false, new Float32Array(object_transformation));
        gl.uniformMatrix4fv(u_normals, false, new Float32Array(object_rotation));
        gl.drawArrays(gl.TRIANGLES, 0, VERTEX_POSITIONS.length / 3);
    }

    
    // Rendering entrypoint
    

    export function render(): void {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i < 10; ++i) {
            for (let j = 0; j < 10; ++j) {
                render_object([i / 5 - 1, j / 5 - 1]);
            }
        }
    }
}


export default GLRotation;
