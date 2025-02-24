// Uniforms
#include "/libs/uniforms.glsl"

// Varyings
in vec2 texCoord;

// Settings
#include "/libs/settings.glsl"
/* DRAWBUFFERS:0 */
layout (location = 0) out vec4 outColor;
const vec3 blocklightColor = vec3(1.0, 0.5, 0.08);
const vec3 skylightColor = vec3(0.05, 0.15, 0.3);
const vec3 sunlightColor = vec3(1.0);
const vec3 ambientColor = vec3(0.1);

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

// Main
void main() {
    outColor = texture(colortex0, texCoord);
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
    vec3 shadowViewPos = feetPlayerToShadowView(feetPlayerPos);
    vec4 shadowClipPos = shadowProjection * vec4(shadowViewPos, 1.0);

    vec3 shadow = getSoftShadow(shadowClipPos);

    // Lighting
    vec3 blocklight = blocklightColor * lightmap.r;
    vec3 skylight = skylightColor * lightmap.g;
    vec3 ambient = ambientColor;

    vec3 lightDir = normalize(mat3(gbufferModelViewInverse) * shadowLightPosition);
    float NdotL = dot(normal, lightDir);
    vec3 sunlight = sunlightColor * max(NdotL, 0.0) * shadow;

    vec3 light = ambient + sunlight + skylight + blocklight; 
    outColor.rgb *= light;
}