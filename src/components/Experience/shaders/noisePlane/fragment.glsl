uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uNoiseTexture;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;

void main()
{
  vec2 uv = vUv;

  // float aspect = uResolution.x / uResolution.y;

  // uv.x = (uv.x - 0.5) * aspect + 0.5;
  // uv *= 0.675;

  float time = uTime * - 0.425;

  float alpha = uv.y;
  alpha = 1.- abs(alpha - 0.5);
  alpha = pow(alpha, 10.);
  alpha *= 200.;

  // float alphaCenter = abs(uv.y - 0.5);
  // alphaCenter = pow(alphaCenter, 3.);
  // alphaCenter *= 50.;

  float noise = texture2D(uNoiseTexture, uv * 0.75 + vec2(time * 0.05, time * 0.1)).r;
  noise = pow(noise, 6.);
  noise *= 6.;

  noise = clamp(noise, 0., 1.);

  // alpha *= alphaCenter;  
  alpha *= noise;

    alpha = clamp(alpha, 0., 1.);

  // if(alpha <= 0.25) {
  //   discard;
  // }

  // vec3 col = vec3(max(1. - uv.y, 0.9));
  vec3 col = vec3(0.9375);

  gl_FragColor = vec4(vec3(col), alpha);
  // gl_FragColor = vec4(vec3(alpha), 1.);
  // gl_FragColor = vec4(vec3(alphaCenter), 1.);
  // gl_FragColor = vec4(vec3(1.), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}


 