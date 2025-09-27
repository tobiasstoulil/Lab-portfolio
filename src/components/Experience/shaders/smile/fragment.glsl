uniform float uTime;
uniform float uIndex;
uniform vec2 uResolution;
uniform sampler2D uFaceTexture;

varying vec2 vUv;

void main()
{
  vec2 uv = vUv;

  // float aspect = uResolution.x / uResolution.y;

  // uv.x = (uv.x - 0.5) * aspect + 0.5;
  // uv *= 0.675;

  float indexX = uIndex - floor(uIndex / 3.) * 3.;
  float indexY = mod(floor(uIndex / 3.), 2.) ;

  uv = vec2(uv.x + 0.3375 * indexX, uv.y + 0.5125 * indexY);

  vec3 smileCol = texture(uFaceTexture, uv).rgb;

  float smileAlpha = smileCol.r;

   smileAlpha = clamp(smileAlpha, 0., 1.);


  if(smileAlpha >= 0.95) {
    discard;
  }

  gl_FragColor = vec4(vec3(10.), 1. - smileAlpha);
  // gl_FragColor = vec4(vec3(1., 0., 0.), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}


 