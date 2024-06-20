import { unwrap } from "../wtools/unwrap";


export default function req_ufrm(gl: WebGLRenderingContext, program: WebGLProgram, uniform_name: string): WebGLUniformLocation {
    return unwrap(
        gl.getUniformLocation(program, uniform_name),
        "Uniform \"" + uniform_name + "\" was not found in the program."
    );
}
