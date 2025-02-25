// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;

// Settings
/* DRAWBUFFERS:0 */
layout (location = 0) out vec4 colortex0Out;

// Functions
#include "/libs/tonemap.glsl"

// Main
void main() {
    colortex0Out = texture(colortex0, texCoord);
    // Tonemap
    colortex0Out.rgb = reinhard_extended(colortex0Out.rgb * 1.2, 1.0);
    colortex0Out = pow(colortex0Out, vec4(1.0 / 2.2));
}