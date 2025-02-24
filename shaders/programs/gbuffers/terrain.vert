// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
out vec2 texCoord;
out vec2 lmCoord;
out vec3 normal;
out vec4 glColor;

// Main
void main() {
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
    texCoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lmCoord = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    lmCoord = (lmCoord * 33.05 / 32.0) - (1.05 / 32.0);
    normal = normalize(gl_NormalMatrix * gl_Normal);
    normal = mat3(gbufferModelViewInverse) * normal;
    glColor = gl_Color;
}