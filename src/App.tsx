import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import "./App.css";
import { useState } from "react";
function Character({ fabric }: { fabric: string }) {
  const { scene } = useGLTF("/model.glb");
  const fabricTexture = useTexture(fabric);
  scene.traverse((child: any) => {
    if (child.isMesh) {
      if (child.name == "Fabric") {
        child.material.map = fabricTexture;

        child.material.needsUpdate = true;
      }
    }
  });
  return <primitive object={scene} scale={1.5} />;
}
// function CameraLogger() {
//   const { camera } = useThree();
//   useFrame(() => {
//     console.log(`Zoom: ${camera.zoom.toFixed(2)}`);
//     console.log(
//       `Position: x=${camera.position.x.toFixed(
//         2
//       )}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`
//     );
//   });
//   return null;
// }
function App() {
  const [fabric, setFabric] = useState("/EG-14.jpg");
  return (
    <div className="body">
      <Canvas camera={{ position: [0, 2, 500], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Character fabric={fabric} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          dampingFactor={0.1}
        />
      </Canvas>
      <div className="controller">
        <div>
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
        </div>
      </div>
    </div>
  );
}

export default App;
