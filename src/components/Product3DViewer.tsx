import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls, Html } from '@react-three/drei';
import { Model3D } from './Model3D';

interface Product {
  id: string;
  name: string;
  model_url?: string;
  image_url?: string;
  [key: string]: any;
}

interface Product3DViewerProps {
  product: Product;
  modelScale?: number;
  onModelLoad?: () => void;
  rotationSpeed?: number;
  enableAutoRotate?: boolean;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  product,
  modelScale = 2,
  onModelLoad,
  rotationSpeed = 0.005,
  enableAutoRotate = true,
}) => {
  const canvasRef = useRef(null);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [has3DModel] = useState(!!product?.model_url);

  // Debug logging
  console.log('🎨 Product3DViewer - Product:', product?.name, 'Model URL:', product?.model_url);

  // Handle model loading error - silently fallback to image
  const handleModelError = (error: Error) => {
    console.warn('⚠️ 3D model failed to load, using fallback image instead:', error.message);
    setModelLoadError(true);
  };

  // If no 3D model available OR model failed to load, show fallback image
  if (!product?.model_url || modelLoadError) {
    return (
      <div className="w-full h-full min-h-[400px] md:min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-card-lg flex items-center justify-center">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover"
            title="3D model unavailable - showing product image"
          />
        ) : (
          <div style={{ color: '#999', fontSize: '18px', textAlign: 'center' }}>
            No 3D model or image available
          </div>
        )}
      </div>
    );
  }

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
              {has3DModel && product.model_url && !modelLoadError ? (
                <Model3D
                  modelPath={product.model_url}
                  scale={modelScale}
                  onLoad={() => {
                    console.log('✨ Model loaded successfully!');
                    onModelLoad?.();
                  }}
                  onError={handleModelError}
                />
              ) : (
                <Html center>
                  <div style={{
                    color: '#999',
                    fontSize: '18px',
                    textAlign: 'center',
                  }}>
                    Model not available
                  </div>
                </Html>
              )}
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

// Loading fallback - shows "Loading..." text instead of cube
const LoadingFallback: React.FC = () => (
  <Html center>
    <div style={{
      color: '#666',
      fontSize: '24px',
      fontWeight: '500',
      textAlign: 'center',
      padding: '20px',
    }}>
      Loading...
    </div>
  </Html>
);
