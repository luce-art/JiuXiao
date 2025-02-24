// Uniforms
#include "/libs/uniforms.glsl"

// Variyngs
in vec2 texCoord;

// Settings
#include "/libs/settings.glsl"
/* DRAWBUFFERS:0 */
layout(location = 0) out vec4 color;

// Functions
#include "/libs/functions.glsl"

float drawSun(vec3 rayDir, vec3 lightDir) {
    float cosAngle = max(dot(rayDir, lightDir), 0.0);
    const float sunRadius = 0.02;
    float theta = acos(cosAngle);
    return theta > sunRadius ? exp(-32.0 * (theta - sunRadius)) : 1.0;
}

float fogify(float x, float w) {
	return w / (x * x + w);
}

vec3 drawSky(vec3 pos) {
	float upDot = dot(pos, upPosition) * 0.02;
    const float sunIntensity = 1.0;
	return mix(skyColor, fogColor * clamp(sunIntensity, 0.0, 1.0), fogify(max(upDot, 0.0), 0.25));
    return vec3(0.0);
}

// Main
void main(){
    color = texture(colortex0, texCoord);
    float depth = texture(depthtex0, texCoord).r;
    vec3 viewPos = screenToView(texCoord, depth);
    vec3 rayDir = normalize(viewPos);
    vec3 lightDir = normalize(shadowLightPosition);

    if(depth == 1.0) {
        color.rgb = drawSky(rayDir);
        color.rgb = mix(color.rgb, vec3(1.0), drawSun(rayDir, lightDir));
        return;
    }
}