uniform float uTime;
uniform float uProgress;
uniform float uHoverProgress;
uniform sampler2D uScreenTexture1;
uniform sampler2D uScreenTexture2;

varying vec2 vUv;
varying vec3 vWave;

void main()
{

    float hoverProgres = uHoverProgress;
    float progress = uProgress;
    vec2 uv = vUv;
    float time = uTime * 0.5;

    float waweFac = length(vWave);
    waweFac = (waweFac + 1.0) * 0.5;  
    waweFac = abs(waweFac);
    waweFac = pow(waweFac, 20.0) * 50000.0;

    // Clamp correctly
    waweFac = clamp(waweFac, 0.0, 1.0);

    float q = 1.425;

    vec2 dotsUv = vec2(fract(uv.x * 150. * q), fract(uv.y * 70. * q));

    float dots = 1. - distance(dotsUv, vec2(0.5));
    dots = smoothstep(0.5, 1., dots);

    dots = clamp(dots, 0., 1.);

    float facX = uv.x;
    facX = abs(facX - 0.5) * 2.;
    facX = 1. - facX;
    facX = smoothstep(0.1, 2., facX * 8.);

    float facSlicesX = uv.x;
    float dX = abs(facSlicesX - 0.5) * 2.;
    float centerMaskX = 1.0 - smoothstep(0.7625, 1.075, dX);
    float edgeSlicesX = smoothstep(3., 0., fract(dX * 26.0 - time * 2.));
    facSlicesX = max(centerMaskX, edgeSlicesX);
    // facX = edgeSlices + centerMask;

    float fog = (1.-pow(waweFac , 1.25));
    fog = mix(fog, 1., hoverProgres);

    facSlicesX = facSlicesX * fog;

    facX *= facSlicesX;

    float facY = uv.y;
    facY = abs(facY - 0.5) * 2.;
    facY = 1. - facY;
    facY = smoothstep(0.1, 1., facY * 10.);

    // float facSlicesY = uv.y;
    // float dY = abs(facSlicesY - 0.5) * 2.;
    // float centerMaskY = 1.0 - smoothstep(0.775, 1., dY);
    // float edgeSlicesY = smoothstep(3., 0., fract(dY * 26.0 - time * 2.));
    // facSlicesY = max(centerMaskY, edgeSlicesY);
    
    // facY *= facSlicesY;

    float fac = facX * facY;

    fac = clamp(fac, 0., 1.);

    vec3 screenCol1 = texture(uScreenTexture1, vUv).rgb;
    vec3 screenCol2 = texture(uScreenTexture2, vUv).rgb;

    vec3 screemFinalCol = mix(screenCol1, screenCol2, progress);

    vec3 finalCol = screemFinalCol;
    finalCol = mix(screemFinalCol * 1.175, screemFinalCol * 0.8, 1. - dots);
    finalCol *= 1.125;
    finalCol *= 0.775;

    finalCol = mix(finalCol * 1., finalCol * 1.75, waweFac);

    vec3 hoverCol = finalCol * 0.95;

  
    finalCol = mix(finalCol, hoverCol, hoverProgres);

    gl_FragColor = vec4(vec3(finalCol), fac);
    // gl_FragColor = vec4(vec3(dots), 1.);
    // gl_FragColor = vec4(vec3(facX), 1.);

    // gl_FragColor = vec4(vec3(vWave.z), 1.);
    // gl_FragColor = vec4(vec3(waweFac), 1.);

    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>    
}


//    float progress = uProgress;
//     vec2 uv = vUv;

//     float q = 1.275;

//     vec2 dotsUv = vec2(fract(uv.x * 150. * q), fract(uv.y * 70. * q));

//     float dots = 1. - distance(dotsUv, vec2(0.5));
//     dots = smoothstep(0.1, 1., dots);




//     gl_FragColor = vec4(vec3(finalCol),  dots);