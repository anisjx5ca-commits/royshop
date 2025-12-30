import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DProps {
  modelPath: string;
  scale?: number;
  onLoad?: () => void;
}

export const Model3D: React.FC<Model3DProps> = ({
  modelPath,
  scale = 2,
  onLoad,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [loadingError, setLoadingError] = useRef<boolean>(false);
  
  try {
    const gltf = useGLTF(modelPath);
    const scene = gltf.scene.clone();

    useEffect(() => {
      if (onLoad) {
        onLoad();
      }

      // Optimize materials
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;

          if (node.material instanceof THREE.Material) {
            node.material.side = THREE.DoubleSide;
          }
        }
      });

      // Center and scale model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
    }, [scene, onLoad]);

    useFrame(() => {
      if (groupRef.current) {
        // Subtle rotation for presentation (handled by PresentationControls)
      }
    });

    return (
      <group ref={groupRef} scale={scale}>
        <primitive object={scene} />
      </group>
    );
  } catch (error) {
    console.error('Error loading 3D model:', modelPath, error);
    setLoadingError.current = true;
    
    // Show error text instead of cube
    return (
      <Html center>
        <div style={{
          color: '#ff6b35',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '20px',
        }}>
          ⚠️ Failed to load model
        </div>
      </Html>
    );
  }
};

useGLTF.preload([
  '/models/shirt-sample.glb',
  '/models/pants-sample.glb',
  '/models/jacket-sample.glb',
  '/models/Elegant Dress Pants.glb',
]);
