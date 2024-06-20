import { call_unwrap_hook } from "../wtools/unwrap";


export type WebGLAttributeLocation = number;


export default function req_attr(gl: WebGLRenderingContext, program: WebGLProgram, attribute_name: string): WebGLAttributeLocation {
    const attribute_location: WebGLAttributeLocation = gl.getAttribLocation(program, attribute_name);
    if (attribute_location == -1) {
        call_unwrap_hook("Attribute \"" + attribute_name + "\" was not found in program.");
    }
    return attribute_location;
}
