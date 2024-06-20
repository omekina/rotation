import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from "./data/shaders";
import GLRotation from "./gltools/GLRotation";
import create_program from "./gltools/create_program";
import req_el from "./wtools/req_el";
import { set_unwrap_hook, unwrap } from "./wtools/unwrap";


async function main(): Promise<void> {
    const canvas: HTMLCanvasElement = req_el("#render-target");
    const gl: WebGLRenderingContext = unwrap(canvas.getContext("webgl2"), "Could not get webgl2 context from rendering canvas.");

    const program: WebGLProgram = create_program(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);

    GLRotation.init(gl, program, [0, 0, 0]);
}


var runtime_enable: boolean = true; // Whether to continue the runtime or not


set_unwrap_hook((error_message: string) => { // Unwrap error hook
    runtime_enable = false;
    const ERROR_DIALOG_INNER_HTML: string = "<h1>Error</h1><p>The program encountered an error during runtime. Try to restart the application.</p><br><p><b>Error detail:</b></p>";
    const error_details: HTMLElement = document.createElement("code");
    error_details.innerText = error_message;

    const error_dialog: HTMLDivElement = document.createElement("div");
    error_dialog.className = "error-wrapper";
    error_dialog.innerHTML = ERROR_DIALOG_INNER_HTML;
    error_dialog.appendChild(error_details);
    document.body.appendChild(error_dialog);
    setTimeout(() => {
        error_dialog.style.opacity = "1";
    }, 100);
});
main(); // Entrypoint
