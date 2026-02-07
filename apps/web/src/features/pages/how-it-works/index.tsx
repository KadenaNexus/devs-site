'use client'

import { useState, useEffect } from 'react'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { HomeLayout } from '../home-layout'
import { getHowItWorksPage } from '@/services/strapi'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)

  const { data: page, isLoading } = useQuery({
    queryKey: ['how-it-work'],
    queryFn: getHowItWorksPage,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isLoading) return null
  if (!page) return null

  const hero = page.Hero
  const stats = page.statitems ?? []
  const solveSection = page.solve_progress
  const processSteps =
  page?.solve_progress?.solve_sub_steps?.map(
    (step: any, index: number) => ({
      id: step.id,
      step: index + 1,
      title: step.label,
      description: step.sublabel,
      details:
        step.solve_sub_progress_list?.map(
          (item: any) => item.solve_sub_progress_list
        ) ?? [],
    })
  ) ?? []
  const challengeSection = page.challenges_matters
  const startBuilding = page.start_building
  const needMoreInfo = page.need_more_info

  return (
    <HomeLayout>
      <section className='relative overflow-hidden bg-[var(--ft-dark)] pt-30 pb-16 lg:pt-32 lg:pb-20 border border-b-[var(--ft-light)]'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl'></div>
          <div className='absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl'></div>
        </div>
        <div className='relative z-10 mx-auto max-w-7xl px-6 text-center'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className='text-gradient mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
              {hero?.heading}
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl'>
              {hero?.subheading}
            </p>
          </div>

          <div
            className={`mt-16 transition-all delay-300 duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className='grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8'>
              {stats.map((stat: any, index: any) => (
                <div
                  key={index}
                  className='stat-card rounded-2xl border border-green-900 bg-[#0b1f0b] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[var(--ft-primary)]'
                >
                  <h3 className='mb-1 text-3xl font-bold text-[var(--ft-primary)]'>
                    {stat.value}
                  </h3>
                  <p className='text-sm font-medium text-white'>{stat.label}</p>
                  <p className='text-xs text-[var(--ft-only-gray)]'>
                    {stat.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-[var(--ft-dark-bg)] py-16 lg:py-20'>
        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-gradient mb-4 text-4xl font-bold md:text-5xl'>
              {solveSection?.heading}
            </h2>
            <p className='text-lg text-[var(--ft-text-color)]'>
              {solveSection?.subheading}
            </p>
          </div>

          <div className='space-y-12'>
            {processSteps.map((step: any, index: number) => (
              <div
                key={step.id}
                className='animate-fadeInUp'
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className='feature-card group relative overflow-hidden rounded-3xl bg-[var(--ft-light)] p-8 lg:p-12'>
                  <div className='relative flex flex-col gap-8 lg:flex-row lg:items-start'>
                    <div className='flex-shrink-0'>
                      <div className='relative'>
                        <div className='absolute inset-0 rounded-full bg-[var(--ft-primary)] opacity-20 blur-xl'></div>
                      </div>
                    </div>

                    <div className='flex-1'>
                      <div className='mb-2 inline-block rounded-full bg-[var(--ft-primary)] px-4 py-1 text-sm font-bold text-black'>
                        Step {step.step}
                      </div>

                      <h3 className='mb-4 text-2xl font-bold text-white lg:text-3xl'>
                        {step.title}
                      </h3>

                      <p className='mb-6 text-base leading-relaxed text-[var(--ft-only-gray)] lg:text-lg'>
                        {step.description}
                      </p>

                      <div className='grid gap-3 sm:grid-cols-2'>
                        {step.details.map((detail, idx) => (
                          <div key={idx} className='flex items-start gap-2'>
                            <FiCheck
                              className='mt-1 flex-shrink-0 text-[var(--ft-primary)]'
                              size={16}
                            />
                            <span className='text-sm text-[var(--ft-only-gray)]'>
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {index < processSteps.length - 1 && (
                    <div className='mt-8 flex justify-center lg:hidden'>
                      <div className='step-arrow flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ft-dark-bg)] text-[var(--ft-primary)]'>
                        <FiArrowRight size={24} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative bg-[var(--ft-bg-black)] py-16 lg:py-20'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-16 text-center'>
            <h2 className='text-gradient mb-4 text-4xl font-bold md:text-5xl'>
              {challengeSection?.heading}
            </h2>
            <p className='text-lg text-[var(--ft-text-color)]'>
              {challengeSection?.subheading}
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {challengeSection.solve_sub_steps.map((step: any, index: any) => (
              <div
                key={index}
                className='animate-fadeInUp feature-card group rounded-2xl bg-[var(--ft-light)] p-8 text-center'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {step.label}
                </h3>
                <p className='text-sm leading-relaxed text-[var(--ft-only-gray)]'>
                  {step.sublabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative bg-[#1f7201] py-16 lg:py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
            {startBuilding?.heading}
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-only-gray)]'>
            {startBuilding?.subheading}
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button className='cta-button rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'>
              <Link to={startBuilding?.primaryCtaLink}> {startBuilding?.primaryCtaText}</Link>
            </button>
            <button className='cta-button rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black'>
              <Link to={startBuilding?.secondaryCtaLink}> {startBuilding?.secondaryCtaText}</Link>
            </button>
          </div>
        </div>
      </section>

      <section className='relative bg-[var(--ft-bg-black)] py-16 lg:py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-[var(--ft-text-color)] md:text-4xl'>
            {needMoreInfo?.heading}
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-text-color)]'>
            {needMoreInfo?.subheading}
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button className='rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'>
              <Link to={needMoreInfo?.primaryCtaLink}> {needMoreInfo?.primaryCtaText}</Link>
            </button>
            <button className='rounded-full border border-[var(--ft-btn-hover)] bg-transparent px-8 py-4 font-medium text-[var(--ft-btn-hover)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'>
              <Link to={needMoreInfo?.secondaryCtaLink}> {needMoreInfo?.secondaryCtaText}</Link>
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
