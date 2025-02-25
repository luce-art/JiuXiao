// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;

// Settings
#include "/libs/settings.glsl"
/* DRAWBUFFERS:0 */
layout (location = 0) out vec4 colortex0Out;
const vec3 blocklightColor = vec3(1.0, 0.5, 0.20);
const vec3 skylightColor = vec3(0.05, 0.15, 0.3);
const vec3 sunlightColor = vec3(1.0);
const vec3 ambientColor = vec3(0.03);

// Functions
#include "/libs/functions.glsl"

vec3 getShadow(vec3 shadowScreenPos){
    float currentDepth = shadowScreenPos.z;

    float transparentClosestDepth = texture(shadowtex0, shadowScreenPos.xy).r;
    float transparentShadow = currentDepth > transparentClosestDepth ? 0.0 : 1.0;
    if(transparentShadow == 1.0) return vec3(1.0);

    float opaqueClosestDepth = texture(shadowtex1, shadowScreenPos.xy).r;
    float opaqueShadow = currentDepth > opaqueClosestDepth ? 0.0 : 1.0;
    if(opaqueShadow == 0.0) return vec3(0.0);

    vec4 shadowColor = texture(shadowcolor0, shadowScreenPos.xy);
    return shadowColor.rgb * (1 - shadowColor.a);
}

vec3 getSoftShadow(vec4 shadowClipPos){
  const float range = SHADOW_SOFTNESS / 2.0;
  const float increment = range / SHADOW_QUALITY;

  float noise = getNoise(texCoord).r;
  float theta = noise * radians(360.0);
  float cosTheta = cos(theta);
  float sinTheta = sin(theta);

  mat2 rotation = mat2(cosTheta, -sinTheta, sinTheta, cosTheta);

  vec3 shadowAccum = vec3(0.0);
  int samples = 0;

  for(float x = -range; x <= range; x += increment){
    for (float y = -range; y <= range; y+= increment){
      vec2 offset = rotation * vec2(x, y) / shadowMapResolution;
      vec4 offsetShadowClipPos = shadowClipPos + vec4(offset, 0.0, 0.0);
      offsetShadowClipPos.z -= 0.001;
      offsetShadowClipPos.xyz = distortShadowClipPos(offsetShadowClipPos.xyz);
      vec3 shadowNDCPos = offsetShadowClipPos.xyz / offsetShadowClipPos.w;
      vec3 shadowScreenPos = shadowNDCPos * 0.5 + 0.5;
      shadowAccum += getShadow(shadowScreenPos);
      samples++;
    }
  }

  return shadowAccum / float(samples); 
}

float exposure(vec3 color, float factor) {
  float skylight = float(eyeBrightnessSmooth.y) / 240;
  return pow(skylight, 6.0) * factor + (1.0 - factor);
}

// Main
void main() {
    colortex0Out = texture(colortex0, texCoord);
    vec3 normal = texture(colortex1, texCoord).xyz * 2.0 - 1.0;
    vec2 lightmap = texture(colortex2, texCoord).rg;
    float depth = texture(depthtex0, texCoord).r;

    // Skip Sky
    if(depth == 1.0) {
        return;
    }

    // Shadow
    vec3 viewPos = screenToView(texCoord, depth);
    vec3 feetPlayerPos = viewToFeetPlayer(viewPos);
    vec3 eyePlayerPos = viewToEyePlayer(viewPos);
    vec3 shadowViewPos = feetPlayerToShadowView(feetPlayerPos);
    vec4 shadowClipPos = shadowProjection * vec4(shadowViewPos, 1.0);

    vec3 shadow = getSoftShadow(shadowClipPos);

    // Lighting
    float isNight = 0;
    if(12000 < worldTime && worldTime < 13000) isNight = 1.0 - (13000 - worldTime) / 1000.0;
    else if(13000 <= worldTime && worldTime <= 23000) isNight = 1;
    else if(23000 < worldTime) isNight = (24000 - worldTime) / 1000.0;

    vec3 blocklight = blocklightColor * lightmap.r;
    vec3 skylight = skylightColor * lightmap.g;
    vec3 ambient = ambientColor;

    vec3 lightDir = normalize(mat3(gbufferModelViewInverse) * shadowLightPosition);
    float NdotL = dot(normal, lightDir);
    vec3 sunlight = sunlightColor * max(NdotL, 0.0) * shadow;

    vec3 halfDir = normalize(lightDir - normalize(eyePlayerPos));
    float NdotH = dot(normal, halfDir);
    float spec = pow(max(NdotH, 0.0), 4.0);
    vec3 specular = sunlightColor * spec * shadow;

    vec3 light = ambient + (sunlight + skylight) * (1 - isNight * 0.98) + blocklight + specular * (1 - isNight * 0.9);
    
    colortex0Out.rgb *= light;

    // Exposure
    colortex0Out.rgb /= exposure(colortex0Out.rgb, 0.7);
}