export const VERTEX_SHADER_SOURCE: string = `#version 300 es
in vec4 a_pos;
in vec3 a_normal;

uniform mat4 u_object;
uniform mat4 u_normals;
uniform mat4 u_projection;
uniform vec3 u_light1_pos;
uniform vec3 u_light2_pos;

out vec3 v_normal;
out vec3 v_surface_to_camera;
out vec3 v_surface_to_light1;
out vec3 v_surface_to_light2;

void main() {
    vec4 position = u_object * a_pos;
    gl_Position = u_projection * position;

    v_normal = mat3(u_normals) * a_normal;

    v_surface_to_camera = - position.xyz;

    v_surface_to_light1 = u_light1_pos - position.xyz;
    v_surface_to_light2 = u_light2_pos - position.xyz;
}
`;


export const FRAGMENT_SHADER_SOURCE: string = `#version 300 es
precision mediump float;

uniform vec3 u_light1_color;
uniform vec3 u_light2_color;

in vec3 v_normal;
in vec3 v_surface_to_camera;
in vec3 v_surface_to_light1;
in vec3 v_surface_to_light2;

vec3 surface_to_light1;
vec3 surface_to_light2;
vec3 surface_to_camera;
vec3 normal;

out vec4 frag_color;

void main() {
    surface_to_light1 = normalize(v_surface_to_light1);
    surface_to_light2 = normalize(v_surface_to_light2);
    surface_to_camera = normalize(v_surface_to_camera);
    normal = normalize(v_normal);

    float falloff_diffused = 2.;
    float falloff_reflected = 50.;

    vec3 half_vec_1 = normalize(surface_to_camera + surface_to_light1);
    vec3 half_vec_2 = normalize(surface_to_camera + surface_to_light2);

    float diffused1 = pow(clamp(dot(normal, surface_to_light1), 0., 1.), falloff_diffused) * .5;
    float reflected1 = pow(clamp(dot(normal, half_vec_1), 0., 1.), falloff_reflected);
    float diffused2 = pow(clamp(dot(normal, surface_to_light2), 0., 1.), falloff_diffused) * .5;
    float reflected2 = pow(clamp(dot(normal, half_vec_2), 0., 1.), falloff_reflected);

    frag_color = vec4(u_light1_color * (diffused1 + reflected1) + u_light2_color * (diffused2 + reflected2), 1.);
}
`;


export const VERTEX_SHADER_FILTER_SOURCE: string = `#version 300 es
in vec3 a_pos;


out vec2 v_texcoord;

void main() {
    v_texcoord = vec2(a_pos) * .5 + .5;
    gl_Position = vec4(a_pos, 1.);
}
`;


export const FRAGMENT_SHADER_FILTER_SOURCE: string = `#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_res;

out vec4 frag_color;

const float glare_threshold = 1.2;
const int halfwindow_size = 5;

vec4 glare() {
    vec4 result = vec4(0.);
    for (int x = -halfwindow_size; x <= halfwindow_size; ++x) {
        for (int y = -halfwindow_size; y <= halfwindow_size; ++y) {
            vec2 texel = vec2(float(x), float(y)) / u_res;
            vec4 cur_color = texture(u_texture, v_texcoord + texel);
            result += clamp(cur_color * (length(cur_color) - glare_threshold), 0., .2);
        }
    }
    return result / (pow(float(halfwindow_size), 2.) + 2.);
}

void main() {
    frag_color = texture(u_texture, v_texcoord) + glare();
}
`;
