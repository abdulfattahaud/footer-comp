'use client'
import { InstancedRigidBodies, RigidBody } from '@react-three/rapier'
import { useEffect, useMemo } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Balls() {
  const balls = useRef(null)
  const ballsCount = 1000

  const ballsTransforms = useMemo(() => {
    const pos = []
    const scales = []
    for (let i = 0; i < ballsCount; i++) {
      pos.push([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5])
      scales.push([0.25, 0.25, 0.25])
    }
    return { pos, scales }
  }, [])

  // useEffect(() => {
  //   if (balls.current) {
  //     for (let i = 0; i < ballsCount; i++) {
  //       const color = new THREE.Color(
  //         `hsl(${Math.random() * 50 + 260}, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 40}%)`,
  //       )
  //       balls.current.setColorAt(i, color)
  //     }
  //     balls.current.instanceColor.needsUpdate = true
  //   }
  // }, [ballsCount])

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
