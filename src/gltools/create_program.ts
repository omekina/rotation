import { call_unwrap_hook, unwrap } from "../wtools/unwrap";


export default function create_program(
    gl: WebGLRenderingContext,
    vertex_shader_source: string,
    fragment_shader_source: string,
): WebGLProgram {
    const vertex_shader: WebGLShader = create_shader(gl, vertex_shader_source, gl.VERTEX_SHADER);
    const fragment_shader: WebGLShader = create_shader(gl, fragment_shader_source, gl.FRAGMENT_SHADER);
    
    const program: WebGLProgram = unwrap(gl.createProgram(), "Could not create a WebGLProgram object.");
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        call_unwrap_hook("WebGL program could not be linked.");
    }
    return program;
}


function create_shader(gl: WebGLRenderingContext, shader_source: string, shader_type: number): WebGLShader {
    const shader: WebGLShader = unwrap(gl.createShader(shader_type), "Unable to create a WebGLShader object.");
    gl.shaderSource(shader, shader_source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        call_unwrap_hook("Shader could not be compiled.\nShader source:\n" + shader_source);
    }
    return shader;
}
