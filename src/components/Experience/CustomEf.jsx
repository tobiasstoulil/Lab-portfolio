import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Effect } from "postprocessing";
import { useScreenCursor } from "../../utils/useScreenCursor";
import { useFrame } from "@react-three/fiber";

const fragmentShader = `
uniform float uTime;
uniform float uStrength;
uniform vec2 uResolution;
uniform sampler2D uNormalMap;
uniform sampler2D uNoiseMap;

float rand2 (vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}


float circle(in vec2 _st, in float _scale, in float _radius, in float _fade) {
  vec2 dist = (_st - vec2(0.5)) / _scale;
  return 1.0 - smoothstep(_radius - (_radius * _fade), _radius + (_radius * _fade), dot(dist, dist) * 4.0);
}

float rectangle(vec2 uv, float width, float height, float softness) {
    float xMask = smoothstep(-width/2.0 - softness, -width/2.0, uv.x) -
                  smoothstep(width/2.0, width/2.0 + softness, uv.x);
    float yMask = smoothstep(-height/2.0 - softness, -height/2.0, uv.y) -
                  smoothstep(height/2.0, height/2.0 + softness, uv.y);
    return xMask * yMask;
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

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float aspect = uResolution.x / uResolution.y;

  float time = uTime * 0.5;
  float strength = 1.;
  float normalStrength = 1.;

  vec2 uvCentered = uv - 0.5;

  float n1 = noise(vec3(uvCentered * 15.0, 0.5));
  float n2 = noise(vec3(uvCentered * 10.0, time * 2.0 + n1));

  float f = 3.;

  float width  = 0.9125 + abs(0.05 * n2) - uStrength * abs(0.05 * n2) * f;  
  float height = 0.9 + abs(0.01 * n2)  - uStrength * abs(0.05 * n2) * f * 1.; 
  float softness = 0.02 + 0.05 * n2 ; 

  float noiseReveal = 1.0 - rectangle(uvCentered, width, height, softness);


  vec3 normalColor = texture2D(uNormalMap, uv * 0.5 - 0.125).xyz * 2. - 1.;
  // normalColor = vec3(0.);

  vec2 newUv = uv + normalColor.xy * noiseReveal * 0.15;

  vec2 dir = normalize(uv - vec2(0.5));
  float dist = length(uv - vec2(0.5));
  float positionalStrength = max(dist - 0.1, 0.0) * 0.1;
  positionalStrength = pow(positionalStrength, 1.5) * 7.0;

  vec4 texelColor = texture2D(inputBuffer, newUv);

  vec3 lightDirection = normalize(vec3(1., -1., 0.));
  float lightness = clamp(dot(normalColor, lightDirection), 0., 1.);
  texelColor.rgb += lightness * 0.75 * 1. * noiseReveal;

  // vec4 texelColor = mix(texelColor1, texelColor2, pow(uStrength, 1.));

	outputColor = texelColor;
	// outputColor =vec4(vec3(noiseReveal), 1.);
	// outputColor = vec4(vec3(n), 1.);
}`;

const normalMap = new THREE.TextureLoader().load("/normalScreen.jpg");
const noiseTexture = new THREE.TextureLoader().load("/noise5.png");
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

class CustomEf extends Effect {
  constructor() {
    super("MotionBlur", fragmentShader, {
      uniforms: new Map([
        ["uTime", new THREE.Uniform(0)],
        ["uStrength", new THREE.Uniform(0)],
        ["uResolution", new THREE.Uniform(new THREE.Vector2())],
        ["uNormalMap", new THREE.Uniform(normalMap)],
        ["uNoiseMap", new THREE.Uniform(noiseTexture)],
      ]),
    });
  }

  setCursorData(speed, delta) {
    this.uniforms.get("uTime").value += delta;
    this.uniforms.get("uStrength").value = speed;
    this.uniforms.get("uResolution").value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );

    // console.log(speed);
  }

  update(renderer, inputBuffer, deltaTime) {
    // this.uniforms.get("uStrength").value = 0;
  }
}

// Effect component
export const CustomEfComponent = forwardRef(({}, ref) => {
  const effect = useMemo(() => new CustomEf(), []);

  const mouse = useScreenCursor();
  const smoothedSpeed = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const elapsedTime = useRef(0);

  useFrame(({ pointer }, delta) => {
    // return;
    if (!effect) return;

    // Accumulate elapsed time
    elapsedTime.current += delta;

    // Only process movement after 1 second delay
    let target = 0;
    if (elapsedTime.current >= 1) {
      // Calculate movement distance
      const deltaX = mouse.current.x - lastPosition.current.x;
      const deltaY = mouse.current.y - lastPosition.current.y;
      const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      lastPosition.current = { x: mouse.current.x, y: mouse.current.y };

      // Only set target to 1 for significant movement
      target = movement > 0.01 ? 4 : 0; // Higher threshold for slow movements
    }

    // Smoothly interpolate speed with very slow ramp-up
    const lerpFactor = target ? 0.5 * delta : 1.75 * delta; // Very slow ramp-up, moderate decay
    smoothedSpeed.current += (target - smoothedSpeed.current) * lerpFactor;
    smoothedSpeed.current = Math.max(0, Math.min(1, smoothedSpeed.current));

    if (smoothedSpeed.current < 0.001) {
      smoothedSpeed.current = 0;
    }

    // console.log(smoothedSpeed.current);

    effect.setCursorData(smoothedSpeed.current, delta);
  });

  return <primitive ref={ref} object={effect} dispose={null} />;
});
