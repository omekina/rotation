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

    v_surface_to_camera = normalize(vec3(0.) - position.xyz);

    v_surface_to_light1 = normalize(u_light1_pos - position.xyz);
    v_surface_to_light2 = normalize(u_light2_pos - position.xyz);
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

out vec4 frag_color;

void main() {
    float falloff_diffused = 2.;
    float falloff_reflected = 50.;

    vec3 half_vec_1 = normalize(v_surface_to_camera + v_surface_to_light1);
    vec3 half_vec_2 = normalize(v_surface_to_camera + v_surface_to_light2);

    float diffused1 = pow(clamp(dot(v_normal, v_surface_to_light1), 0., 1.), falloff_diffused) * .5;
    float reflected1 = pow(clamp(dot(v_normal, half_vec_1), 0., 1.), falloff_reflected);
    float diffused2 = pow(clamp(dot(v_normal, v_surface_to_light2), 0., 1.), falloff_diffused) * .5;
    float reflected2 = pow(clamp(dot(v_normal, half_vec_2), 0., 1.), falloff_reflected);

    frag_color = vec4(u_light1_color * (diffused1 + reflected1) + u_light2_color * (diffused2 + reflected2), 1.);
}
`;
