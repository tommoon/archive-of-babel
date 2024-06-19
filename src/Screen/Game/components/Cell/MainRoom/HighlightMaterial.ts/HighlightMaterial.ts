import { extend } from "@react-three/fiber";
import { Color, ShaderMaterial } from "three";

export const HighlightMaterial = new ShaderMaterial({
  uniforms: {
    color: { value: new Color(0xffffff) },
    hovered: { value: 0 },
  },
  vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
  fragmentShader: `
      uniform vec3 color;
      uniform float hovered;
      varying vec3 vNormal;
      void main() {
        float edge = 1.0 - max(abs(vNormal.x), max(abs(vNormal.y), abs(vNormal.z)));
        float intensity = smoothstep(0.0, 0.1, edge);
        gl_FragColor = vec4(mix(color, vec3(1.0, 1.0, 0.0), hovered) * intensity, 1.0);
      }
    `,
});

extend({ HighlightMaterial });
