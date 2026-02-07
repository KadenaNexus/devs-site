'use client'

import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchChallenge } from '@/services/challenges'
import {
  FiFileText,
  FiShield,
  FiCalendar,
  FiAward,
  FiBarChart2,
  FiClock,
  FiTag,
  FiDollarSign,
  FiExternalLink,
  FiArrowLeft,
} from 'react-icons/fi'
import { format } from 'date-fns'
import FillButton from '../components/FillButton'
import { HomeLayout } from '../home-layout'
import { calculateTimeRemaining } from '@/utils/timeCalculations'

export function ChallengeDetailsPage() {
  const { challengeId } = useParams({ from: '/(pages)/challenge/$challengeId' })
  const [activeTab, setActiveTab] = useState('description')

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: () => fetchChallenge(challengeId),
  })

  const tabs = [
    { id: 'description', label: 'DESCRIPTION', icon: <FiFileText /> },
    { id: 'rules', label: 'RULES', icon: <FiShield /> },
    { id: 'evaluation', label: 'EVALUATION', icon: <FiBarChart2 /> },
  ]

  if (isLoading) {
    return (
      <HomeLayout>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--ft-primary)] border-t-transparent'></div>
            <p className='text-white'>Loading challenge...</p>
          </div>
        </div>
      </HomeLayout>
    )
  }

  if (!challenge) {
    return (
      <HomeLayout>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold text-white'>
              Challenge Not Found
            </h2>
            <Link
              to='/homepage'
              className='text-[var(--ft-primary)] hover:underline'
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </HomeLayout>
    )
  }

  const timeRemaining = challenge.timeline
    ? calculateTimeRemaining(challenge.timeline)
    : null
  const formattedTimeline = challenge.timeline
    ? format(new Date(challenge.timeline), 'MMM dd, yyyy HH:mm')
    : 'TBA'

  return (
    <HomeLayout>
      <section className='serv-main other-bg relative'>
        <div className='serv-overlay overflow-hidden pb-16 pt-30'>
          {/* Hero Section */}
          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner w-full bg-[var(--ft-light)] py-15 text-center'>
              <Link
                to='/homepage'
                className='mb-4 inline-flex items-center gap-2 text-[var(--ft-primary)] transition-all hover:gap-3'
              >
                <FiArrowLeft />
                <span className='text-sm font-medium'>Back to Homepage</span>
              </Link>
              <h1 className='text-gradient mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl'>
                {challenge.title}
              </h1>
              
              {/* Status and Category Badges */}
              <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
                {challenge.category && (
                  <div className='flex items-center gap-2 rounded-full border border-[var(--ft-primary)] bg-[var(--ft-primary)]/10 px-4 py-2'>
                    <FiTag className='text-[var(--ft-primary)]' />
                    <span className='text-sm font-medium text-[var(--ft-primary)]'>
                      {challenge.category}
                    </span>
                  </div>
                )}
                
                <div className='flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-500/10 px-4 py-2'>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      challenge.status === 'open'
                        ? 'bg-emerald-500'
                        : challenge.status === 'closed'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  ></span>
                  <span className='text-sm font-medium capitalize text-white'>
                    {challenge.status}
                  </span>
                </div>

                {timeRemaining && (
                  <div className='flex items-center gap-2 rounded-full border border-[var(--ft-primary)] bg-[var(--ft-primary)]/10 px-4 py-2'>
                    <FiClock className='text-[var(--ft-primary)]' />
                    <span className='text-sm font-medium text-[var(--ft-primary)]'>
                      {timeRemaining}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className='relative mx-auto mt-18 max-w-[1296px] px-3.75'>
            {/* Prize Pool Highlight */}
            {challenge.prize_pool && (
              <div className='mb-10 rounded-3xl border border-[var(--ft-primary)] bg-gradient-to-r from-[var(--ft-primary)]/10 to-emerald-500/10 p-8 text-center backdrop-blur-sm'>
                <div className='mb-2 flex items-center justify-center gap-2 text-[var(--ft-primary)]'>
                  <FiDollarSign className='text-2xl' />
                  <span className='text-sm font-medium uppercase tracking-wider'>
                    Total Prize Pool
                  </span>
                </div>
                <p className='text-5xl font-bold text-white md:text-6xl'>
                  {challenge.prize_pool}
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className='mb-10'>
              <div className='flex flex-wrap gap-4'>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition ${
                      activeTab === tab.id
                        ? 'border border-[var(--ft-primary)] bg-[#071004] text-[var(--ft-primary)]'
                        : 'border border-[#1f4512] bg-[#1f4512] text-white/70 hover:text-white'
                    }`}
                  >
                    <span className='text-lg'>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
              {/* Main Content - 2 columns */}
              <div className='space-y-6 lg:col-span-2'>
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div className='rounded-3xl border border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] p-6 backdrop-blur-[4px]'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                        <FiFileText />
                      </div>
                      <h2 className='text-xl font-bold text-white'>
                        DESCRIPTION
                      </h2>
                    </div>
                    <div className='prose prose-invert max-w-none'>
                      <p className='whitespace-pre-wrap text-sm leading-relaxed text-gray-300'>
                        {challenge.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rules Tab */}
                {activeTab === 'rules' && (
                  <div className='rounded-3xl border border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] p-6 backdrop-blur-[4px]'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                        <FiShield />
                      </div>
                      <h2 className='text-xl font-bold text-white'>RULES</h2>
                    </div>
                    <div className='prose prose-invert max-w-none'>
                      <p className='whitespace-pre-wrap text-sm leading-relaxed text-gray-300'>
                        {challenge.rules || 'No rules specified.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Evaluation Criteria Tab */}
                {activeTab === 'evaluation' && (
                  <div className='rounded-3xl border border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] p-6 backdrop-blur-[4px]'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                        <FiBarChart2 />
                      </div>
                      <h2 className='text-xl font-bold text-white'>
                        EVALUATION CRITERIA
                      </h2>
                    </div>
                    <div className='prose prose-invert max-w-none'>
                      <p className='whitespace-pre-wrap text-sm leading-relaxed text-gray-300'>
                        {challenge.evaluation_criteria ||
                          'No evaluation criteria specified.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 1 column */}
              <div className='space-y-6'>
                {/* Timeline Info */}
                {challenge.timeline && (
                  <div className='rounded-3xl border border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] p-6 backdrop-blur-[4px]'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                        <FiCalendar />
                      </div>
                      <h2 className='text-xl font-bold text-white'>TIMELINE</h2>
                    </div>
                    <div className='space-y-3'>
                      <div className='rounded-xl border border-[#071004] bg-[#071004] p-4'>
                        <span className='mb-2 block text-xs text-gray-400'>
                          Publish Date
                        </span>
                        <span className='font-medium text-white'>
                          {formattedTimeline}
                        </span>
                      </div>
                      {timeRemaining && (
                        <div className='rounded-xl bg-gradient-to-r from-[var(--ft-primary)]/20 to-emerald-500/20 p-4'>
                          <span className='mb-2 block text-xs text-gray-400'>
                            Time Remaining
                          </span>
                          <span className='text-2xl font-bold text-[var(--ft-primary)]'>
                            {timeRemaining}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Prize Pool Card */}
                {challenge.prize_pool && (
                  <div className='rounded-3xl border border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] p-6 backdrop-blur-[4px]'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                        <FiAward />
                      </div>
                      <h2 className='text-xl font-bold text-white'>
                        PRIZE POOL
                      </h2>
                    </div>
                    <div className='rounded-xl bg-[#071004] p-4 text-center'>
                      <span className='block text-3xl font-bold text-[var(--ft-primary)]'>
                        {challenge.prize_pool}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sponsor Link */}
                {challenge.sponsor_link && (
                  <div className='rounded-3xl border border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] p-6 backdrop-blur-[4px]'>
                    <a
                      href={challenge.sponsor_link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-between gap-3 rounded-xl border border-[var(--ft-primary)] bg-[#071004] p-4 transition hover:bg-[var(--ft-primary)]/10'
                    >
                      <span className='font-medium text-white'>
                        View Sponsor
                      </span>
                      <FiExternalLink className='text-[var(--ft-primary)]' />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Image */}
            {challenge.image_url && (
              <div className='mt-8 overflow-hidden rounded-3xl border border-[var(--ft-primary)]'>
                <img
                  src={challenge.image_url}
                  alt={challenge.title}
                  className='h-auto w-full object-cover'
                />
              </div>
            )}

            {/* CTA Button */}
            <div className='mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
              <FillButton className='px-12 py-4 text-lg font-bold'>
                SUBMIT PROJECT
              </FillButton>
              <Link
                to='/homepage'
                className='rounded-full border-2 border-[var(--ft-primary)] bg-transparent px-12 py-4 text-lg font-bold text-[var(--ft-primary)] transition hover:bg-[var(--ft-primary)]/10'
              >
                VIEW ALL CHALLENGES
              </Link>
            </div>
          </section>
        </div>
      </section>
    </HomeLayout>
  )
}
