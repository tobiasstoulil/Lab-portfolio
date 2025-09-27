
attribute vec2 uv1; 
varying vec2 vUv;
varying vec2 vUv2;

void main()
{

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;


    vUv = uv;    
    vUv2 = uv1;
}