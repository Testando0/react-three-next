'use client'
import { Canvas } from '@react-three/fiber'
import { Sky, Stars, Environment, Cloud } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { Player } from './Player' // Vamos criar esse arquivo
import { Killer } from './Killer' // Vamos criar esse arquivo

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#020205']} />
      <fog attach="fog" args={['#020205', 5, 25]} />
      
      {/* Clima de Tempestade */}
      <Sky sunPosition={[0, -1, 0]} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <Cloud opacity={0.2} speed={0.4} width={50} depth={5} segments={20} position={[0, 2, 0]} color="#111" />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Jogador e Assassino */}
        <Player />
        <Killer />

        {/* Chão de Neve Infinito */}
        <RigidBody type="fixed" friction={2}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        </RigidBody>
      </Physics>

      {/* Pós-processamento de Cinema */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.9} />
        <Vignette darkness={1.4} />
        <Noise opacity={0.15} />
      </EffectComposer>

      <Environment preset="night" />
    </>
  )
}
