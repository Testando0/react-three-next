import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '@/store/useGameStore'

export function Killer() {
  const ref = useRef()
  const playerPos = useGameStore((state) => state.playerPos)

  useFrame((state, delta) => {
    if (!ref.current) return
    const currentPos = ref.current.translation()
    const target = new THREE.Vector3(...playerPos)
    
    // Perseguição Suave
    const dir = new THREE.Vector3().subVectors(target, new THREE.Vector3(currentPos.x, 0, currentPos.z)).normalize()
    ref.current.setLinvel({ x: dir.x * 3.5, y: 0, z: dir.z * 3.5 }, true)

    // O bot encara o jogador
    ref.current.setNextKinematicRotation(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
    )
  })

  return (
    <RigidBody ref={ref} position={[20, 1, -20]} type="kinematicVelocity" colliders={false}>
      <CapsuleCollider args={[0.8, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
      </mesh>
      <pointLight color="red" intensity={10} distance={4} position={[0, 1, 0.5]} />
    </RigidBody>
  )
}
