'uee client'

import { Suspense } from 'react'
import { Debug, Physics } from '@react-three/rapier'

import dynamic from 'next/dynamic'
import Balls from './Ball'
import Mouse from './Mouse'
import Borders from './Borders'
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})

export default function Spheres() {
  return (
    <View orbit className='absolute left-0 top-0 size-full h-full'>
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
    </View>
  )
}
