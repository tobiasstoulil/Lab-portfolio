uniform float uTime;
uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform sampler2D uBakedTexture;
uniform sampler2D uBakedPowerTexture;

varying vec2 vUv;

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

float blendDarken(float base, float blend) {
	return min(blend,base);
}

vec3 blendDarken(vec3 base, vec3 blend) {
	return vec3(blendDarken(base.r,blend.r),blendDarken(base.g,blend.g),blendDarken(base.b,blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
	return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}


void main()
{
  vec2 uv = vUv;

  vec3 bakedCol = texture(uBakedTexture, uv).rgb;
  float powerFac = texture(uBakedPowerTexture, uv).r;

  vec3 colMultiply = mix(uColor1, uColor2, uProgress);

  vec3 powerCol = blendDarken(bakedCol, powerFac * colMultiply * 10., 0.475);

  vec3 finalCol = mix(bakedCol, powerCol, powerFac);


  gl_FragColor = vec4(vec3(finalCol), 1.);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>    
}


 