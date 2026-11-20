"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type KartFocus = "chassis" | "powertrain" | "telemetry";

interface KartCanvas3DProps {
  progressRef: React.RefObject<number>;
  focus: KartFocus;
  modelUrl?: string | null;
  fallback: React.ReactNode;
  className?: string;
}

interface SubsystemMaterials {
  chassisGlow: THREE.MeshStandardMaterial;
  chassisEdge: THREE.LineBasicMaterial;
  powertrainGlow: THREE.MeshStandardMaterial;
  powertrainEdge: THREE.LineBasicMaterial;
  telemetryGlow: THREE.MeshStandardMaterial;
  telemetryEdge: THREE.LineBasicMaterial;
}

const FOCUS_POSE: Record<
  KartFocus,
  { yaw: number; cam: [number, number, number]; light: [number, number, number] }
> = {
  chassis: {
    yaw: -0.62,
    cam: [3.35, 1.38, 3.65],
    light: [0.85, 0.35, 0],
  },
  powertrain: {
    yaw: 2.35,
    cam: [3.25, 1.72, 3.35],
    light: [-0.68, 0.34, 0.12],
  },
  telemetry: {
    yaw: 0.58,
    cam: [2.75, 2.08, 2.75],
    light: [0.42, 0.56, 0],
  },
};

function addEdgeLines(
  mesh: THREE.Mesh,
  material: THREE.LineBasicMaterial,
  thresholdAngle = 22
) {
  const edges = new THREE.EdgesGeometry(mesh.geometry, thresholdAngle);
  const line = new THREE.LineSegments(edges, material);
  mesh.add(line);
}

function addTubeSegment(
  parent: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material
) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();
  if (length < 0.001) return;

  const geo = new THREE.CylinderGeometry(radius, radius, length, 10);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(start).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize()
  );
  parent.add(mesh);
}

function addBoxPart(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  edgeMaterial?: THREE.LineBasicMaterial,
  rotation: [number, number, number] = [0, 0, 0]
) {
  const geo = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  if (edgeMaterial) addEdgeLines(mesh, edgeMaterial);
  parent.add(mesh);
  return mesh;
}

function createWheel(
  radius: number,
  width: number,
  tireMat: THREE.Material,
  rimMat: THREE.Material,
  hubGlowMat: THREE.Material
) {
  const wheelGroup = new THREE.Group();

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, 28),
    tireMat
  );
  tire.rotation.x = Math.PI / 2;
  wheelGroup.add(tire);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, width + 0.014, 20),
    rimMat
  );
  rim.rotation.x = Math.PI / 2;
  wheelGroup.add(rim);

  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 0.96, 0.022, width + 0.022),
      tireMat
    );
    spoke.rotation.z = (i * Math.PI) / 5;
    wheelGroup.add(spoke);
  }

  const centerCap = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.19, radius * 0.19, width + 0.032, 16),
    hubGlowMat
  );
  centerCap.rotation.x = Math.PI / 2;
  wheelGroup.add(centerCap);

  return wheelGroup;
}

function buildKartAssembly() {
  const root = new THREE.Group();

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x1b1f17,
    roughness: 0.55,
    metalness: 0.25,
  });
  const graphiteMat = new THREE.MeshStandardMaterial({
    color: 0x393f34,
    roughness: 0.42,
    metalness: 0.55,
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x10120f,
    roughness: 0.85,
    metalness: 0.08,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xcfd4c8,
    roughness: 0.25,
    metalness: 0.85,
  });

  const materials: SubsystemMaterials = {
    chassisGlow: new THREE.MeshStandardMaterial({
      color: 0xd2ff00,
      emissive: 0x89ab00,
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.4,
    }),
    chassisEdge: new THREE.LineBasicMaterial({
      color: 0xd2ff00,
      transparent: true,
      opacity: 0.88,
    }),
    powertrainGlow: new THREE.MeshStandardMaterial({
      color: 0xd2ff00,
      emissive: 0x89ab00,
      emissiveIntensity: 0.06,
      roughness: 0.35,
      metalness: 0.45,
    }),
    powertrainEdge: new THREE.LineBasicMaterial({
      color: 0xf4f4ed,
      transparent: true,
      opacity: 0.25,
    }),
    telemetryGlow: new THREE.MeshStandardMaterial({
      color: 0xd2ff00,
      emissive: 0x89ab00,
      emissiveIntensity: 0.06,
      roughness: 0.3,
      metalness: 0.3,
    }),
    telemetryEdge: new THREE.LineBasicMaterial({
      color: 0xf4f4ed,
      transparent: true,
      opacity: 0.25,
    }),
  };

  // --- Chassis & Aero ---
  const chassisGroup = new THREE.Group();
  const frameRadius = 0.024;
  for (const side of [-1, 1]) {
    const zWaist = side * 0.24;
    const zMid = side * 0.36;
    const zFront = side * 0.19;
    addTubeSegment(
      chassisGroup,
      new THREE.Vector3(-0.96, -0.13, zMid),
      new THREE.Vector3(0.12, -0.13, zWaist),
      frameRadius,
      materials.chassisGlow
    );
    addTubeSegment(
      chassisGroup,
      new THREE.Vector3(0.12, -0.13, zWaist),
      new THREE.Vector3(1.06, -0.13, zFront),
      frameRadius,
      materials.chassisGlow
    );
    addTubeSegment(
      chassisGroup,
      new THREE.Vector3(0.28, -0.13, zWaist),
      new THREE.Vector3(0.42, 0.22, zFront * 0.9),
      0.018,
      materials.chassisGlow
    );
  }
  addTubeSegment(
    chassisGroup,
    new THREE.Vector3(-0.96, -0.13, -0.36),
    new THREE.Vector3(-0.96, -0.13, 0.36),
    frameRadius,
    materials.chassisGlow
  );
  addTubeSegment(
    chassisGroup,
    new THREE.Vector3(1.06, -0.13, -0.19),
    new THREE.Vector3(1.06, -0.13, 0.19),
    frameRadius,
    materials.chassisGlow
  );
  addTubeSegment(
    chassisGroup,
    new THREE.Vector3(-1.08, -0.06, -0.62),
    new THREE.Vector3(-1.08, -0.06, 0.62),
    0.02,
    graphiteMat
  );

  // Underbody floor pan
  addBoxPart(
    chassisGroup,
    [1.82, 0.03, 0.78],
    [0.02, -0.16, 0],
    carbonMat,
    materials.chassisEdge
  );
  // Aerodynamic front nose cone & front wing splitter
  addBoxPart(
    chassisGroup,
    [0.64, 0.18, 0.42],
    [0.86, 0.02, 0],
    carbonMat,
    materials.chassisEdge,
    [0, 0, -0.24]
  );
  addBoxPart(
    chassisGroup,
    [0.24, 0.04, 0.88],
    [1.14, -0.12, 0],
    graphiteMat,
    materials.chassisEdge
  );
  // Sculpted sidepods (left & right)
  for (const side of [-1, 1]) {
    addBoxPart(
      chassisGroup,
      [0.86, 0.18, 0.28],
      [0.04, -0.04, side * 0.48],
      carbonMat,
      materials.chassisEdge,
      [0, side * -0.06, 0]
    );
  }
  // Contoured racing bucket seat
  addBoxPart(
    chassisGroup,
    [0.34, 0.06, 0.36],
    [-0.08, -0.08, 0],
    graphiteMat
  );
  addBoxPart(
    chassisGroup,
    [0.07, 0.44, 0.36],
    [-0.24, 0.14, 0],
    graphiteMat,
    materials.chassisEdge,
    [0, 0, 0.28]
  );
  for (const side of [-1, 1]) {
    addBoxPart(
      chassisGroup,
      [0.26, 0.26, 0.05],
      [-0.14, 0.06, side * 0.19],
      carbonMat
    );
  }
  // Rear brake disc + caliper
  const brakeDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.025, 20),
    rimMat
  );
  brakeDisc.rotation.x = Math.PI / 2;
  brakeDisc.position.set(-0.84, -0.1, -0.24);
  chassisGroup.add(brakeDisc);

  root.add(chassisGroup);

  // --- Powertrain & HV ---
  const powertrainGroup = new THREE.Group();
  // Central HV Battery enclosure + cooling ribs + service disconnect
  addBoxPart(
    powertrainGroup,
    [0.44, 0.32, 0.36],
    [-0.48, 0.04, -0.08],
    graphiteMat,
    materials.powertrainEdge
  );
  for (let i = 0; i < 4; i++) {
    addBoxPart(
      powertrainGroup,
      [0.46, 0.02, 0.38],
      [-0.48, -0.06 + i * 0.065, -0.08],
      materials.powertrainGlow
    );
  }
  addBoxPart(
    powertrainGroup,
    [0.1, 0.06, 0.1],
    [-0.42, 0.23, -0.08],
    materials.powertrainGlow
  );

  // Rear cylindrical electric traction motor + stator fins
  const motor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.26, 22),
    graphiteMat
  );
  motor.rotation.x = Math.PI / 2;
  motor.position.set(-0.62, -0.04, 0.25);
  addEdgeLines(motor, materials.powertrainEdge);
  powertrainGroup.add(motor);

  for (let i = -1; i <= 1; i++) {
    const fin = new THREE.Mesh(
      new THREE.TorusGeometry(0.135, 0.012, 8, 20),
      materials.powertrainGlow
    );
    fin.position.set(-0.62, -0.04, 0.25 + i * 0.07);
    powertrainGroup.add(fin);
  }

  // Motor inverter controller + rear sprocket & drive guard
  addBoxPart(
    powertrainGroup,
    [0.24, 0.12, 0.2],
    [-0.76, 0.08, -0.16],
    carbonMat,
    materials.powertrainEdge
  );
  addBoxPart(
    powertrainGroup,
    [0.28, 0.08, 0.04],
    [-0.73, -0.07, 0.32],
    materials.powertrainGlow
  );

  // HV power conduits connecting Pack -> Inverter -> Motor
  const hvCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.48, 0.16, 0.06),
    new THREE.Vector3(-0.56, 0.24, 0.16),
    new THREE.Vector3(-0.62, 0.09, 0.24),
  ]);
  powertrainGroup.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(hvCurve, 14, 0.018, 8, false),
      materials.powertrainGlow
    )
  );
  root.add(powertrainGroup);

  // --- Embedded & Telemetry ---
  const telemetryGroup = new THREE.Group();
  // Steering column shaft
  addTubeSegment(
    telemetryGroup,
    new THREE.Vector3(0.68, -0.06, 0),
    new THREE.Vector3(0.32, 0.34, 0),
    0.018,
    graphiteMat
  );
  // Racing D-shaped steering wheel + glowing cockpit display screen
  const steeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.145, 0.019, 10, 22),
    carbonMat
  );
  steeringWheel.position.set(0.3, 0.36, 0);
  steeringWheel.rotation.set(0, Math.PI / 2, -0.62);
  addEdgeLines(steeringWheel, materials.telemetryEdge);
  telemetryGroup.add(steeringWheel);

  addBoxPart(
    telemetryGroup,
    [0.03, 0.09, 0.13],
    [0.32, 0.38, 0],
    materials.telemetryGlow,
    materials.telemetryEdge,
    [0, 0, -0.62]
  );

  // CAN-bus glowing trace from HV battery & motor forward to steering dash
  const canCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62, 0.02, 0.18),
    new THREE.Vector3(-0.34, -0.09, 0.08),
    new THREE.Vector3(0.14, -0.09, 0.04),
    new THREE.Vector3(0.54, 0.04, 0.02),
    new THREE.Vector3(0.33, 0.34, 0.01),
  ]);
  telemetryGroup.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(canCurve, 24, 0.013, 8, false),
      materials.telemetryGlow
    )
  );

  // Telemetry shark-fin antenna + front/rear Hall sensor pods
  addBoxPart(
    telemetryGroup,
    [0.09, 0.16, 0.03],
    [-0.3, 0.38, 0.14],
    materials.telemetryGlow,
    materials.telemetryEdge,
    [0, 0, -0.25]
  );
  for (const [x, y, z] of [
    [0.88, -0.06, -0.52],
    [0.88, -0.06, 0.52],
    [-0.84, -0.02, -0.56],
    [-0.84, -0.02, 0.56],
  ]) {
    addBoxPart(
      telemetryGroup,
      [0.06, 0.04, 0.06],
      [x, y, z],
      materials.telemetryGlow
    );
  }
  root.add(telemetryGroup);

  // --- Axles & 4 Racing Wheels ---
  addTubeSegment(
    root,
    new THREE.Vector3(-0.84, -0.1, -0.74),
    new THREE.Vector3(-0.84, -0.1, 0.74),
    0.024,
    rimMat
  );
  addTubeSegment(
    root,
    new THREE.Vector3(0.88, -0.14, -0.66),
    new THREE.Vector3(0.88, -0.14, 0.66),
    0.016,
    graphiteMat
  );

  const wheels: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const rearWheel = createWheel(
      0.24,
      0.26,
      tireMat,
      rimMat,
      materials.chassisGlow
    );
    rearWheel.position.set(-0.84, -0.1, side * 0.74);
    wheels.push(rearWheel);
    root.add(rearWheel);

    const frontWheel = createWheel(
      0.2,
      0.19,
      tireMat,
      rimMat,
      materials.chassisGlow
    );
    frontWheel.position.set(0.88, -0.14, side * 0.66);
    wheels.push(frontWheel);
    root.add(frontWheel);
  }

  return { root, wheels, materials };
}

function createTurntableBase() {
  const baseGroup = new THREE.Group();
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0xd2ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.34,
  });
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0xf4f4ed,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.14,
  });

  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(1.52, 1.56, 64),
    outerRingMat
  );
  outerRing.rotation.x = -Math.PI / 2;
  outerRing.position.y = -0.34;
  baseGroup.add(outerRing);

  const innerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.95, 0.97, 48),
    innerRingMat
  );
  innerRing.rotation.x = -Math.PI / 2;
  innerRing.position.y = -0.34;
  baseGroup.add(innerRing);

  return baseGroup;
}

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    const obj = child as THREE.Mesh | THREE.LineSegments;
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    const mat = obj.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => m.dispose());
    } else if (mat) {
      mat.dispose();
    }
  });
}

export function KartCanvas3D({
  progressRef,
  focus,
  modelUrl,
  fallback,
  className = "",
}: KartCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<KartFocus>(focus);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      const failId = requestAnimationFrame(() => setWebglFailed(true));
      return () => cancelAnimationFrame(failId);
    }

    if (!renderer) {
      const failId = requestAnimationFrame(() => setWebglFailed(true));
      return () => cancelAnimationFrame(failId);
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const initialW = container.clientWidth || 460;
    const initialH = container.clientHeight || 260;
    renderer.setSize(initialW, initialH);

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.innerHTML = "";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      initialW / Math.max(initialH, 1),
      0.1,
      50
    );
    camera.position.set(...FOCUS_POSE[focusRef.current].cam);
    camera.lookAt(0, 0.02, 0);

    // Studio & motorsport lighting
    const ambient = new THREE.AmbientLight(0xf4f4ed, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc8d8c0, 0.9);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xd2ff00, 2.2, 6);
    accentLight.position.set(...FOCUS_POSE[focusRef.current].light);
    scene.add(accentLight);

    const stageRoot = new THREE.Group();
    scene.add(stageRoot);

    const { root: proceduralKart, wheels, materials } = buildKartAssembly();
    const turntable = createTurntableBase();
    stageRoot.add(turntable);
    stageRoot.add(proceduralKart);

    // Optional external CAD .glb model override
    let externalModel: THREE.Object3D | null = null;
    let cancelled = false;

    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          if (cancelled) {
            disposeObject3D(gltf.scene);
            return;
          }
          const loaded = gltf.scene;
          const box = new THREE.Box3().setFromObject(loaded);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z, 0.001);
          const scale = 3.0 / maxDim;
          loaded.scale.setScalar(scale);

          const scaledBox = new THREE.Box3().setFromObject(loaded);
          const center = scaledBox.getCenter(new THREE.Vector3());
          loaded.position.set(-center.x, -scaledBox.min.y - 0.34, -center.z);

          proceduralKart.visible = false;
          externalModel = loaded;
          stageRoot.add(loaded);
        },
        undefined,
        () => {
          // Keep procedural WebGL kart cleanly active if GLB is unavailable
        }
      );
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!renderer || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width < 2 || height < 2) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(container);

    let isVisible = true;
    let rafId = 0;

    const currentCam = new THREE.Vector3(...FOCUS_POSE[focusRef.current].cam);
    const targetCam = new THREE.Vector3();
    const currentLightPos = new THREE.Vector3(
      ...FOCUS_POSE[focusRef.current].light
    );
    const targetLightPos = new THREE.Vector3();
    let currentYaw = FOCUS_POSE[focusRef.current].yaw;
    let lastProgress = progressRef.current ?? 0;

    const tick = () => {
      if (cancelled || !renderer) return;

      const activeFocus = focusRef.current;
      const pose = FOCUS_POSE[activeFocus];
      const progress = progressRef.current ?? 0;

      // Damped camera & turntable orbit synchronized with chapter focus + scroll
      const scrollSpin = (progress - 0.18) * 0.65;
      const pointerYaw = prefersReducedMotion ? 0 : pointerRef.current.x * 0.08;
      const pointerPitch = prefersReducedMotion
        ? 0
        : pointerRef.current.y * 0.05;

      const desiredYaw = pose.yaw + scrollSpin + pointerYaw;
      currentYaw = THREE.MathUtils.lerp(currentYaw, desiredYaw, 0.08);
      stageRoot.rotation.y = currentYaw;
      stageRoot.rotation.x = THREE.MathUtils.lerp(
        stageRoot.rotation.x,
        pointerPitch,
        0.08
      );

      targetCam.set(...pose.cam);
      currentCam.lerp(targetCam, 0.08);
      camera.position.copy(currentCam);
      camera.lookAt(0, 0.02, 0);

      targetLightPos.set(...pose.light);
      currentLightPos.lerp(targetLightPos, 0.1);
      accentLight.position.copy(currentLightPos);

      // Highlight active subsystem smoothly without rebuilding geometry
      const lerpGlow = (
        mat: THREE.MeshStandardMaterial,
        edge: THREE.LineBasicMaterial,
        isMatch: boolean
      ) => {
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          isMatch ? 0.65 : 0.03,
          0.1
        );
        edge.color.lerp(
          new THREE.Color(isMatch ? 0xd2ff00 : 0xf4f4ed),
          0.12
        );
        edge.opacity = THREE.MathUtils.lerp(
          edge.opacity,
          isMatch ? 0.92 : 0.24,
          0.1
        );
      };

      lerpGlow(
        materials.chassisGlow,
        materials.chassisEdge,
        activeFocus === "chassis"
      );
      lerpGlow(
        materials.powertrainGlow,
        materials.powertrainEdge,
        activeFocus === "powertrain"
      );
      lerpGlow(
        materials.telemetryGlow,
        materials.telemetryEdge,
        activeFocus === "telemetry"
      );

      // Roll the 4 wheels dynamically as scroll progresses
      const wheelRollDelta = (progress - lastProgress) * 14;
      lastProgress = progress;
      for (const w of wheels) {
        w.rotation.z -= wheelRollDelta;
      }

      renderer.render(scene, camera);

      if (!prefersReducedMotion && isVisible) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries[0]?.isIntersecting ?? true;
        if (nowVisible && !isVisible && !prefersReducedMotion) {
          isVisible = true;
          rafId = requestAnimationFrame(tick);
        } else {
          isVisible = nowVisible;
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(container);

    // Render initial frame synchronously or start animation loop
    renderer.render(scene, camera);
    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      disposeObject3D(proceduralKart);
      disposeObject3D(turntable);
      if (externalModel) disposeObject3D(externalModel);
      renderer?.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [modelUrl, progressRef]);

  if (webglFailed) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointerRef.current.x =
          ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerRef.current.y =
          ((e.clientY - rect.top) / rect.height) * 2 - 1;
      }}
      onPointerLeave={() => {
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
      }}
      className={`relative h-full w-full ${className}`}
    />
  );
}
