'use client'

import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import * as THREE from 'three'
import { Suspense } from 'react'
import { Physics } from '@react-three/rapier'

import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import { Canvas } from '@react-three/fiber'
import { InstancedRigidBodies } from '@react-three/rapier'
import { useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, BallCollider, RigidBody } from '@react-three/rapier'

const Text = () => {
  const ref = useRef<HTMLHeadingElement>(null)

  const moveLetter = () => {
    if (!ref.current) return

    const orgLetters = gsap.utils.toArray('#title .char') as HTMLElement[]
    const cloneLetters = gsap.utils.toArray('#title-clone .char') as HTMLElement[]
    gsap.set(cloneLetters, { y: '120%' })

    const randomLetter = () => {
      const random = Math.floor(Math.random() * orgLetters.length)
      if (!orgLetters[random] || !cloneLetters[random]) {
        console.error('Element not found at index:', random)
        return [null, null]
      }
      return [orgLetters[random], cloneLetters[random]]
    }

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 2.5 })

    timeline.add(() => {
      const [orgLetter, cloneLetter] = randomLetter()
      const [orgLetter2, cloneLetter2] = randomLetter()
      if (!orgLetter || !cloneLetter || !orgLetter2 || !cloneLetter2) return

      const randomDuration = Math.random() * 0.5 + 0.75

      gsap.to(orgLetter, {
        y: '-120%',
        ease: 'expo.inOut',
        duration: randomDuration,
        onComplete: () => {
          gsap.set(orgLetter, { y: '0%' })
        },
      })
      gsap.to(cloneLetter, {
        y: '0%',
        ease: 'expo.inOut',
        duration: randomDuration,
        onComplete: () => {
          gsap.set(cloneLetter, { y: '120%' })
        },
      })
      if (orgLetter === orgLetter2) return
      gsap.to(orgLetter2, {
        y: '-120%',
        ease: 'expo.inOut',
        duration: randomDuration,
        onComplete: () => {
          gsap.set(orgLetter2, { y: '0%' })
        },
      })
      gsap.to(cloneLetter2, {
        y: '0%',
        ease: 'expo.inOut',
        duration: randomDuration,
        onComplete: () => {
          gsap.set(cloneLetter2, { y: '120%' })
        },
      })
    })
  }

  useEffect(() => {
    if (!ref.current) return
    const split = new SplitType(ref.current, {
      types: 'chars,words',
      tagName: 'span',
    })
    gsap.set(split.words, { overflow: 'hidden', padding: '.5rem 0 1.5rem', margin: '-.5rem 0' })
    gsap.set(split.chars, {
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem 0',
      margin: '-1.5rem 0',
    })

    if (!ref.current.dataset.cloned) {
      const clone = ref.current.cloneNode(true) as HTMLElement
      clone.id = 'title-clone'
      ref.current.parentElement.appendChild(clone)
      gsap.set(clone, {
        position: 'absolute',
        left: 0,
        top: 0,
        y: '0%',
      })
      ref.current.dataset.cloned = 'true'
    }
  }, [])

  useGSAP(() => {
    setTimeout(() => {
      moveLetter()
    }, 100)
  }, [])
  return (
    <div className='pointer-events-none relative z-[1] flex flex-col items-center gap-[40px] text-white'>
      <span className='text-center text-[clamp(0.75rem,0.5115rem+1.0178vw,1rem)] uppercase'>
        Is your big idea ready to go wild?
      </span>
      <div className='relative'>
        <h1
          ref={ref}
          id='title'
          className='text-center font-syne text-[clamp(4.25rem,2.0687rem+6.1069vw,5rem)] leading-[.8] sm:text-[clamp(5rem,0.7143rem+8.9286vw,8.75rem)]'
        >
          Let’s Work <br />
          <span className='text-[#3A47F4]'>Together!</span>
        </h1>
      </div>
    </div>
  )
}

function Borders() {
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

function Mouse() {
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
    <RigidBody colliders={false} ref={mouseSphere} scale={0.5} type='kinematicPosition'>
      <BallCollider args={[2]} />
    </RigidBody>
  )
}

function Balls() {
  const balls = useRef(null)
  const [ballsCount] = useState(1000)

  const ballsTransforms = useMemo(() => {
    const pos = []
    const scales = []
    for (let i = 0; i < ballsCount; i++) {
      pos.push([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5])
      scales.push([0.25, 0.25, 0.25])
    }
    return { pos, scales }
  }, [ballsCount])

  return (
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
  )
}

function Spheres() {
  return (
    // <View orbit className='absolute left-0 top-0 size-full h-full'>
    <Suspense fallback={null}>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <Suspense>
        <Physics gravity={[0, -10, 0]}>
          {/* <Debug /> */}
          <Balls />
          <Mouse />
          <Borders />
        </Physics>
      </Suspense>
    </Suspense>
    // </View>
  )
}

const Footer = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center overflow-hidden'>
      <Image
        src={'/img/footer-bg.png'}
        alt='bg'
        className='pointer-events-none absolute left-0 top-0 z-0 size-full object-cover object-bottom'
        width={1440}
        height={960}
      />
      <Text />
      <div className='absolute left-0 top-0 size-full'>
        <Canvas onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)} className=''>
          <Spheres />
        </Canvas>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <Footer />
    </div>
  )
}
