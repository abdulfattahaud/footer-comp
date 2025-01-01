'use client'

import Spheres from '@/components/Spheres'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
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
      <span className='text-center uppercase text-[clamp(0.75rem,0.5115rem+1.0178vw,1rem)]'>
        Is your big idea ready to go wild?
      </span>
      <div className='relative'>
        <h1
          ref={ref}
          id='title'
          className='text-center font-syne text-[clamp(3.5rem,2.0687rem+6.1069vw,5rem)] sm:text-[clamp(5rem,0.7143rem+8.9286vw,8.75rem)] leading-[.8]'
        >
          Let’s Work <br />
          <span className='text-[#3A47F4]'>Together!</span>
        </h1>
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Image
        src={'/img/footer-bg.png'}
        alt='bg'
        className='pointer-events-none absolute left-0 top-0 z-0 size-full object-cover object-bottom'
        width={1440}
        height={960}
      />
      <Text />
      <Spheres />
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
