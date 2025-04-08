"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import {
  CubeCamera,
  Environment,
  OrbitControls,
  Caustics,
  useGLTF,
  SoftShadows,
} from "@react-three/drei";
import { RGBELoader } from "three-stdlib";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IdModelResponse } from "@/api/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

interface CharProps {
  file: string;
  fabric: string;
  color: string;
  affectedMeshes: string[];
}

const Char: React.FC<CharProps> = ({ file, fabric, affectedMeshes }) => {
  const { scene } = useGLTF(`${API_BASE_URL}${file}`);
  const fabricTexture = useLoader(
    THREE.TextureLoader,
    `${API_BASE_URL}${fabric}`,
    (load) => {
      load.crossOrigin = "anonymous";
    }
  );

  const texture = useLoader(
    RGBELoader,
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr"
  );

  useEffect(() => {
    if (scene && fabricTexture && affectedMeshes) {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          affectedMeshes.includes(child.name)
        ) {
          child.material.map = fabricTexture;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, fabricTexture, affectedMeshes]);

  return scene ? (
    <CubeCamera resolution={256} frames={1} envMap={texture}>
      {() => (
        <Caustics
          color="#000"
          position={[0, 0.5, 0]}
          lightSource={[5, 5, 0.5]}
          causticsOnly={false}
          backside={false}
        >
          <primitive object={scene} scale={1.5} />
        </Caustics>
      )}
    </CubeCamera>
  ) : null;
};

const SceneLighting: React.FC = () => (
  <>
    <ambientLight intensity={0.3} />
    <spotLight intensity={1} angle={0.3} position={[10, 15, 10]} castShadow />
    <SoftShadows size={25} focus={0.8} />
  </>
);

const SceneEnvironment: React.FC = () => (
  <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr" />
);

const SceneControls: React.FC = () => (
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    enableDamping
    dampingFactor={0.1}
  />
);

export const Viewer: React.FC<IdModelResponse> = (props) => {
  const [Fabric, setFabric] = useState(props.fibers[0]);
  const [bg, setBg] = useState(props.bg_colors[0]);
  const [currentVariant, setCurrentVariant] = useState<string>(props.file_path);

  return (
    <div className="flex w-full h-[calc(100dvh-64px)]">
      <Canvas shadows camera={{ position: [-5, 200, 500], fov: 50 }}>
        <color attach="background" args={[bg.color_code]} />
        <SceneLighting />
        <Char
          file={currentVariant}
          fabric={Fabric.image_path}
          affectedMeshes={props.affected_meshes.split(",")}
          color={bg.color_code}
        />
        <SceneEnvironment />
        <SceneControls />
      </Canvas>

      {/* Control Panel */}
      <div className="w-1/2 flex items-center justify-center flex-col gap-6">
        <div>
          <h1>Variants</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentVariant(props.file_path)}
            >
              Base Model
            </Button>
            {props.char_variants.map((variant, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setCurrentVariant(variant.file_path)}
              >
                Variant {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Fabric Selector */}
        <div>
          <h1>Fabrics</h1>
          <div className="flex flex-wrap gap-2">
            {props.fibers.map((v, i) => (
              <Button key={i} variant="outline" onClick={() => setFabric(v)}>
                <img
                  className="w-[24px] h-[24px]"
                  src={`${API_BASE_URL}${v.image_path}`}
                  alt={`Fabric ${i}`}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <h1>Background Colors</h1>
          <div className="flex flex-wrap gap-2">
            {props.bg_colors.map((v, i) => (
              <Button key={i} variant="outline" onClick={() => setBg(v)}>
                <div
                  className="w-[24px] h-[24px] rounded-full"
                  style={{ backgroundColor: v.color_code }}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
