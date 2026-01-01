'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Sky, Environment, ContactShadows, Float } from '@react-three/drei'
import { Physics, RigidBody, CapsuleCollider } from '@react-three/rapier'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Player } from './Player'
import { useGameStore } from '../../store/useGameStore'
import * as THREE from 'three'

function Killer() {
  const ref = useRef()
  const playerPos = useGameStore((s) => s.playerPos)
  const setStatus = useGameStore((s) => s.setStatus)

  useFrame((state, delta) => {
    if (!ref.current) return
    const currentPos = ref.current.translation()
    const target = new THREE.Vector3(...playerPos)
    
    // Movimento suave na direção do jogador
    const dir = new THREE.Vector3().subVectors(target, new THREE.Vector3(currentPos.x, 0, currentPos.z)).normalize()
    ref.current.setLinvel({ x: dir.x * 3.5, y: 0, z: dir.z * 3.5 }, true)

    if (new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z).distanceTo(target) < 1.5) {
      setStatus('dead')
    }
  })

  return (
    <RigidBody ref={ref} position={[15, 1, -15]} colliders={false} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.8, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial color="#050505" roughness={0} />
      </mesh>
      <pointLight color="red" intensity={5} distance={3} position={[0, 1, 0.5]} />
    </RigidBody>
  )
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#020205']} />
      <fog attach="fog" args={['#020205', 0, 30]} />
      <Sky sunPosition={[0, -1, 0]} />
      <Stars radius={100} depth={50} count={5000} factor={4} />

      <Physics>
        <Player />
        <Killer />
        
        {/* Chão de Neve */}
        <RigidBody type="fixed">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        </RigidBody>
      </Physics>

      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.9} />
        <Noise opacity={0.1} />
        <Vignette darkness={1.3} />
      </EffectComposer>
      <Environment preset="night" />
    </>
  )
}
