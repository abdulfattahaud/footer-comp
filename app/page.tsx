'use client'

import Image from 'next/image'
import { gsap } from 'gsap'
import { Suspense } from 'react'
import { Debug, Physics } from '@react-three/rapier'

import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import { Canvas } from '@react-three/fiber'
import { InstancedRigidBodies } from '@react-three/rapier'
import { useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import { OrthographicCamera, useHelper, OrbitControls } from '@react-three/drei'
import { RigidBodyApi } from '@react-three/rapier/dist/declarations/src/types'

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

  useEffect(() => {
    setTimeout(() => {
      moveLetter()
    }, 100)
  }, [])
  return (
    <div className='pointer-events-none relative z-[1] mt-auto flex h-full flex-col items-center gap-[150px] text-white md:gap-[250px]'>
      <div className=' mt-auto flex flex-col gap-[70px]'>
        <span className='text-center text-[clamp(0.75rem,0.5115rem+1.0178vw,1rem)] uppercase'>
          Is your big idea ready to go wild?
        </span>
        <div className='relative'>
          <h1
            ref={ref}
            id='title'
            className='Syne700 text-center text-[clamp(4.25rem,2.0687rem+6.1069vw,5rem)] leading-[.8] sm:text-[clamp(5rem,0.7143rem+8.9286vw,8.75rem)]'
          >
            Let’s Work <br />
            <span className='text-[#3A47F4]'>Together!</span>
          </h1>
        </div>
      </div>
      <button
        className='mb-[calc(1vh*7)] flex h-[3.375em] w-[15em] items-center  justify-center gap-[1em] rounded-[100px] bg-white text-[1.1em] text-black'
        style={{
          boxShadow: '0 6px 10px #0000000a,0 2px 4px #0000000a',
        }}
      >
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'>
          <path
            fill='#000'
            fillRule='evenodd'
            d='M7.25 2.736a.75.75 0 0 1 1.5 0v8.717l2.93-2.93a.75.75 0 0 1 1.061 1.06l-4.21 4.21-.53.53-.53-.53-4.211-4.21a.75.75 0 1 1 1.06-1.06l2.93 2.93V2.735Z'
            clipRule='evenodd'
          />
        </svg>
        <span>Continue To Scroll</span>
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'>
          <path
            fill='#000'
            fillRule='evenodd'
            d='M7.25 2.736a.75.75 0 0 1 1.5 0v8.717l2.93-2.93a.75.75 0 0 1 1.061 1.06l-4.21 4.21-.53.53-.53-.53-4.211-4.21a.75.75 0 1 1 1.06-1.06l2.93 2.93V2.735Z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  )
}
function Borders() {
  const { viewport } = useThree()
  const ref = useRef(null)
  const [dimensions, setDimensions] = useState({ width: viewport.width, height: viewport.height })
  const [aspect, setAspect] = useState(viewport.width / viewport.height)

  const resize = () => {
    setDimensions({ width: viewport.width, height: viewport.height })
    setAspect(viewport.width / viewport.height)
  }
  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return (
    <RigidBody ref={ref} type='fixed' position={[0, 0, 0]} scale={[1, 1, 1]}>
      <mesh position={[0, 0, 0.45]}>
        <boxGeometry args={[dimensions.width, 2.5, 0.1]} />
        <meshStandardMaterial color='white' transparent opacity={0} />
      </mesh>
      <mesh position={[0, 0, -0.45]}>
        <boxGeometry args={[dimensions.width, 2.5, 0.1]} />
        <meshStandardMaterial color='red' transparent opacity={0} />
      </mesh>
      <mesh position={[aspect + 0.1, 0, 0]}>
        <boxGeometry args={[0.1, 2.5, 1]} />
        <meshStandardMaterial color='black' transparent opacity={0} />
      </mesh>
      <mesh position={[-aspect - 0.1, 0, 0]}>
        <boxGeometry args={[0.1, 2.5, 1]} />
        <meshStandardMaterial color='blue' transparent opacity={0} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[dimensions.width, 0.1, 1]} />
        <meshStandardMaterial color='green' transparent opacity={0} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[dimensions.width, 0.1, 1]} />
        <meshStandardMaterial color='cyan' transparent opacity={0} />
      </mesh>
    </RigidBody>
  )
}

const Mouse = () => {
  const { pointer, viewport } = useThree()
  const mouseSphere = useRef<RigidBodyApi>(null)
  const aspect = viewport.width / viewport.height

  useFrame(() => {
    mouseSphere.current.setNextKinematicTranslation({
      x: pointer.x * aspect,
      y: pointer.y,
      z: 0,
    })
  })
  return (
    <RigidBody ref={mouseSphere} type='kinematicPosition'>
      <BallCollider args={[0.15]} />
    </RigidBody>
  )
}

function Balls() {
  const balls = useRef(null)
  const colliders = useRef(null)
  const [ballsCount, setCount] = useState(1)
  const [key, setKey] = useState(0)

  const ballsTransforms = useMemo(() => {
    const pos = []

    for (let i = 0; i < ballsCount; i++) {
      pos.push([Math.random() - 0.5, Math.random() - 0.5, (Math.random() - 0.5) * 0.5])
    }
    return { pos }
  }, [ballsCount])

  const updateBallsCount = () => {
    if (window.innerWidth > 1500) {
      setCount(300)
    } else if (window.innerWidth > 1024) {
      setCount(200)
    } else if (window.innerWidth > 768) {
      setCount(100)
    } else [setCount(50)]
    setKey((prevKey) => prevKey + 1)
  }

  useEffect(() => {
    updateBallsCount()
    window.addEventListener('resize', updateBallsCount)

    return () => {
      window.removeEventListener('resize', updateBallsCount)
    }
  }, [])

  useEffect(() => {
    // Reset ball positions and scales on refresh
    if (balls.current) {
      balls.current.instanceMatrix.needsUpdate = true
    }
  }, [ballsTransforms])

  return (
    <InstancedRigidBodies
      key={key}
      ref={colliders}
      colliders='ball'
      positions={ballsTransforms.pos as [number, number, number][]}
      // scales={ballsTransforms.scales}
      angularDamping={0.5}
      scales={Array(ballsCount).fill([0.1, 0.1, 0.1])}
    >
      <instancedMesh ref={balls} args={[null, null, ballsCount]} count={ballsCount}>
        <sphereGeometry />
        <meshStandardMaterial />
      </instancedMesh>
    </InstancedRigidBodies>
  )
}

function Spheres() {
  const { viewport, camera } = useThree()
  const vAspect = viewport.width / viewport.height
  const cameraRef = useRef(null)

  // useHelper(cameraRef, THREE.CameraHelper)
  return (
    <Suspense fallback={null}>
      {/* <OrbitControls /> */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        left={-vAspect}
        right={vAspect}
        top={1}
        bottom={-1}
        near={0.1}
        far={1000}
        manual
        position={[0, 0, 100]}
        zoom={1}
      />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <Suspense>
        <Physics gravity={[0, -10, 0]}>
          <Debug />
          <Balls />
          {/* <Mouse /> */}
          <Borders />
        </Physics>
      </Suspense>
    </Suspense>
  )
}

const Footer = () => {
  const [key, setKey] = useState(0)
  const resize = () => {
    setKey((prev) => prev + 1)
  }
  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden'>
      <Image
        src={'/img/footer-bg.png'}
        alt='bg'
        className='pointer-events-none absolute left-0 top-0 z-0 size-full object-cover object-bottom'
        width={1440}
        height={960}
      />
      <Text />
      <div className='absolute left-0 top-0 size-full'>
        <Canvas key={key} className=''>
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
