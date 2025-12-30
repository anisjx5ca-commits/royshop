import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DProps {
  modelPath: string;
  scale?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const Model3D: React.FC<Model3DProps> = ({
  modelPath,
  scale = 2,
  onLoad,
  onError,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Debug logging for model loading
  console.log('🔄 Loading 3D model from:', modelPath);
  
  try {
    // Load GLB with Draco support enabled
    // The gstatic CDN provides the Draco decoder for compressed models
    const gltf = useGLTF(modelPath, 'https://www.gstatic.com/draco/v1/decoders/');
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
      
      console.log('✅ Model loaded successfully:', modelPath);
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorType = error instanceof Error && error.name ? error.name : 'Unknown Error';
    
    console.error('❌ Failed to load 3D model:', {
      url: modelPath,
      errorName: errorType,
      errorMessage: errorMessage,
      fullError: error,
      isDracoIssue: errorMessage.includes('draco') || errorMessage.includes('Draco'),
      isCorsIssue: errorMessage.includes('CORS') || errorMessage.includes('cors'),
      isNetworkIssue: errorMessage.includes('404') || errorMessage.includes('fetch'),
    });
    
    // Call onError callback instead of showing error UI
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    
    // Return empty group - parent will show fallback
    return <group />;
  }
};

// Configure Draco support globally
useGLTF.preload(
  [
    '/models/shirt-sample.glb',
    '/models/pants-sample.glb',
    '/models/jacket-sample.glb',
    '/models/pants.glb',
  ],
  'https://www.gstatic.com/draco/v1/decoders/'
);
