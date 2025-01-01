'use client'
import { InstancedRigidBodies } from '@react-three/rapier'
import { useEffect, useMemo, useState } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Balls() {
  const balls = useRef(null)
  const [ballsCount, setBallsCount] = useState(1000)

  const ballsTransforms = useMemo(() => {
    const pos = []
    const scales = []
    for (let i = 0; i < ballsCount; i++) {
      pos.push([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5])
      scales.push([0.25, 0.25, 0.25])
    }
    return { pos, scales }
  }, [ballsCount])

  useEffect(() => {
    // if (!balls.current) return
    // balls.current.dispose()
  }, [balls.current])
  // useEffect(() => {
  //   const handleResize = () => {
  //     const screenWidth = window.innerWidth
  //     // const newBallsCount = Math.floor(screenWidth / 2)
  //     screenWidth < 768 ? setBallsCount(100) : setBallsCount(1000)
  //   }

  //   window.addEventListener('resize', handleResize)
  //   handleResize() // Call once to set initial size

  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  return (
    <>
      {/* <RigidBody position={[0, 2, 0]} colliders="ball">
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="tomato" />
        </mesh>
      </RigidBody> */}
      <InstancedRigidBodies
        colliders='ball'
        positions={ballsTransforms.pos}
        scales={ballsTransforms.scales}
        angularDamping={0.5}
      >
        <instancedMesh ref={balls} args={[null, null, ballsCount]}>
          <sphereGeometry />
          <meshStandardMaterial />
        </instancedMesh>
      </InstancedRigidBodies>
    </>
  )
}
