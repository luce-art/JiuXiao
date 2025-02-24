// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;

// Settings
/* DRAWBUFFERS:0 */
layout (location = 0) out vec4 outColor;

// Main
void main() {
    outColor = texture(colortex0, texCoord);
    outColor = pow(outColor, vec4(1.0 / 2.2));
}