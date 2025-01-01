import { useFrame, useThree } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'

export default function Mouse() {
  const { viewport } = useThree()
  const mouseSphere = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const handleTouchMove = (event) => {
      const touch = event.touches[0]
      mouse.current.x = (touch.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(touch.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useFrame(() => {
    mouseSphere.current.setNextKinematicTranslation({
      x: (mouse.current.x * viewport.width) / 3,
      y: (mouse.current.y * viewport.height) / 3,
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
