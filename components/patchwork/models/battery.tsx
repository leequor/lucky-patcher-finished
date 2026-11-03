import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type * as THREE from "three";

const MODEL_URL = "/models/iphone/battery-transformed.glb";

type Scene = {
  nodes: { meshy_1793713419211: THREE.Mesh };
  materials: { Material0: THREE.MeshStandardMaterial };
};

export function BatteryModel({ scale = 1 }: { scale?: number }) {
  const { nodes, materials } = useGLTF(MODEL_URL, "/draco/") as unknown as Scene;

  // Meshy shades the pouch with a base-colour map that reads maroon under the
  // bench key light. A Li-ion pouch is matte black, so drop that map and keep
  // the normal map for surface relief.
  const pouch = useMemo(() => {
    const material = materials.Material0.clone();
    material.map = null;
    material.color.set("#1a1a1a");
    material.roughness = 0.8;
    material.metalness = 0.08;
    material.needsUpdate = true;
    return material;
  }, [materials.Material0]);

  return (
    <group scale={scale}>
      <mesh
        geometry={nodes.meshy_1793713419211.geometry}
        material={pouch}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL, "/draco/");
