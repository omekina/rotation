export const VERTEX_SHADER_SOURCE: string = `
attribute vec4 a_pos;
attribute vec3 a_normal;

uniform mat4 u_object;
uniform mat4 u_normals;
uniform mat4 u_projection;

varying vec3 v_normal;
varying vec3 v_surface_to_camera;
varying vec3 v_surface_to_light1;
varying vec3 v_surface_to_light2;

void main() {
    vec4 position = u_object * a_pos;
    gl_Position = u_projection * position;

    v_normal = mat3(u_normals) * a_normal;

    vec3 cam_pos = vec3(0., 0., 0.);
    v_surface_to_camera = normalize(cam_pos - position.xyz);

    vec3 light_pos_1 = vec3(1., 0., 1.);
    vec3 light_pos_2 = vec3(-1., 0., -1.);
    v_surface_to_light1 = normalize(light_pos_1 - position.xyz);
    v_surface_to_light2 = normalize(light_pos_2 - position.xyz);
}
`;


export const FRAGMENT_SHADER_SOURCE: string = `
precision mediump float;

uniform vec3 u_light1_color;
uniform vec3 u_light2_color;

varying vec3 v_normal;
varying vec3 v_surface_to_camera;
varying vec3 v_surface_to_light1;
varying vec3 v_surface_to_light2;

void main() {
    float falloff_diffused = 2.;
    float falloff_reflected = 50.;

    vec3 half_vec_1 = normalize(v_surface_to_camera + v_surface_to_light1);
    vec3 half_vec_2 = normalize(v_surface_to_camera + v_surface_to_light2);

    float diffused1 = pow(clamp(dot(v_normal, v_surface_to_light1), 0., 1.), falloff_diffused) * .5;
    float reflected1 = pow(clamp(dot(v_normal, half_vec_1), 0., 1.), falloff_reflected);
    float diffused2 = pow(clamp(dot(v_normal, v_surface_to_light2), 0., 1.), falloff_diffused) * .5;
    float reflected2 = pow(clamp(dot(v_normal, half_vec_2), 0., 1.), falloff_reflected);

    gl_FragColor = vec4(u_light1_color * (diffused1 + reflected1) + u_light2_color * (diffused2 + reflected2), 1.);
}
`;
