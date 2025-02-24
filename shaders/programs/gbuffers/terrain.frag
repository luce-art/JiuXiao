// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;
in vec2 lmCoord;
in vec3 normal;
in vec4 glColor;

// Settings
/* DRAWBUFFERS:012 */
layout (location = 0) out vec4 outColor;
layout (location = 1) out vec4 encodedNormal;
layout (location = 2) out vec4 lightmapData;

// Main
void main() {
    vec4 color = texture2D(gtexture, texCoord) * glColor;
    encodedNormal = vec4(normal * 0.5 + 0.5, 1.0);
    lightmapData = vec4(lmCoord, 0.0, 0.0);
    if(color.a < 0.01) {
        discard;
    }
    outColor = pow(color, vec4(2.2));
}