import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";

const MODEL_URL = "/models/iphone/chassis-transformed.glb";

type Scene = {
  nodes: { meshy_1793713389727: THREE.Mesh };
  materials: { Material0: THREE.MeshStandardMaterial };
};

export function ChassisModel({ scale = 1 }: { scale?: number }) {
  const { nodes, materials } = useGLTF(MODEL_URL, "/draco/") as unknown as Scene;

  return (
    <group scale={scale}>
      <mesh
        geometry={nodes.meshy_1793713389727.geometry}
        material={materials.Material0}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL, "/draco/");
