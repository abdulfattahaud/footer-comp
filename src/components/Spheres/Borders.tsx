import { CuboidCollider, RigidBody } from '@react-three/rapier'

export default function Borders() {
  return (
    <RigidBody type='fixed'>
      {/* Back */}
      <CuboidCollider args={[5, 10, 0.5]} position={[0.5, 0.5, -2.5]} />
      {/* Front */}
      <CuboidCollider args={[5, 10, 0.5]} position={[0.5, 0.5, 2.5]} />
      {/* right */}
      <CuboidCollider args={[2, 10, 0.5]} rotation={[0, Math.PI * -0.5, 0]} position={[6, 0.5, 0]} />
      {/* Left */}
      <CuboidCollider args={[2, 10, 0.5]} rotation={[0, Math.PI * -0.5, 0]} position={[-5, 0.5, 0]} />
      {/* Floor */}
      <CuboidCollider args={[10, 10, 0.5]} rotation={[Math.PI * -0.5, 0, 0]} position={[0, -5, 0]} />
      {/* Ceil */}
      <CuboidCollider args={[10, 10, 0.5]} rotation={[Math.PI * -0.5, 0, 0]} position={[0, 10, 0]} />
      {/* Mid */}
      {/* <CuboidCollider
        args={[2.5, 2.5, 0.5]}
        // rotation={[Math.PI * -0.5, 0, 0]}
        position={[0, 2.5, 0]}
      /> */}
    </RigidBody>
  )
}
