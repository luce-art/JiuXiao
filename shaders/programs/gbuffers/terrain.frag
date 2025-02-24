// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;
in vec2 lmCoord;
in vec3 normal;
in vec4 glColor;

// Settings
/* DRAWBUFFERS:012 */
layout (location = 0) out vec4 colortex0Out;
layout (location = 1) out vec4 colortex1Out;
layout (location = 2) out vec4 colortex2Out;

// Main
void main() {
    vec4 color = texture2D(gtexture, texCoord) * glColor;
    colortex1Out = vec4(normal * 0.5 + 0.5, 1.0);
    colortex2Out = vec4(lmCoord, 0.0, 0.0);
    if(color.a < 0.01) {
        discard;
    }
    colortex0Out = pow(color, vec4(2.2));
}