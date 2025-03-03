"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import {
  useGLTF,
  CubeCamera,
  Environment,
  OrbitControls,
  useTexture,
  Caustics,
} from "@react-three/drei";
import { RGBELoader } from "three-stdlib";
import "./App.css";
import { useState } from "react";
import { Button } from "react-day-picker";
const Char = (props: any) => {
  const { nodes, scene } = useGLTF("/model.glb");
  const texture = useLoader(
    RGBELoader,
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr"
  );
  const fabricTexture = useTexture(props.fabric);
  scene.traverse((child: any) => {
    if (child.isMesh && child.name === "Fabric") {
      child.material.map = fabricTexture;
      child.material.needsUpdate = true;
    }
  });

  console.log(nodes);

  return (
    <CubeCamera resolution={256} frames={1} envMap={texture}>
      {() => (
        <Caustics
          color={"#000"}
          position={[0, 0.5, 0]}
          lightSource={[5, 5, 0.5]}
          worldRadius={0.1}
          ior={1.8}
          backsideIOR={1.1}
          intensity={1}
          causticsOnly={false}
          backside={false}
        >
          <primitive object={scene} scale={1.5} />
        </Caustics>
      )}
    </CubeCamera>
  );
};

export const Viewer = (props: { fabric: string[]; background: string[] }) => {
  const [Fabric, setFabric] = useState(props.fabric[0]);
  const [bg, setBg] = useState(props.background[0]);

  return (
    <div className="flex w-full h-full ">
      <Canvas shadows camera={{ position: [-5, 200, 500], fov: 50 }}>
        <color attach={"background"} args={[bg]} />
        <ambientLight intensity={0.1 * Math.PI} />
        <spotLight decay={0} position={[5, 5, -10]} angle={0.15} />
        <Char fabric={Fabric} color={bg} />
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr" />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      <div className="w-1/2 flex items-center justify-center">
        <div className="flex w-full justify-around">
          {props.fabric.map((v, i) => (
            <Button key={i} onClick={() => setFabric(v)}>
              <img className="w-12" src={v} />
            </Button>
          ))}
        </div>
        <div className="flex w-full justify-around">
          {props.fabric.map((v, i) => (
            <Button
              key={i}
              onClick={() => setBg(v)}
              className={`w-[24px] h-[24px] bg-[${v}]`}
            ></Button>
          ))}
        </div>
      </div>
    </div>
  );
};
