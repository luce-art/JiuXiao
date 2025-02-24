// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;
in vec4 glColor;

// Settings
/* DRAWBUFFERS:0 */
layout (location = 0) out vec4 outColor;

// Main
void main() {
    outColor = texture(gtexture, texCoord) * glColor;
    if(outColor.a < 0.01) {
        discard;
    }
}