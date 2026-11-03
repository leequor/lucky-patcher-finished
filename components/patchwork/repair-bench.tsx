"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Stage } from "@react-three/drei";
import * as THREE from "three";

import { cn } from "@/lib/utils";
import { BatteryModel } from "./models/battery";
import { BoardModel } from "./models/board";
import { ChassisModel } from "./models/chassis";
import { DisplayModel } from "./models/display";

/**
 * Every Meshy part is authored 10 units across X, flat on the XZ plane with Y as
 * thickness, so one shared scale inside a single parent group is all the
 * alignment these need — no per-part centring. 0.3 gives a 3-unit-wide stack
 * whose plate thickness still clears the 0.6 spacing.
 */
const PART_SCALE = 0.3;

/** Selected part lifts this far above its rest height. */
const LIFT = 0.3;

/** Everything that is not selected fades back so the active part leads. */
const DIM = 0.5;

const LAYERS = [
  { id: "screen", label: "Display", detail: "6.1 in OLED", y: 1.8, Model: DisplayModel },
  { id: "battery", label: "Battery", detail: "3,274 mAh", y: 0.6, Model: BatteryModel },
  { id: "board", label: "Logic board", detail: "A17 Pro", y: 1.2, Model: BoardModel },
  { id: "chassis", label: "Chassis", detail: "Grade 5 titanium", y: 0, Model: ChassisModel },
] as const;

type LayerId = (typeof LAYERS)[number]["id"];

function Layer({ spec, active }: { spec: (typeof LAYERS)[number]; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const materials = useRef<THREE.MeshStandardMaterial[]>([]);

  // Own the materials so dimming and glow never leak into the cached GLTF.
  useEffect(() => {
    const root = group.current;
    if (!root) return;

    const found: THREE.MeshStandardMaterial[] = [];
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const material = (source as THREE.MeshStandardMaterial).clone();
      material.emissive = new THREE.Color("#FF6B35");
      material.emissiveIntensity = 0;
      material.envMapIntensity = 1.25;
      material.transparent = true;
      material.opacity = 1;
      mesh.material = material;
      found.push(material);
    });
    materials.current = found;
  }, []);

  useFrame((_, delta) => {
    const ease = Math.min(1, delta * 3.4);

    const root = group.current;
    if (root) {
      root.position.y += (spec.y + (active ? LIFT : 0) - root.position.y) * ease;
    }

    const opacity = active ? 1 : DIM;
    const glow = active ? 0.04 : 0;
    for (const material of materials.current) {
      material.opacity += (opacity - material.opacity) * ease;
      material.emissiveIntensity += (glow - material.emissiveIntensity) * ease;
    }
  });

  const Model = spec.Model;

  return (
    <group ref={group} position={[0, spec.y, 0]}>
      <Model scale={PART_SCALE} />
    </group>
  );
}

function BenchFallback() {
  return (
    <div className="grid h-full place-items-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        Loading bench plate
      </p>
    </div>
  );
}

export function RepairBench({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [active, setActive] = useState<LayerId>("screen");
  const activeIndex = LAYERS.findIndex((layer) => layer.id === active);

  return (
    <section
      className={cn("flex flex-col overflow-hidden border-t border-white/10", className)}
      aria-label="Exploded iPhone bench plate"
    >
      <div className="flex items-start justify-between gap-4 px-0 pt-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
            Bench 04 · exploded teardown
          </p>
          <p className="mt-2 font-heading text-[18px] font-semibold leading-none tracking-[-0.04em] text-ink">
            iPhone 15 Pro
          </p>
        </div>
        <p className="shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {compact ? "Teardown" : `${activeIndex + 1} / ${LAYERS.length} · A2848`}
        </p>
      </div>

      <div className="relative min-h-[250px] flex-1">
        <div className="absolute inset-0">
          <Suspense fallback={<BenchFallback />}>
            <Canvas
              fallback={<BenchFallback />}
              camera={{ position: [1.7, 2.55, 4.45], fov: 35, near: 0.1, far: 40 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              onCreated={({ camera }) => camera.lookAt(0, 1.2, 0)}
            >
              <Suspense fallback={null}>
                <Stage
                  preset="soft"
                  environment="city"
                  intensity={0.8}
                  shadows={false}
                  adjustCamera={false}
                  center={{ disableX: true, disableY: true, disableZ: true }}
                >
                  <group>
                    {LAYERS.map((spec) => (
                      <Layer key={spec.id} spec={spec} active={spec.id === active} />
                    ))}
                  </group>
                </Stage>
                <ContactShadows
                  position={[0, -0.16, 0]}
                  opacity={0.5}
                  scale={5}
                  blur={2.4}
                  far={2}
                  resolution={512}
                  color="#000000"
                />
              </Suspense>
            </Canvas>
          </Suspense>
        </div>
        <p className="pointer-events-none absolute bottom-2 left-0 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
          Exploded · 4 service layers
        </p>
      </div>

      {compact ? (
        <p className="border-t border-white/10 py-2 text-[11px] text-muted">
          Drawn to scale · four service layers
        </p>
      ) : (
        <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
          {LAYERS.map((layer) => {
            const selected = active === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActive(layer.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-[54px] flex-col items-start justify-center gap-0.5 border-t-2 px-3 text-left transition-colors",
                  selected
                    ? "border-t-accent bg-white/5"
                    : "border-t-transparent hover:bg-white/5",
                )}
              >
                <span
                  className={cn("text-[12px] font-medium", selected ? "text-ink" : "text-muted")}
                >
                  {layer.label}
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-muted sm:block">
                  {layer.detail}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
