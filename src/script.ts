import { FRAGMENT_SHADER_FILTER_SOURCE, FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_FILTER_SOURCE, VERTEX_SHADER_SOURCE } from "./data/shaders";
import GLRotation from "./gltools/GLRotation";
import create_program from "./gltools/create_program";
import req_el from "./wtools/req_el";
import { set_unwrap_hook, unwrap } from "./wtools/unwrap";


async function main(): Promise<void> {
    const canvas: HTMLCanvasElement = req_el("#render-target");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const gl: WebGL2RenderingContext = unwrap(canvas.getContext("webgl2"), "Could not get webgl2 context from rendering canvas.");

    const program: WebGLProgram = create_program(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    const filter_program: WebGLProgram = create_program(gl, VERTEX_SHADER_FILTER_SOURCE, FRAGMENT_SHADER_FILTER_SOURCE);

    let plane_size: [number, number] = [1, 1];
    if (canvas.width > canvas.height) { plane_size = [canvas.width / canvas.height, 1]; }
    else { plane_size = [1, canvas.height / canvas.width]; }
    GLRotation.init(gl, program, filter_program, [0, 0], plane_size, [canvas.width, canvas.height]);
    if (window.matchMedia("(any-hover: none)").matches) {
        (<HTMLDivElement>req_el("#mobile-notification")).style.display = "flex";
        let step = 0;
        function update() {
            GLRotation.set_pointer_pos([Math.cos(step * Math.PI / 180), Math.sin(step * Math.PI / 180)]);
            GLRotation.render();
            ++step;
            requestAnimationFrame(update);
        }
        update();
    } else {
        GLRotation.render();
        window.addEventListener("mousemove", (event: MouseEvent) => {
            const bounding_rect: DOMRect = canvas.getBoundingClientRect();
            GLRotation.set_pointer_pos([
                (event.clientX - bounding_rect.x) / bounding_rect.width * 2 / .9 * plane_size[0] - 1 / .9 * plane_size[0],
                - (event.clientY - bounding_rect.y) / bounding_rect.height * 2 / .9 * plane_size[1] + 1 / .9 * plane_size[1],
            ]);
            GLRotation.render();
        });
    }
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
