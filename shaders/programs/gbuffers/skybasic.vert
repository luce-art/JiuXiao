// Varyings
// out vec4 glColor;

// Main
void main(){
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
    // glColor = gl_Color;
}