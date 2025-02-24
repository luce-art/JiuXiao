// Varyings
out vec2 texCoord;

// Main
void main(){
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
    texCoord = gl_MultiTexCoord0.xy;
}