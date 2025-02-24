// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec4 glColor;

// Settings
/* DRAWBUFFERS:3 */
layout(location = 0) out vec4 colortex3Out;

// Main
void main(){
    if(renderStage == MC_RENDER_STAGE_STARS){
        colortex3Out = glColor;
    }
    colortex3Out = gl_Color;
}