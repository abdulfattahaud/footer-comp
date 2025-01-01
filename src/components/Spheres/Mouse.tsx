import { useFrame, useThree } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'

export default function Mouse() {
  const { viewport } = useThree()
  const mouseSphere = useRef(null)
  useFrame((state) => {
    mouseSphere.current.setNextKinematicTranslation({
      x: (state.mouse.x * viewport.width) / 3,
      y: (state.mouse.y * viewport.height) / 3,
      z: 0,
    })
  })
  return (
    <>
      <RigidBody colliders={false} ref={mouseSphere} scale={0.5} type='kinematicPosition'>
        <BallCollider args={[2]} />
      </RigidBody>
    </>
  )
}
