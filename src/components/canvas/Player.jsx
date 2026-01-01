import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { useGameStore } from '../../store/useGameStore'

export function Player() {
  const body = useRef()
  const setPlayerPos = useGameStore((s) => s.setPlayerPos)
  const [, getKeys] = useKeyboardControls()

  useFrame((state) => {
    if (!body.current || useGameStore.getState().status !== 'playing') return
    
    const { forward, backward, left, right } = getKeys()
    const impulse = { x: 0, y: 0, z: 0 }
    const linvel = body.current.linvel()
    const speed = 4

    // Movimentação baseada na rotação da câmera
    const frontVector = new THREE.Vector3(0, 0, backward - forward)
    const sideVector = new THREE.Vector3(left - right, 0, 0)
    const direction = new THREE.Vector3().subVectors(frontVector, sideVector).applyQuaternion(state.camera.quaternion).normalize().multiplyScalar(speed)

    body.current.setLinvel({ x: direction.x, y: linvel.y, z: direction.z }, true)
    
    // Atualiza posição global para a IA
    const translation = body.current.translation()
    setPlayerPos([translation.x, translation.y, translation.z])
    state.camera.position.set(translation.x, translation.y + 0.8, translation.z)
  })

  return (
    <RigidBody ref={body} colliders={false} mass={1} position={[0, 5, 0]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <spotLight castShadow position={[0, 0.8, 0]} angle={0.4} penumbra={1} intensity={20} distance={15} color="#fffaff" />
    </RigidBody>
  )
}
