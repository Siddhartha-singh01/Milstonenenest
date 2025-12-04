import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
//1st 3d element
const FloatingTorus = () => {
    const torusRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (torusRef.current) {
            torusRef.current.rotation.x = t * 0.15;
            torusRef.current.rotation.y = t * 0.25;
            torusRef.current.rotation.z = t * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <mesh ref={torusRef} scale={1.2}>
                <torusGeometry args={[1, 0.4, 16, 100]} />
                <MeshDistortMaterial
                    color="#171717"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>
        </Float>
    );
};

const Auth3D = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            zIndex: 0,
            opacity: 0.4,
            pointerEvents: 'none'
        }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <spotLight position={[-10, -10, -10]} angle={0.3} intensity={0.5} />
                <FloatingTorus />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default Auth3D;
