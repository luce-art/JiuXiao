// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
out vec2 texCoord;
out vec4 glColor;

// Functions
#include "/libs/functions.glsl"

// Main
void main() {
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
    gl_Position.xyz = distortShadowClipPos(gl_Position.xyz);
    texCoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    glColor = gl_Color;
}