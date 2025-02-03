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

const App = () => {
  const [fabric, setFabric] = useState("/EG-14.jpg");
  const [bg, setbg] = useState("#f0f0f0");
  return (
    <div className="body">
      <Canvas shadows camera={{ position: [-5, 2, 500], fov: 50 }}>
        <color attach={"background"} args={[bg]} />
        <ambientLight intensity={0.1 * Math.PI} />
        <spotLight decay={0} position={[5, 5, -10]} angle={0.15} />
        <Char fabric={fabric} color={bg} />
        {/* <AccumulativeShadows
          temporal
          frames={100}
          // color={"}
          colorBlend={2}
          toneMapped={true}
          alphaTest={0.9}
          opacity={1}
          scale={12}
          position={[0, -0.5, 0]}
        >
          <RandomizedLight
            amount={8}
            radius={10}
            ambient={0.5}
            position={[5, 5, -10]}
            bias={0.001}
          />
        </AccumulativeShadows> */}
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr" />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="controller">
        <div>
          <button onClick={() => setFabric("/EG-14.jpg")}>
            <img src="/EG-14.jpg" />
          </button>
          <button onClick={() => setFabric("/EG-15.jpg")}>
            <img src="/EG-15.jpg" />
          </button>
          <button onClick={() => setFabric("/EG-16.jpg")}>
            <img src="/EG-16.jpg" />
          </button>
        </div>
        <div>
          <button onClick={() => setbg("#f0f0f0")}>
            <img src="https://placehold.co/600x400/f0f0f0/f0f0f0" />
          </button>
          <button onClick={() => setbg("#e76f51")}>
            <img src="https://placehold.co/600x400/e76f51/e76f51" />
          </button>
          <button onClick={() => setbg("#f1faee")}>
            <img src="https://placehold.co/600x400/f1faee/f1faee" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
