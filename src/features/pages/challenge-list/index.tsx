'use client'

import { useState } from 'react'
import { HomeLayout } from '../home-layout'

export function ChallengeList() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Apps', 'NFT', 'AI', 'UX/UI']

  const challenges = [
    {
      id: 1,
      title: 'DeFi Protocol Builder',
      description:
        'Build protocol builder, in protocol and contact anbmissions.',
      prizePool: '$300',
      category: 'Apps',
      image: '/images/proj-img.jpg',
    },
    {
      id: 2,
      title: 'NFT Marketplace Creator',
      description:
        'Build protocol builder, in protocol and contact anbmissions.',
      prizePool: '$500',
      category: 'NFT',
      image: '/images/proj-img.jpg',
    },
    {
      id: 3,
      title: 'AI Smart Contract Auditor',
      description:
        'Build protocol builder, in protocol and contact anbmissions.',
      prizePool: '$800',
      category: 'AI',
      image: '/images/proj-img.jpg',
    },
    {
      id: 4,
      title: 'Web3 Dashboard Design',
      description:
        'Build protocol builder, in protocol and contact anbmissions.',
      prizePool: '$400',
      category: 'UX/UI',
      image: '/images/proj-img.jpg',
    },
  ]

  const filteredChallenges =
    activeFilter === 'All'
      ? challenges
      : challenges.filter((challenge) => challenge.category === activeFilter)

  return (
    <HomeLayout>
      <section className='serv-main other-bg relative'>
        <div className='serv-overlay overflow-hidden pt-16 pb-16'>
          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner w-full py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                Challenge List
              </h1>
            </div>
          </section>

          <section className='py-20 lg:py-20'>
            <div className='mx-auto max-w-[1296px] px-[15px]'>
              <div className='mb-8 lg:mb-8'>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                  <h2 className='fade-in text-gradient text-3xl font-bold md:text-4xl lg:text-5xl'>
                    Challenges
                  </h2>

                  <div className='flex flex-wrap gap-3 rounded-full bg-[#0D1D18] p-3'>
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                          activeFilter === filter
                            ? 'bg-gradient-to-br from-[var(--frontend-primary)] to-[#155842]'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {filteredChallenges.length > 0 ? (
                  filteredChallenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className='animate-fadeInUp overflow-hidden rounded-2xl border-1 border-[var(--frontend-primary)] bg-[#1f413780] backdrop-blur-[4px]'
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className='space-y-4 p-4'>
                        <img
                          src={challenge.image}
                          alt={challenge.title}
                          className='h-full w-full rounded-lg object-cover'
                        />
                        <h3 className='text-xl font-bold text-white'>
                          {challenge.title}
                        </h3>
                        <p className='text-sm leading-relaxed text-[#DDDDDD]'>
                          {challenge.description}
                        </p>

                        <div className='pt-2'>
                          <p className='mb-1 text-xs text-white'>Prize pool</p>
                          <p className='text-2xl font-bold text-white'>
                            {challenge.prizePool}
                          </p>
                        </div>

                        <button className='w-full rounded-full bg-[var(--frontend-primary)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--frontend-btn-hover)]'>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full py-12 text-center'>
                    <p className='text-lg text-gray-400'>
                      No challenges found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </HomeLayout>
  )
}
