'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Renderer, Camera, Transform, Mesh, Geometry, Program } from 'ogl';
import type { OGLRenderingContext } from 'ogl';
import { useScroll, useTransform } from 'framer-motion';
import './SolarSystem.css';

type SpaceBodyName = 'Sun' | 'Mercury' | 'Earth' | 'Mars' | 'Jupiter' | 'Saturn';

interface MoonConfig {
  size: number;
  distance: number;
  speed: number;
  inclination?: number;
}

interface RingConfig {
  inner: number;
  outer: number;
  color: [number, number, number, number];
}

interface DiskConfig {
  inner: number;
  outer: number;
  alpha: number;
  glow: number;
  tilt?: number;
  color: [number, number, number];
}

interface PlanetConfig {
  name: SpaceBodyName;
  color: [number, number, number];
  size: number;
  distance: number;
  rotationSpeed: number;
  glow: number;
  inclination?: number;
  moons?: MoonConfig[];
  rings?: RingConfig;
  disk?: DiskConfig;
  detailFrequency: number;
  detailStrength: number;
  bandStrength: number;
  specularStrength: number;
  isBlackHole?: boolean;
}

const PLANETS: PlanetConfig[] = [
  {
    name: 'Sun',
    color: [0.2, 0.2, 0.2],
    size: 4.6,
    distance: 0,
    rotationSpeed: 0.00025,
    glow: 24,
    detailFrequency: 10,
    detailStrength: 1.1,
    bandStrength: 0.92,
    specularStrength: 0.35,
    isBlackHole: true,
    disk: {
      inner: 5.4,
      outer: 15.2,
      alpha: 0.98,
      glow: 6.1,
      color: [1.35, 1.35, 1.35],
      tilt: 0.04,
    },
  },
  {
    name: 'Mercury',
    color: [0.46, 0.43, 0.38],
    size: 0.6,
    distance: 9,
    rotationSpeed: 0.0016,
    glow: 1.8,
    detailFrequency: 22,
    detailStrength: 0.62,
    bandStrength: 0.18,
    specularStrength: 0.22,
  },
  {
    name: 'Earth',
    color: [0.14, 0.28, 0.48],
    size: 1.05,
    distance: 13,
    rotationSpeed: 0.0011,
    glow: 3.4,
    inclination: 0.12,
    moons: [{ size: 0.26, distance: 2.1, speed: 0.0055, inclination: 0.08 }],
    detailFrequency: 24,
    detailStrength: 0.72,
    bandStrength: 0.46,
    specularStrength: 0.6,
  },
  {
    name: 'Mars',
    color: [0.62, 0.21, 0.14],
    size: 0.82,
    distance: 18,
    rotationSpeed: 0.0015,
    glow: 2.9,
    inclination: -0.09,
    moons: [{ size: 0.14, distance: 1.8, speed: 0.0065, inclination: 0.14 }],
    detailFrequency: 22,
    detailStrength: 0.78,
    bandStrength: 0.34,
    specularStrength: 0.3,
  },
  {
    name: 'Jupiter',
    color: [0.78, 0.52, 0.38],
    size: 3.15,
    distance: 25,
    rotationSpeed: 0.00075,
    glow: 5.6,
    inclination: 0.05,
    moons: [
      { size: 0.42, distance: 3.4, speed: 0.0032, inclination: 0.1 },
      { size: 0.2, distance: 4.6, speed: 0.0045, inclination: -0.1 },
    ],
    rings: { inner: 3.4, outer: 3.9, color: [0.48, 0.42, 0.34, 0.38] },
    detailFrequency: 32,
    detailStrength: 0.92,
    bandStrength: 0.85,
    specularStrength: 0.5,
  },
  {
    name: 'Saturn',
    color: [0.84, 0.62, 0.36],
    size: 1.78,
    distance: 32,
    rotationSpeed: 0.0009,
    glow: 4.6,
    inclination: -0.06,
    rings: { inner: 2.1, outer: 3.9, color: [1.05, 0.86, 0.48, 0.76] },
    detailFrequency: 34,
    detailStrength: 0.79,
    bandStrength: 0.9,
    specularStrength: 0.42,
  },
];

const PLANET_FOCUS: Record<SpaceBodyName, { cameraDistance: number; offsetX?: number; offsetY?: number; lookYOffset?: number }> = {
  Sun: { cameraDistance: 18, offsetX: 0, offsetY: 0.6, lookYOffset: 0.15 },
  Mercury: { cameraDistance: 14, offsetX: 1.4, offsetY: 0.7, lookYOffset: 0.2 },
  Earth: { cameraDistance: 16, offsetX: 2.2, offsetY: 1.2, lookYOffset: 0.3 },
  Mars: { cameraDistance: 17, offsetX: 2.0, offsetY: 1.0, lookYOffset: 0.25 },
  Jupiter: { cameraDistance: 22, offsetX: 4.2, offsetY: 1.7, lookYOffset: 0.38 },
  Saturn: { cameraDistance: 21, offsetX: 3.4, offsetY: 1.6, lookYOffset: 0.35 },
};

const NAV_ROUTE_TO_PLANET: { test: (path: string) => boolean; planet: SpaceBodyName }[] = [
  { test: (path) => path === '/', planet: 'Sun' },
  { test: (path) => path.startsWith('/photography'), planet: 'Earth' },
  { test: (path) => path.startsWith('/development'), planet: 'Mars' },
  { test: (path) => path.startsWith('/renders'), planet: 'Jupiter' },
  { test: (path) => path.startsWith('/about'), planet: 'Saturn' },
  { test: (path) => path.startsWith('/contact'), planet: 'Mercury' },
];

const vertex = /* glsl */`
attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uScale;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 scaled = position * uScale;
  vec4 world = modelMatrix * vec4(scaled, 1.0);
  vWorldPosition = world.xyz;
  vPosition = position;
  mat3 normalMatrix = mat3(modelMatrix);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragment = /* glsl */`
precision highp float;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uGlow;
uniform float uTime;
uniform float uDetailFreq;
uniform float uDetailStrength;
uniform float uBandStrength;
uniform float uSpecular;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));
  float diffuse = max(dot(normal, lightDir), 0.0);
  vec3 viewDir = normalize(-vWorldPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 32.0) * uSpecular;

  float latitude = asin(clamp(normal.y, -1.0, 1.0));
  float bands = sin(latitude * uDetailFreq + uTime * 0.25);
  float bandDetail = mix(0.75, 1.25, 0.5 + 0.5 * bands);

  float swirl = sin((vWorldPosition.x + vWorldPosition.z) * (uDetailFreq * 0.35) + uTime * 0.18);
  float swirlDetail = mix(0.7, 1.3, 0.5 + 0.5 * swirl);

  float grain = noise((normal.xz * 4.0) + uTime * 0.1);
  float grainDetail = mix(0.85, 1.15, grain);

  float detail = 1.0;
  detail *= mix(1.0, bandDetail, clamp(uBandStrength, 0.0, 1.0));
  detail *= mix(1.0, swirlDetail, clamp(uDetailStrength, 0.0, 1.0));
  detail *= grainDetail;

  float ambient = 0.25;
  float lighting = ambient + diffuse;
  float glow = uGlow > 0.0 ? exp(-length(vPosition) * uGlow * 0.35) : 1.0;

  vec3 finalColor = uColor * detail * lighting + specular;
  gl_FragColor = vec4(finalColor * glow, uAlpha);
}
`;

const blackHoleFragment = /* glsl */`
precision highp float;
uniform vec3 uColor;
uniform float uGlow;
uniform float uTime;
uniform float uDetailStrength;
varying vec3 vPosition;
varying vec3 vWorldPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  float radius = length(vPosition.xy);
  float horizon = smoothstep(0.72, 0.92, radius);

  vec2 dir = normalize(vPosition.xy + 1e-5);
  float lensStrength = pow(max(0.0, 1.4 - radius), 2.5);
  vec2 lensOffset = dir * lensStrength * 0.8;
  vec2 warped = vPosition.xy + lensOffset;

  float swirl = sin(length(warped) * 9.0 - uTime * 2.6);
  float turbulence = noise(warped * 4.5 + uTime * 0.8);
  float glow = exp(-pow(radius * 2.3, 2.2)) * (1.0 + uDetailStrength * 0.6);
  glow += exp(-pow((radius - 0.65) * 5.0, 2.0)) * 0.4;

  float intensity = clamp(glow + swirl * 0.12 + turbulence * 0.18, 0.0, 1.0);
  vec3 rim = vec3(0.1 + intensity * 0.4);
  vec3 voidColor = vec3(0.0);

  float alpha = clamp((1.0 - horizon) * (0.55 + glow * 0.6), 0.0, 1.0);
  alpha = pow(alpha, 1.2);

  vec3 finalColor = mix(voidColor, rim, clamp(glow * 1.35, 0.0, 1.0));
  finalColor = mix(finalColor, vec3(0.02, 0.02, 0.04), 0.45);
  finalColor = clamp(finalColor, 0.0, 1.0);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

const diskVertex = /* glsl */`
attribute vec3 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vLocalPosition;
varying vec3 vWorldPosition;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPosition = world.xyz;
  vLocalPosition = position;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const diskFragment = /* glsl */`
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uGlow;
uniform float uInner;
uniform float uOuter;
varying vec3 vLocalPosition;

vec2 swirl(vec2 p, float strength) {
  float radius = length(p);
  float angle = atan(p.y, p.x) + strength / (radius + 0.35);
  return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
  vec2 plane = vLocalPosition.xz;
  float radius = length(plane);
  if (radius < uInner || radius > uOuter) discard;

  float normalized = (radius - uInner) / max(uOuter - uInner, 0.0001);
  float ringMask = smoothstep(0.12, 0.34, normalized) * (1.0 - smoothstep(0.7, 0.96, normalized));

  vec2 swirled = swirl(plane, 0.8 + sin(uTime * 0.6) * 0.12);
  float bandWave = sin(length(swirled) * 4.0 - uTime * 1.6);

  float band1 = smoothstep(0.0, 0.4, normalized);
  float band2 = smoothstep(0.3, 0.7, normalized);
  float band3 = smoothstep(0.55, 1.0, normalized);

  vec3 shade = vec3(0.9, 0.35, 0.08);
  vec3 mid = vec3(1.2, 0.58, 0.16);
  vec3 highlight = vec3(1.38, 0.82, 0.3);

  vec3 color = mix(shade, mid, band1);
  color = mix(color, highlight, band2);
  color += vec3(0.12, 0.06, 0.02) * band3;
  color += vec3(0.08, 0.04, 0.01) * bandWave * 0.3;

  float glow = exp(-abs(radius - (uInner + uOuter) * 0.5) * uGlow * 0.1);
  float alpha = clamp(uAlpha * ringMask * (0.85 - normalized * 0.25) + bandWave * 0.12, 0.0, 1.0);

  gl_FragColor = vec4(color * glow, alpha);
}
`;

const coreFragment = /* glsl */`
precision highp float;
uniform float uTime;
uniform float uSize;
uniform vec3 uColor;
varying vec3 vPosition;

vec2 swirl(vec2 p, float strength) {
  float radius = length(p);
  float angle = atan(p.y, p.x) + strength / (radius + 0.25);
  return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
  vec2 plane = vPosition.xz;
  float radius = length(plane);
  float normalized = clamp(radius / uSize, 0.0, 1.0);

  vec2 swirled = swirl(plane, 2.6 + sin(uTime * 0.8) * 0.3);
  float swirlBand = sin(length(swirled) * 6.0 - uTime * 3.4);

  float distortion = 1.0 / (radius * 8.0 + 0.7);
  vec2 refracted = plane + swirled * distortion * 0.4;
  float refractGlow = exp(-length(refracted) * 1.6);

  float fade = smoothstep(0.08, 0.85, normalized);
  float depth = clamp(1.0 - fade + swirlBand * 0.25, 0.0, 1.0);

  vec3 coreColor = mix(vec3(0.02, 0.01, 0.04), uColor, depth * 0.7);
  coreColor += refractGlow * vec3(0.15, 0.1, 0.22);
  coreColor *= mix(1.1, 1.35, distortion * 2.0);

  float alpha = clamp((1.0 - normalized * 1.15) + swirlBand * 0.18 + distortion * 0.9, 0.0, 1.0);

  gl_FragColor = vec4(coreColor, alpha);
}
`;

function createSphere(gl: OGLRenderingContext, segments = 16) {
  const positions: number[] = [];
  const indices: number[] = [];

  for (let y = 0; y <= segments; y++) {
    const theta = (y * Math.PI) / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let x = 0; x <= segments; x++) {
      const phi = (x * 2 * Math.PI) / segments;
      const nx = sinTheta * Math.cos(phi);
      const ny = cosTheta;
      const nz = sinTheta * Math.sin(phi);
      positions.push(nx, ny, nz);
    }
  }

  for (let y = 0; y < segments; y++) {
    for (let x = 0; x < segments; x++) {
      const a = y * (segments + 1) + x;
      const b = a + segments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const positionArray = new Float32Array(positions);
  return new Geometry(gl, {
    position: { size: 3, data: positionArray },
    normal: { size: 3, data: positionArray },
    index: { size: 1, data: new Uint16Array(indices) },
  });
}

function createRing(gl: OGLRenderingContext, inner = 1.2, outer = 2.0, segments = 64) {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    positions.push(cos * inner, 0, sin * inner);
    positions.push(cos * outer, 0, sin * outer);
    normals.push(0, 1, 0, 0, 1, 0);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;

    indices.push(a, b, c);
    indices.push(b, d, c);
  }

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    normal: { size: 3, data: new Float32Array(normals) },
    index: { size: 1, data: new Uint16Array(indices) },
  });
}

interface SolarSystemProps {
  className?: string;
  enabled?: boolean;
  showMoons?: boolean;
  showRings?: boolean;
}

export default function SolarSystem({
  className = '',
  enabled = true,
  showMoons = true,
  showRings = true,
}: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const focusPlanet = useMemo<SpaceBodyName>(() => {
    const path = pathname || '/';
    const match = NAV_ROUTE_TO_PLANET.find((entry) => entry.test(path));
    return match ? match.planet : 'Sun';
  }, [pathname]);

  const focusRef = useRef<SpaceBodyName>(focusPlanet);
  useEffect(() => {
    focusRef.current = focusPlanet;
  }, [focusPlanet]);

  const { scrollYProgress } = useScroll();
  const scrollZ = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const scrollOrbitBoost = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const scrollSceneRotate = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 1.6]);
  const scrollSceneTilt = useTransform(scrollYProgress, [0, 1], [0.08, -0.14]);
  const scrollSceneLift = useTransform(scrollYProgress, [0, 1], [1.0, -7.5]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;

    try {
      renderer = new Renderer({ alpha: true, antialias: true });
    } catch (error) {
      console.warn('SolarSystem: WebGL not available, skipping animation.', error);
      return;
    }

    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 42 });
    camera.position.set(0, 0, 32);

    const sceneRoot = new Transform();
    const cameraTargetTransform = new Transform();

    const applySceneTransform = (x: number, y: number, z: number) => {
      const ry = sceneRoot.rotation.y;
      const rx = sceneRoot.rotation.x;
      const rz = sceneRoot.rotation.z;

      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      let y2 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      let x3 = x1 * cosZ - y2 * sinZ;
      let y3 = x1 * sinZ + y2 * cosZ;

      return {
        x: x3 + sceneRoot.position.x,
        y: y3 + sceneRoot.position.y,
        z: z2 + sceneRoot.position.z,
      };
    };

    const sphereSegments = isMobile ? 14 : 28;
    const ringSegments = isMobile ? 64 : 128;

    type MoonInstance = {
      mesh: Mesh;
      angle: number;
      speed: number;
      distance: number;
    };

    type PlanetInstance = {
      def: PlanetConfig;
      mesh: Mesh;
      orbitAngle: number;
      moons: MoonInstance[];
      ring?: Mesh;
      disk?: {
        mesh: Mesh;
        program: Program;
      };
      uniforms: {
        uTime: { value: number };
      } & Record<string, { value: any }>;
    };

    const planets: PlanetInstance[] = [];
    const planetMap = new Map<SpaceBodyName, PlanetInstance>();

    for (const def of PLANETS) {
      const planetUniforms = {
        uColor: { value: def.color },
        uScale: { value: def.size },
        uAlpha: { value: 1 },
        uGlow: { value: def.glow },
        uTime: { value: 0 },
        uDetailFreq: { value: def.detailFrequency },
        uDetailStrength: { value: def.detailStrength },
        uBandStrength: { value: def.bandStrength },
        uSpecular: { value: def.specularStrength },
      } as const;

      const program = new Program(gl, {
        vertex,
        fragment: def.isBlackHole ? blackHoleFragment : fragment,
        uniforms: planetUniforms as unknown as Record<string, { value: any }>,
        transparent: true,
      });

      const mesh = new Mesh(gl, {
        geometry: createSphere(gl, sphereSegments),
        program,
      });

      mesh.rotation.z = def.inclination || 0;

      const orbitAngle = Math.random() * Math.PI * 2;
      const radius = def.distance;
      if (radius > 0) {
        mesh.position.x = Math.cos(orbitAngle) * radius;
        mesh.position.z = Math.sin(orbitAngle) * radius;
      }

      sceneRoot.addChild(mesh);

      const planet: PlanetInstance = {
        def,
        mesh,
        orbitAngle,
        moons: [],
        disk: undefined,
        uniforms: planetUniforms as unknown as PlanetInstance['uniforms'],
      };

      if (def.disk) {
        const diskProgram = new Program(gl, {
          vertex: diskVertex,
          fragment: diskFragment,
          uniforms: {
            uTime: { value: 0 },
            uColor: { value: def.disk.color },
            uAlpha: { value: def.disk.alpha },
            uGlow: { value: def.disk.glow },
            uInner: { value: def.disk.inner },
            uOuter: { value: def.disk.outer },
          },
          transparent: true,
          depthWrite: false,
          depthTest: true,
        });

        const diskMesh = new Mesh(gl, {
          geometry: createRing(gl, def.disk.inner, def.disk.outer, ringSegments),
          program: diskProgram,
        });

        diskMesh.rotation.x = (def.disk.tilt ?? 0) + Math.PI / 2;
        mesh.addChild(diskMesh);
        planet.disk = { mesh: diskMesh, program: diskProgram };
      }

      if (showRings && def.rings) {
        const ringProgram = new Program(gl, {
          vertex,
          fragment,
          uniforms: {
            uColor: { value: def.rings.color.slice(0, 3) as [number, number, number] },
            uScale: { value: 1 },
            uAlpha: { value: def.rings.color[3] ?? 0.4 },
            uGlow: { value: 0 },
            uTime: { value: 0 },
            uDetailFreq: { value: 4 },
            uDetailStrength: { value: 0.1 },
            uBandStrength: { value: 0.05 },
            uSpecular: { value: 0.1 },
          },
          transparent: true,
          depthWrite: false,
        });

        const ringMesh = new Mesh(gl, {
          geometry: createRing(gl, def.rings.inner, def.rings.outer, ringSegments),
          program: ringProgram,
        });

        ringMesh.rotation.x = Math.PI / 2;
        mesh.addChild(ringMesh);
        planet.ring = ringMesh;
      }

      if (showMoons && def.moons) {
        for (const moon of def.moons) {
          const moonProgram = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
              uColor: { value: [0.92, 0.92, 0.92] },
              uScale: { value: moon.size },
              uAlpha: { value: 1 },
              uGlow: { value: 3.2 },
              uTime: { value: 0 },
              uDetailFreq: { value: 9 },
              uDetailStrength: { value: 0.2 },
              uBandStrength: { value: 0.2 },
              uSpecular: { value: 0.25 },
            },
            transparent: true,
          });

          const moonMesh = new Mesh(gl, {
            geometry: createSphere(gl, isMobile ? 6 : 8),
            program: moonProgram,
          });

          moonMesh.rotation.z = moon.inclination || 0;
          moonMesh.position.x = moon.distance;
          mesh.addChild(moonMesh);

          planet.moons.push({
            mesh: moonMesh,
            angle: Math.random() * Math.PI * 2,
            speed: moon.speed,
            distance: moon.distance,
          });
        }
      }

      planets.push(planet);
      planetMap.set(def.name, planet);
    }

    let lastTime = performance.now();
    let scrollZOffset = 0;
    let scrollOrbitMultiplier = 1;
    let desiredLook = { x: 0, y: 0, z: 0 };
    let targetSceneRotation = scrollSceneRotate.get();
    let targetSceneTilt = scrollSceneTilt.get();
    let targetSceneYOffset = scrollSceneLift.get();

    const unsubscribeScroll = scrollZ.on('change', (value) => {
      scrollZOffset = value;
    });

    const unsubscribeOrbit = scrollOrbitBoost.on('change', (value) => {
      scrollOrbitMultiplier = value;
    });

    const unsubscribeSceneRotate = scrollSceneRotate.on('change', (value) => {
      targetSceneRotation = value;
    });

    const unsubscribeSceneTilt = scrollSceneTilt.on('change', (value) => {
      targetSceneTilt = value;
    });

    const unsubscribeSceneLift = scrollSceneLift.on('change', (value) => {
      targetSceneYOffset = value;
    });

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer!.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const update = (time: number) => {
      rafRef.current = requestAnimationFrame(update);
      const delta = Math.min(40, time - lastTime);
      lastTime = time;
      const timeSeconds = time * 0.001;

      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      sceneRoot.rotation.y += (targetSceneRotation - sceneRoot.rotation.y) * 0.04;
      sceneRoot.rotation.x += (targetSceneTilt - sceneRoot.rotation.x) * 0.04;
      sceneRoot.position.y += (targetSceneYOffset - sceneRoot.position.y) * 0.06;
      sceneRoot.rotation.z += reduceMotion ? 0 : 0.00004 * delta;

      for (const planet of planets) {
        if (planet.uniforms && planet.uniforms.uTime) {
          planet.uniforms.uTime.value = timeSeconds;
        }

        if (!reduceMotion && planet.def.distance > 0) {
          planet.orbitAngle += planet.def.rotationSpeed * delta * 0.05 * scrollOrbitMultiplier;
          const radius = planet.def.distance;
          planet.mesh.position.x = Math.cos(planet.orbitAngle) * radius;
          planet.mesh.position.z = Math.sin(planet.orbitAngle) * radius;
        }

        planet.mesh.rotation.y += 0.001 * delta;

        for (const moon of planet.moons) {
          const uniforms = (moon.mesh.program && moon.mesh.program.uniforms) as Record<string, { value: number }> | undefined;
          if (uniforms && uniforms.uTime) {
            uniforms.uTime.value = timeSeconds;
          }
          if (!reduceMotion) {
            moon.angle += moon.speed * delta * 0.05 * scrollOrbitMultiplier;
          }
          moon.mesh.position.x = Math.cos(moon.angle) * moon.distance;
          moon.mesh.position.z = Math.sin(moon.angle) * moon.distance;
          moon.mesh.rotation.y += 0.002 * delta;
        }

        if (planet.ring?.program?.uniforms?.uTime) {
          (planet.ring.program.uniforms.uTime as { value: number }).value = timeSeconds;
        }

        if (planet.disk) {
          planet.disk.program.uniforms.uTime.value = timeSeconds;
          planet.disk.mesh.rotation.z += 0.0016 * delta;
        }
      }

      const targetPlanet = planetMap.get(focusRef.current) || planetMap.get('Sun')!;
      const targetConfig = PLANET_FOCUS[targetPlanet.def.name];
      const worldPos = applySceneTransform(
        targetPlanet.mesh.position.x,
        targetPlanet.mesh.position.y,
        targetPlanet.mesh.position.z
      );

      const lookYOffset = targetConfig?.lookYOffset ?? 0;
      desiredLook.x += (worldPos.x - desiredLook.x) * 0.12;
      desiredLook.y += (worldPos.y + lookYOffset - desiredLook.y) * 0.12;
      desiredLook.z += (worldPos.z - desiredLook.z) * 0.12;

      const mouseX = (window as any).__SOLAR_MOUSE_X || 0;
      const mouseY = (window as any).__SOLAR_MOUSE_Y || 0;

      sceneRoot.position.x += ((mouseX ?? 0) * 3 - sceneRoot.position.x) * 0.05;

      const baseOffsetX = targetConfig?.offsetX ?? 0;
      const baseOffsetY = targetConfig?.offsetY ?? 0;
      const cameraDistance = targetConfig?.cameraDistance ?? 18;

      const desiredX = worldPos.x + baseOffsetX + mouseX * 0.6;
      const desiredY = worldPos.y + baseOffsetY + mouseY * 0.2;
      const desiredZ = worldPos.z + cameraDistance + scrollZOffset * 0.4;

      camera.position.x += (desiredX - camera.position.x) * 0.08;
      camera.position.y += (desiredY - camera.position.y) * 0.08;
      camera.position.z += (desiredZ - camera.position.z) * 0.08;

      cameraTargetTransform.position.set(desiredLook.x, desiredLook.y, desiredLook.z);
      camera.lookAt(cameraTargetTransform.position);

      renderer!.render({ scene: sceneRoot, camera });
    };

    rafRef.current = requestAnimationFrame(update);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      (window as any).__SOLAR_MOUSE_X = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      (window as any).__SOLAR_MOUSE_Y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (!visible && rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (visible && rafRef.current === null) {
        lastTime = performance.now();
        rafRef.current = requestAnimationFrame(update);
      }
    });

    observer.observe(container);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      unsubscribeScroll();
      unsubscribeOrbit();
      unsubscribeSceneRotate();
      unsubscribeSceneTilt();
      unsubscribeSceneLift();
      window.removeEventListener('resize', handleResize);
      if (!reduceMotion) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      observer.disconnect();
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [enabled, showMoons, showRings, isMobile, scrollZ, scrollOrbitBoost, scrollSceneRotate, scrollSceneTilt, scrollSceneLift]);

  return (
    <div
      ref={containerRef}
      className={`solar-root ${className}`}
      role="img"
      aria-label="Animated solar system background"
    />
  );
}
