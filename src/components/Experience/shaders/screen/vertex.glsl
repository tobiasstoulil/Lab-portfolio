uniform float uTime;
uniform float uHoverProgress;

varying vec2 vUv;
varying vec3 vWave;


// Simplex noise implementation (or you can replace with a 3D noise function you already have)
float hash(vec3 p) {
    p  = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(
            mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
            f.y
        ),
        mix(
            mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
            f.y
        ),
        f.z
    );
}

void main()
{

    float hoverProgres = uHoverProgress;

        float scale = mix(1., 1.075, hoverProgres);


    vec3 newPosition = position * scale;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    float t = uTime * 0.25;  

    float n = noise(modelPosition.xyz * 1.5 + t);

  vec3 wave = normalize(vec3(
        noise(modelPosition.yzx + t),
        noise(modelPosition.zxy + t),
        noise(modelPosition.xyz + t)
    )) * (n * 0.175);

    wave = mix(wave, wave * 0.375, hoverProgres);
    
    modelPosition.xyz += wave;

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
  vWave = wave;
}