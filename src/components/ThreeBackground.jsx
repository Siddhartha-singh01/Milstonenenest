import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

const Geometry = (props) => {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.2;
            mesh.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh
                {...props}
                ref={mesh}
                scale={active ? 1.5 : 1}
                onClick={() => setActive(!active)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={hovered ? '#6366f1' : '#eab308'}
                    roughness={0.1}
                    metalness={0.5}
                />
            </mesh>
        </Float>
    );
};

const ThreeBackground = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none', // Allow clicks to pass through to content below
            opacity: 0.3
        }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Geometry position={[-3, 2, 0]} />
                <Geometry position={[3, -2, -2]} />
                <Geometry position={[0, 0, -5]} scale={2} />
                <Environment preset="city" />
            </Canvas> 
        </div>
    );
};

export default ThreeBackground;
