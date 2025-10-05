import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Bounds,
  Html,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import type { TerraModelViewerProps } from "./types";

function Loader() {
  return (
    <Html center>
      <div
        style={{
          padding: "8px 12px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          borderRadius: 8,
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
        }}
      >
        Loading Terra…
      </div>
    </Html>
  );
}

function TerraModel({ url }: { url: string }) {
  const gltf = useGLTF(url) as GLTF;

  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  scene.traverse((obj: THREE.Object3D) => {
    if ((obj as THREE.Mesh).isMesh) {
      const m = obj as THREE.Mesh;
      m.castShadow = true;
      m.receiveShadow = true;

      const mat = m.material as THREE.Material | THREE.Material[];
      if (Array.isArray(mat)) {
        m.material = mat.map((mm) =>
          mm instanceof THREE.MeshStandardMaterial ? mm : new THREE.MeshStandardMaterial({ color: 0xcccccc })
        ) as unknown as THREE.Material;
      } else if (!(mat instanceof THREE.MeshStandardMaterial)) {
        m.material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      }
    }
  });

  return <primitive object={scene} />;
}

export default function TerraModelViewer({
  src = "/terra.glb",
  height = 480,
  background = "transparent",
  allowZoom = true,
  autoRotate = false,
}: TerraModelViewerProps) {
  const dpr: [number, number] = [1, Math.min(window.devicePixelRatio ?? 1, 1.75)];

  return (
    <div style={{ width: "100%", height }}>
      <Canvas
  dpr={dpr}
  shadows
  gl={{ antialias: true, alpha: background === "transparent" }}
  camera={{ position: [0, 2, 6], fov: 45 }}
  style={{ background }}
>

        <hemisphereLight intensity={0.5} color={0xffffff} groundColor={0x404040} />
        <directionalLight position={[3, 5, 6]} intensity={1.2} castShadow />

        <Suspense fallback={<Loader />}>
        <Bounds
            fit
            clip
            observe
            margin={1.15}
        >
            <Center>
            <TerraModel url={src} />
            </Center>
        </Bounds>
        </Suspense>

        <ContactShadows position={[0, -0.8, 0]} opacity={0.35} blur={2.8} far={2.5} resolution={1024} frames={1} />
        <Environment preset="studio" />

        <OrbitControls
            enablePan={false}
            enableZoom={allowZoom}
            zoomSpeed={0.3}
            rotateSpeed={0.4}
            autoRotate={autoRotate}
            autoRotateSpeed={0.4}
            minDistance={2.5}
            // maxDistance={4.5}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI * 0.92}
            minPolarAngle={Math.PI * 0.06}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload?.("/terra.glb");
