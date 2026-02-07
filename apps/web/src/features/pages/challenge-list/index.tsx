'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { fetchChallenges } from '@/services/challenges'
import { HomeLayout } from '../home-layout'
import FillButton from '../components/FillButton'
import { truncateWords } from '@/utils/textUtils'
import { CHALLENGE_CATEGORIES } from '@/features/challenges/data/schema'

export function ChallengeList() {
  const [activeFilter, setActiveFilter] = useState('All')

  const { data: challengesData = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  // Extract unique categories from challenges and add predefined categories
  const filters = useMemo(() => {
    const categoriesFromData = challengesData
      .map((c) => c.category)
      .filter((cat): cat is string => !!cat)
      .filter((cat, index, self) => self.indexOf(cat) === index)

    // Combine with predefined categories from schema
    const allCategories = [
      ...new Set([
        ...CHALLENGE_CATEGORIES.map((c) => c.value),
        ...categoriesFromData,
      ]),
    ]

    return ['All', ...allCategories]
  }, [challengesData])

  const filteredChallenges = useMemo(() => {
    if (activeFilter === 'All') {
      return challengesData
    }
    return challengesData.filter(
      (challenge) => challenge.category === activeFilter
    )
  }, [challengesData, activeFilter])

  return (
    <HomeLayout>
      <section className='serv-main other-bg relative'>
        <div className='serv-overlay overflow-hidden pt-30 pb-16'>
          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner bg-[var(--ft-light)] w-full py-15 text-center'>
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

                  <div className='flex flex-wrap gap-3 rounded-full bg-[var(--ft-light)] p-3'>
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full text-white px-6 py-2 text-sm font-medium transition-colors ${
                          activeFilter === filter
                            ? 'bg-gradient-to-br from-[var(--ft-primary)] to-[#155842]'
                            : 'bg-[#031700] text-gray-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {isLoading ? (
                  <div className='col-span-full py-12 text-center'>
                    <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--ft-primary)] border-t-transparent'></div>
                    <p className='text-lg text-gray-400'>Loading challenges...</p>
                  </div>
                ) : filteredChallenges.length > 0 ? (
                  filteredChallenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className='animate-fadeInUp overflow-hidden rounded-2xl border-1 border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] backdrop-blur-[4px]'
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className='space-y-4 p-4'>
                        {challenge.image_url ? (
                          <img
                            src={challenge.image_url}
                            alt={challenge.title}
                            className='h-48 w-full rounded-lg object-cover'
                          />
                        ) : (
                          <div className='flex h-48 w-full items-center justify-center rounded-lg bg-[#031700]'>
                            <span className='text-4xl font-bold text-[var(--ft-primary)]/30'>
                              {challenge.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        {challenge.category && (
                          <div className='inline-block rounded-full bg-[var(--ft-primary)]/20 px-3 py-1'>
                            <span className='text-xs font-medium text-[var(--ft-primary)]'>
                              {challenge.category}
                            </span>
                          </div>
                        )}
                        
                        <h3 className='line-clamp-2 text-xl font-bold text-white'>
                          {challenge.title}
                        </h3>
                        
                        <p className='text-sm leading-relaxed text-[#DDDDDD]'>
                          {truncateWords(challenge.description, 8)}
                        </p>

                        <div className='pt-2'>
                          <p className='mb-1 text-xs text-white'>Prize pool</p>
                          <p className='text-2xl font-bold text-white'>
                            {challenge.prize_pool || 'TBA'}
                          </p>
                        </div>

                        <Link to={`/challenge/${challenge.id}`}>
                          <FillButton className='w-full'>
                            View Details
                          </FillButton>
                        </Link>
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
