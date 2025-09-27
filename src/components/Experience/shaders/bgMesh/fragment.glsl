uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;

void main()
{
  vec2 uv = vUv;

  // float aspect = uResolution.x / uResolution.y;

  // uv.x = (uv.x - 0.5) * aspect + 0.5;
  // uv *= 0.675;


  // float fac = distance(vec2(0., 0.7), vec2(uv.x * 0.75, uv.y * 0.5));
  // fac = pow(fac, 4.);

  // vec3 bgFinalCol = mix(uColorStart, uColorEnd, fac);

  // gl_FragColor = vec4(bgFinalCol, 1.);
  // gl_FragColor = vec4(vec3(fac), 1.);

  float fac = uv.y + 0.2;
  fac = pow(fac, 4.);

  vec3 bgCol = mix(uColorStart, uColorEnd, fac);


  gl_FragColor = vec4(bgCol, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}


 