'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getHomePage } from '@/services/strapi'
import { fetchChallenges } from '@/services/challenges'
import { fetchApprovedSubmissions } from '@/services/submissions'
import { Link } from 'react-router-dom'
import { iconMap } from '@/utils/iconMap.tsx'
import { calculateTimeRemaining, getCategoryAbbreviation, getTimeAgo } from '@/utils/timeCalculations'
import Counter from '../components/Counter'
import FillButton from '../components/FillButton'
import StrokeButton from '../components/StrokeButton'
import { HomeLayout } from '../home-layout'
import { calculateAverageScore } from '@/utils/textUtils'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/homepage' })
  },
})

export function Homepage() {
  const [isVisible, setIsVisible] = useState(false)

  const { data: page, isLoading } = useQuery({
    queryKey: ['home-page'],
    queryFn: getHomePage,
  })

  const { data: challengesData = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const { data: approvedSubmissionsData = [] } = useQuery({
    queryKey: ['approved-submissions-homepage'],
    queryFn: fetchApprovedSubmissions,
  })
  

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isLoading) return null
  if (!page) return null

  const hero = page.Hero
  const stats = page.statitems ?? []
  const solve = page.solve_section?.[0]
  const why_challenges_items = page.why_challenges_items

  // Filter and prepare upcoming challenges
  const upcomingChallenges = challengesData
    .filter((challenge) => {
      // Only show challenges that have a timeline and are upcoming or live
      if (!challenge.timeline) return false
      const targetDate = new Date(challenge.timeline)
      const now = new Date()
      // Show challenges that haven't ended yet (within 24 hours past timeline)
      return targetDate.getTime() > now.getTime() - 24 * 60 * 60 * 1000
    })
    .sort((a, b) => {
      // Sort by timeline (closest first)
      const dateA = new Date(a.timeline!).getTime()
      const dateB = new Date(b.timeline!).getTime()
      return dateA - dateB
    })
    .slice(0, 4) // Take top 4
    .map((challenge) => ({
      id: challenge.id,
      badge: getCategoryAbbreviation(challenge.category),
      badgeColor: 'bg-[var(--ft-primary)]',
      title: challenge.title,
      description: challenge.description || '',
      prizePool: challenge.prize_pool || 'TBA',
      timeLeft: calculateTimeRemaining(challenge.timeline!),
      challengeId: challenge.id,
    }))

  const challenges = upcomingChallenges

  // Recent approved submissions (limited to 4)
  const recentWinners = approvedSubmissionsData
    .slice(0, 4)
    .map((submission: any) => ({
      id: submission.id,
      name: submission.developer_name || 'Anonymous',
      timeAgo: getTimeAgo(submission.created_at),
      avatar: submission.profile_pic || '/images/user.jpg',
      approved: true,
    }))

  // Top submissions with links (limited to 2)
  const topSubmissions = approvedSubmissionsData
    .slice(0, 2)
    .map((submission: any) => ({
      id: submission.id,
      badge: getCategoryAbbreviation(submission.category),
      title: submission.project_title || 'Untitled Project',
      score: calculateAverageScore(submission.scores),
      github_url: submission.github_url,
      demo_url: submission.demo_url,
      project_title: submission.project_title,
    }))

  return (
    <HomeLayout>
      <section className='hero-section relative overflow-hidden pt-16 pb-16'>
        <div className='relative z-10 mx-auto max-w-[1296px] px-[15px]'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div
              className={`space-y-8 transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <div className='space-y-4'>
                <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                  {hero?.heading}
                </h1>
                <p className='max-w-xl text-base leading-relaxed text-[var(--ft-text-gray)] md:text-lg'>
                  {hero?.subheading}
                </p>
              </div>

              <div className='flex flex-wrap gap-4'>
                <FillButton>
                  <Link to={hero?.primaryCtaLink}> {hero?.primaryCtaText}</Link>
                </FillButton>
                <StrokeButton>
                  <Link to={hero?.secondaryCtaLink}>
                    {hero?.secondaryCtaText}
                  </Link>
                </StrokeButton>
              </div>
            </div>

            <div
              className={`relative transition-all delay-300 duration-1000 ${
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-10 opacity-0'
              }`}
            >
              <img
                src={`${import.meta.env.VITE_STRAPI_URL}${hero?.image[0]?.url}`}
                alt='3D Robot Illustration'
                className='relative z-10 w-full object-contain'
              />
            </div>
          </div>

          <div
            className={`mt-20 transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className='grid grid-cols-2 gap-8 lg:grid-cols-4'>
              {stats.map((stat: any, index: any) => (
                <div
                  key={index}
                  className='stat-card space-y-1 rounded-xl bg-[var(--ft-light)] p-6 text-center backdrop-blur-sm'
                >
                  <h3 className='text-3xl font-bold text-white md:text-3xl'>
                    {isVisible &&
                      (isNaN(parseFloat(stat.value)) ? (
                        stat.value
                      ) : (
                        <Counter value={stat.value} />
                      ))}
                  </h3>

                  <p className='text-sm font-medium text-[var(--ft-only-gray)]'>
                    {stat.label}
                  </p>
                  <p className='text-sm text-[var(--ft-only-gray)]'>
                    {stat.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='relative bg-[#1f7201] py-24'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='text-4xl font-bold text-green-400 text-white md:text-5xl'>
              {solve?.title}
            </h2>
            <p className='mt-4 text-white'>{solve.subtitle}</p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {solve?.items?.map((item: any) => (
              <div
                key={item.id}
                className='rounded-2xl border border-green-900 bg-[#0b1f0b] p-8 text-center transition hover:border-green-500'
              >
                <div className='mb-4 flex justify-center text-[var(--ft-primary)]'>
                  {iconMap[item.iconKey] ?? null}
                </div>
                <h3 className='mb-3 text-xl font-semibold text-white'>
                  {item.title}
                </h3>
                <p className='text-sm leading-relaxed text-[var(--ft-only-gray)]'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-[var(--ft-dark-bg)] py-20 transition-colors duration-500 lg:py-32'>
        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='fade-in text-gradient text-4xl font-bold md:text-5xl lg:text-6xl'>
              Upcoming Challenges
            </h2>
          </div>

          <div className='proj-grid mx-auto grid auto-rows-fr gap-10 md:grid-cols-2'>
            {challenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className='upcoming-card relative h-full'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='proj-main-box relative h-full rounded-[10px] bg-[var(--ft-light)] p-9 pb-0'>
                  <div className='proj-inner-box relative flex h-full flex-col overflow-hidden bg-[var(--background)] p-9'>
                    <div className='mb-8 flex items-center justify-between'>
                      <div
                        className={`${challenge.badgeColor} badge-float rounded-lg px-4 py-4 text-xl font-bold text-[var(--ft-primary-foreground)] shadow-lg`}
                      >
                        {challenge.badge}
                      </div>

                      <div className='timer-pulse flex items-center gap-2 rounded-full border border-[var(--ft-primary)] bg-[var(--ft-light)] px-4 py-2'>
                        <svg
                          className='h-4 w-4 text-[var(--ft-primary)]'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <circle cx='12' cy='12' r='10' strokeWidth='2' />
                          <path
                            strokeWidth='2'
                            strokeLinecap='round'
                            d='M12 6v6l4 2'
                          />
                        </svg>
                        <span className='text-sm font-medium text-[var(--ft-primary)]'>
                          {challenge.timeLeft}
                        </span>
                      </div>
                    </div>

                    <div className='mb-6 flex-1 space-y-4'>
                      <h3 className='text-2xl font-bold text-[var(--ft-text-color)] lg:text-3xl'>
                        {challenge.title}
                      </h3>

                      <p className='text-sm leading-relaxed text-[var(--ft-text-gray)]'>
                        {challenge.description}
                      </p>

                      <div className='pt-2'>
                        <p className='mb-1 text-xs text-[var(--ft-text-gray)]'>
                          Prize pool
                        </p>
                        <p className='text-3xl font-bold text-[var(--ft-text-color)]'>
                          {challenge.prizePool}
                        </p>
                      </div>
                    </div>

                    <div className='proj-btn-box mt-auto flex flex-wrap gap-5'>
                      <Link
                        to={`/challenge/${challenge.challengeId}`}
                        className='flex-1 rounded-full bg-[var(--ft-primary)] px-6 py-3 text-center text-sm font-medium text-black transition-all duration-600 hover:bg-[var(--ft-btn-hover)] hover:text-white'
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/challenge/${challenge.challengeId}`}
                        className='flex-1 rounded-full border border-[var(--ft-primary)] bg-transparent px-6 py-3 text-center text-sm font-medium text-[var(--ft-primary)] transition-all duration-300 hover:text-[var(--ft-primary)]'
                      >
                        Join Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-[var(--ft-bg-black)] py-20 lg:py-32'>
        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='fade-in text-gradient text-4xl font-bold md:text-5xl lg:text-6xl'>
              Recent Winners & Submissions
            </h2>
          </div>

          <div className='grid gap-10 lg:grid-cols-2'>
            <div className='space-y-4'>
              {recentWinners.map((winner, index) => (
                <div
                  key={winner.id}
                  className='home-winner-card home-recent-winner-item mb-6 flex items-center justify-between rounded-2xl bg-[var(--ft-light)] p-6 backdrop-blur-sm last:mb-0'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(0,186,124,0.21)] bg-[rgba(0,186,124,0.21)]'>
                      <svg
                        className='h-8 w-8 text-gray-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className='text-lg font-bold text-white'>
                        {winner.name}
                      </h3>
                      <p className='text-sm text-white'>{winner.timeAgo}</p>
                    </div>
                  </div>

                  <div className='approved-badge flex items-center gap-2 rounded-full border border-[var(--ft-primary)] bg-[var(--ft-light)] px-5 py-3'>
                    <span className='text-sm font-medium text-white'>
                      Approved
                    </span>
                    <svg
                      className='h-4 w-4 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-6 rounded-2xl bg-[var(--ft-light)] p-8'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-2xl font-bold text-white'>
                  Top Submisssion
                </h3>
                <StrokeButton onClick={() => console.log('Join Now')}>
                  View All
                </StrokeButton>
              </div>

              <div className='space-y-4'>
                {topSubmissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className='home-submission-card rounded-2xl bg-[#000000] p-6 backdrop-blur-sm'
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className='mb-4 flex items-center gap-4'>
                      <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#0D1D18] text-lg font-bold text-white'>
                        {submission.badge}
                      </div>

                      <div className='flex-1'>
                        <h4 className='mb-1 text-lg font-bold text-white'>
                          {submission.title}
                        </h4>
                      </div>

                      <div className='text-lg font-bold text-emerald-400'>
                        {submission.score}
                      </div>
                    </div>

                    <div className='flex gap-5'>
                      {submission.github_url && (
                        <a
                          href={submission.github_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1'
                        >
                          <FillButton className='w-full'>
                            GitHub Link
                          </FillButton>
                        </a>
                      )}

                      {submission.demo_url && (
                        <a
                          href={submission.demo_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1'
                        >
                          <StrokeButton className='w-full'>
                            Live Demo
                          </StrokeButton>
                        </a>
                      )}
                      
                      {!submission.github_url && !submission.demo_url && (
                        <p className='text-sm text-gray-400'>No links available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
