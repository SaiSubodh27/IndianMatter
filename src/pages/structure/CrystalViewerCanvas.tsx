import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Atom {
  species: string;
  fractional_coordinates: [number, number, number];
}

interface CrystalViewerProps {
  atoms: Atom[];
  lattice: {
    a: number;
    b: number;
    c: number;
    alpha?: number;
    beta?: number;
    gamma?: number;
  };
  materialLabel?: string;
  sourceLabel?: string;
}

type ElementConfig = { color: number; radius: number };

const elementConfig: Record<string, ElementConfig> = {
  Li: { color: 0xe5a7ff, radius: 0.34 },
  Co: { color: 0x61b8ff, radius: 0.46 },
  Fe: { color: 0xffa66f, radius: 0.45 },
  O: { color: 0xff7188, radius: 0.31 },
  Ba: { color: 0x62e7d2, radius: 0.48 },
  Ti: { color: 0xb7c0ce, radius: 0.43 },
  Zr: { color: 0x77dbac, radius: 0.46 },
  La: { color: 0xffd26e, radius: 0.49 },
  P: { color: 0xc09cff, radius: 0.4 },
  S: { color: 0xffdd7d, radius: 0.42 },
};

function getElementConfig(species: string) {
  return elementConfig[species] ?? { color: 0xd8deea, radius: 0.4 };
}

function vectorsFromLattice(lattice: CrystalViewerProps["lattice"]) {
  const deg = Math.PI / 180;
  const alpha = (lattice.alpha ?? 90) * deg;
  const beta = (lattice.beta ?? 90) * deg;
  const gamma = (lattice.gamma ?? 90) * deg;
  const a = new THREE.Vector3(lattice.a || 5, 0, 0);
  const b = new THREE.Vector3(
    (lattice.b || 5) * Math.cos(gamma),
    (lattice.b || 5) * Math.sin(gamma),
    0,
  );
  const cx = (lattice.c || 5) * Math.cos(beta);
  const cy =
    ((lattice.c || 5) * (Math.cos(alpha) - Math.cos(beta) * Math.cos(gamma))) /
    Math.max(Math.sin(gamma), 0.001);
  const cz = Math.sqrt(Math.max((lattice.c || 5) ** 2 - cx ** 2 - cy ** 2, 0));
  return { a, b, c: new THREE.Vector3(cx, cy, cz) };
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION — CRYSTAL VIEWER CANVAS (bundled three.js WebGL renderer)
// ══════════════════════════════════════════════════════════════════════════════

export default function CrystalViewerCanvas({
  atoms,
  lattice,
  materialLabel,
  sourceLabel,
}: CrystalViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfdfbf8);
    // Fog will be updated after maxDim is calculated

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 320);
      const height = Math.max(mount.clientHeight, 300);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    scene.add(new THREE.AmbientLight(0xffffff, 1.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);
    const warmLight = new THREE.PointLight(0xffb27b, 7, 30, 2);
    warmLight.position.set(-8, 5, -9);
    scene.add(warmLight);
    const fillLight = new THREE.PointLight(0xffe9dc, 6, 28, 2);
    fillLight.position.set(9, -4, 6);
    scene.add(fillLight);

    const vectors = vectorsFromLattice(lattice);
    const center = vectors.a
      .clone()
      .add(vectors.b)
      .add(vectors.c)
      .multiplyScalar(0.5);
    const maxDim = Math.max(
      vectors.a.length(),
      vectors.b.length(),
      vectors.c.length(),
      5,
    );
    const camDist = maxDim * 2.8;
    camera.position.set(maxDim * 1.7, maxDim * 1.2, maxDim * 2.15);
    camera.lookAt(0, 0, 0);
    scene.fog = new THREE.Fog(0xfdfbf8, camDist * 0.8, camDist * 2);

    const group = new THREE.Group();
    scene.add(group);

    const positions: THREE.Vector3[] = [];
    atoms.forEach((atom) => {
      const [fx, fy, fz] = atom.fractional_coordinates;
      const position = vectors.a
        .clone()
        .multiplyScalar(fx)
        .add(vectors.b.clone().multiplyScalar(fy))
        .add(vectors.c.clone().multiplyScalar(fz))
        .sub(center);
      positions.push(position);
      const config = getElementConfig(atom.species);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.radius, 32, 24),
        new THREE.MeshPhysicalMaterial({
          color: config.color,
          roughness: 0.22,
          metalness: 0.08,
          clearcoat: 0.7,
          emissive: config.color,
          emissiveIntensity: 0.025,
        }),
      );
      mesh.position.copy(position);
      group.add(mesh);
    });

    const bondMaterial = new THREE.MeshStandardMaterial({
      color: 0x9aa1aa,
      roughness: 0.42,
      transparent: true,
      opacity: 0.72,
    });
    const threshold = Math.max(maxDim * 0.3, 2.35);
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const direction = positions[j].clone().sub(positions[i]);
        const distance = direction.length();
        if (distance > threshold) continue;
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, distance, 10),
          bondMaterial,
        );
        bond.position.copy(positions[i]).add(positions[j]).multiplyScalar(0.5);
        bond.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize(),
        );
        group.add(bond);
      }
    }

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(maxDim * 2.4, 64),
      new THREE.MeshBasicMaterial({
        color: 0xf4b38c,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -maxDim * 0.65;
    scene.add(floor);

    let frame = 0;
    const animate = () => {
      group.rotation.y += 0.0024;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material))
            material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [atoms, lattice]);

  return (
    <div
      ref={mountRef}
      className="relative h-full min-h-[480px] w-full overflow-hidden rounded-2xl bg-[#fdfbf8] border border-[#EDE8E2]"
      aria-label="Interactive crystal structure visualization"
    >
      {(materialLabel || sourceLabel) && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[70%] rounded-xl bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur-sm border border-[#EDE8E2]">
          {materialLabel && (
            <p className="font-mono text-xs font-bold text-[#1E2227]">
              {materialLabel}
            </p>
          )}
          {sourceLabel && (
            <p className="mt-0.5 text-[9px] uppercase tracking-[.14em] text-[#8C929C] font-medium">
              {sourceLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
