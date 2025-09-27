uniform float uTime;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uTransition;
uniform sampler2D uMap0;
uniform sampler2D uMap1;

varying vec2 vUv;

float circle(in vec2 _st, in float _scale, in float _radius, in float _fade) {
  vec2 dist = (_st - vec2(0.5)) - (1. - _scale);

  if (uTransition == 1.) {
      dist = (1. - _st - vec2(0.5)) - (1. - _scale);
  }

  return 1.0 - smoothstep(_radius - (_radius * _fade), _radius + (_radius * _fade), dot(dist, dist) * 4.0);
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 perm(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float noise(vec3 p) {
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);

  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));

  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}


void main()
{
  vec2 uv = vUv;

  float aspect = uResolution.x / uResolution.y;

  uv.x = (uv.x - 0.5) * aspect + 0.5;
  uv *= 0.675;

  // gl_FragColor= vec4(vec3(uv.x), 1.);
  // gl_FragColor = vec4(vec3(vUv.x), 1.);

  vec2 circleUv = (vUv - 0.5) / 1.5 + 0.5;
  vec2 circleUv2 = (vUv - 0.5) / 1.8 + 0.5;

  float n1 = noise(vec3(uv * 16.2412, 0.5));
  float n2 = noise(vec3(uv * 7.633, uTime * 0.35 + n1));

  float noiseReveal = circle(circleUv, uProgress, uProgress + n2, 0.1);
   float noiseEdge1 = circle(circleUv2, uProgress + 0.00175, uProgress + 0.01 + n2, 0.5);
  float noiseEdge2 = circle(circleUv2, uProgress, uProgress + 0.01 + n2, 0.5);

  float edge = noiseEdge1 - noiseEdge2;

    // gl_FragColor = vec4(vec3(circle(circleUv, uProgress, uProgress + n2, 0.1)), 1.0);


    // gl_FragColor = vec4(vec3(edge), 1.0);
    // gl_FragColor = vec4(vec3(n2), 1.0);

    vec4 firstCol = texture2D(uMap0, vUv);
    vec4 secondCol = texture2D(uMap1, vUv);


    // float fac = 

    // firstCol.rgb = firstCol.rgb * clamp(noiseEdge * 2.0, 1.0, 1.5);
    // firstCol.rgb = firstCol.rgb + firstCol.rgb * noiseEdge * 220.;
    // secondCol.rgb = secondCol.rgb + secondCol.rgb * noiseEdge * 220.;


    vec4 finalCol = mix(firstCol, secondCol, noiseReveal);

    finalCol.rgb = finalCol.rgb + edge * 1.;

    gl_FragColor = finalCol;
    // gl_FragColor = vec4(vec3(edge), 1.);
    // gl_FragColor = vec4(vec3(noiseEdge), 1.);

  // float prog = uProgress;
  // float xxx = step(vUv.x, prog);

  // if (uTransition == -1.) {
  //     xxx = step(1. - vUv.x, prog); 
  // }

  // float x = step(0.25, uv.x) * step(uv.x, 0.75);
  // float y = step(0.25, uv.y) * step(uv.y, 0.75);

  // gl_FragColor = vec4(vec3(x * y) , 1.);


    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}


 