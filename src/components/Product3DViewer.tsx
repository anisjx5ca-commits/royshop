import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import { Model3D } from './Model3D';

interface Product3DViewerProps {
  modelPath: string;
  modelScale?: number;
  onModelLoad?: () => void;
  rotationSpeed?: number;
  enableAutoRotate?: boolean;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelPath,
  modelScale = 2,
  onModelLoad,
  rotationSpeed = 0.005,
  enableAutoRotate = true,
}) => {
  const canvasRef = useRef(null);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-card-lg">
      <Canvas
        ref={canvasRef}
        camera={{
          position: [0, 0, 3],
          fov: 50,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        {/* Environment Map for realistic reflections */}
        <Environment preset="studio" />

        {/* Presentation Controls for desktop, OrbitControls for mobile */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <group>
            <Suspense fallback={<LoadingFallback />}>
              <Model3D
                modelPath={modelPath}
                scale={modelScale}
                onLoad={onModelLoad}
              />
            </Suspense>
          </group>
        </PresentationControls>

        {/* Fallback controls for orbit */}
        <OrbitControls
          autoRotate={enableAutoRotate}
          autoRotateSpeed={rotationSpeed}
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
    </div>
  );
};

// Loading fallback
const LoadingFallback: React.FC = () => (
  <group>
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#cccccc"
        wireframe={true}
        opacity={0.5}
        transparent={true}
      />
    </mesh>
  </group>
);
