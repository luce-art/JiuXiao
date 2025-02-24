// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;
in vec4 glColor;

// Settings
/* DRAWBUFFERS:0 */
layout (location = 0) out vec4 colortex0Out;

// Main
void main() {
    colortex0Out = texture(gtexture, texCoord) * glColor;
    if(colortex0Out.a < 0.01) {
        discard;
    }
}