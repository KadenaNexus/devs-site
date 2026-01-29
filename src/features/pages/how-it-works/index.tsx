'use client'

import { useState, useEffect } from 'react'
import { FiAward } from 'react-icons/fi'
import { FiCheckCircle, FiCode } from 'react-icons/fi'
import { GiStairsGoal } from 'react-icons/gi'
import { ImUpload } from 'react-icons/im'
import { HomeLayout } from '../home-layout'

export function HowItWorks() {
  const features = [
    {
      id: 1,
      icon: <GiStairsGoal className='h-full w-full' />,
      title: 'Pick a Real-World Challenge',
      description:
        'P2P payments, fraud detection, supply chain, or DeFi infrastructure.',
    },
    {
      id: 2,
      icon: <FiCode className='h-full w-full' />,
      title: 'Build an MVP on Kadena',
      description:
        'Use Pact smart contracts with your preferred frontend stack.',
    },
    {
      id: 3,
      icon: <ImUpload className='h-full w-full' />,
      title: 'Submit Code & Demo',
      description: 'GitHub repository, live demo, and technical explanation.',
    },
    {
      id: 4,
      icon: <FiCheckCircle className='h-full w-full' />,
      title: 'Get Reviewed & Ranked',
      description: 'Transparent judging with clear evaluation criteria.',
    },
    {
      id: 5,
      icon: <FiAward className='h-full w-full' />,
      title: 'Win Rewards & Recognition',
      description:
        'Cash prizes, public recognition, and potential long-term collaboration.',
    },
  ]

  return (
    <HomeLayout>
      <section className='what-we-do-section relative overflow-hidden bg-[var(--ft-bg-black)] py-20 transition-colors duration-500 lg:py-32'>
        <div className='bg-gradient-radial absolute inset-0 from-emerald-900/5 via-transparent to-transparent'></div>

        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <section className='relative z-10 mx-auto mb-16 flex max-w-[1296px] px-3.75 text-center lg:mb-20'>
            <div className='serv-banner w-full bg-[var(--ft-light)] py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                How It Works
              </h1>
            </div>
          </section>

          <div className='resume-widget grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {features.map((feature) => (
              <div
                key={feature.id}
                className='feature-card group resume-item relative cursor-pointer rounded-3xl bg-[var(--ft-light)] p-8 text-center transition-all duration-500 lg:p-10'
              >
                <div className='relative mb-8'>
                  <div className='mx-auto h-10 w-10 text-[var(--ft-primary)] transition-all duration-500 group-hover:text-[var(--ft-primary-foreground)] lg:h-12 lg:w-12'>
                    {feature.icon}
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-2xl font-bold text-white transition-all duration-300 lg:text-3xl'>
                    {feature.title}
                  </h3>

                  <p className='text-sm leading-relaxed text-[var(--ft-only-gray)] transition-all duration-300 lg:text-base'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
