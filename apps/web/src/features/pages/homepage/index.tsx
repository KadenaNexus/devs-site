'use client'

import { useState, useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { FiTarget, FiUpload, FiAward } from 'react-icons/fi'
import {
  FiCheckCircle,
  FiShield,
  FiLock,
  FiUserCheck,
  FiTrendingUp,
  FiCode,
} from 'react-icons/fi'
import { GiStairsGoal } from "react-icons/gi";
import { ImUpload } from "react-icons/im";

import Counter from '../components/Counter'
import FillButton from '../components/FillButton'
import StrokeButton from '../components/StrokeButton'
import { HomeLayout } from '../home-layout'
import { getHomePage } from '@/services/strapi'
import { useQuery } from '@tanstack/react-query'


export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth?.user) {
      throw redirect({ to: '/_authenticated' })
    }

    throw redirect({ to: '/homepage' })
  },
})

export function Homepage({ value }: { value: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    challenge1: { days: 1, hours: 21, minutes: 0 },
    challenge2: { days: 1, hours: 2, minutes: 0 },
  })

  const { data: page, isLoading } = useQuery({
    queryKey: ["home-page"],
    queryFn: getHomePage,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isLoading) return null;
  if (!page) return null;

  const hero = page.Hero;
const stats = page.statitems ?? [];
const solve = page.solve_section?.[0];

  

  // const stats = [
  //   { number: '4+', label: 'Active', sublabel: 'Challenges' },
  //   { number: '20', label: 'Chain', sublabel: 'Architecture' },
  //   { number: 'Real MVPs', label: 'Not', sublabel: 'Hackathons' },
  //   { number: 'Pact', label: '&', sublabel: 'Chainweb Focused' },
  // ]

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

  const challenges = [
    {
      id: 1,
      badge: 'P2P',
      badgeColor: 'bg-[var(--ft-primary)]',
      title: 'Kadena P2P Escrow Marketplace',
      description: '',
      prizePool: '$300',
      timeLeft: '1d 2h Left',
    },
    {
      id: 2,
      badge: 'KP',
      badgeColor: 'bg-[var(--ft-primary)]',
      title: 'Kadena Pay (Merchant Payments)',
      description: '',
      prizePool: '$200',
      timeLeft: '1d 2h Left',
    },
    {
      id: 3,
      badge: 'CCF',
      badgeColor: 'bg-[var(--ft-primary)]',
      title: 'Cross-Chain Fraud & Scam Tracking',
      description: '',
      prizePool: '$300',
      timeLeft: '1d 2h Left',
    },
    {
      id: 4,
      badge: 'SCT',
      badgeColor: 'bg-[var(--ft-primary)]',
      title: 'Supply Chain Tracking & Proof of Authenticity',
      description: '',
      prizePool: '$200',
      timeLeft: '1d 2h Left',
    },
  ]

  const recentWinners = [
    {
      id: 1,
      name: 'LIAM BENSON',
      timeAgo: '13 min ago',
      avatar: '/images/avatar1.jpg',
      approved: true,
    },
    {
      id: 2,
      name: 'SARA SUTTON',
      timeAgo: '23 min ago',
      avatar: '/images/avatar2.jpg',
      approved: true,
    },
    {
      id: 3,
      name: 'MARVIN WESLEY',
      timeAgo: '45 min ago',
      avatar: '/images/avatar3.jpg',
      approved: true,
    },
    {
      id: 4,
      name: 'ALLEN SINS',
      timeAgo: '1 hr ago',
      avatar: '/images/avatar4.jpg',
      approved: true,
    },
  ]

  const topSubmissions = [
    {
      id: 1,
      badge: 'W3',
      title: 'Web3 Wallet MVP By ChainGuru',
      score: '92/100',
    },
    {
      id: 2,
      badge: 'W3',
      title: 'Web3 Wallet MVP By ChainGuru',
      score: '92/100',
    },
  ]

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
                  Solve real problems using Pact smart contracts. <br />
                  Build production-ready MVPs. Get rewarded and recognized.
                </p>
              </div>

              <div className='flex flex-wrap gap-4'>
                <FillButton>Start a Challenge</FillButton>
                <StrokeButton>Explore Challenges</StrokeButton>
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
                src='/images/banner-right-img.png'
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
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='stat-card space-y-1 rounded-xl bg-[var(--ft-light)] p-6 text-center backdrop-blur-sm'
                >
                  <h3 className='text-3xl font-bold text-white md:text-3xl'>
                    {isVisible &&
                      (isNaN(parseFloat(stat.number)) ? (
                        stat.number
                      ) : (
                        <Counter value={stat.number} />
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
              Solve. Build. Win.
            </h2>
            <p className='mt-4 text-white'>
              Build real Kadena use-cases with production thinking.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                title: 'Solve Challenges',
                text: 'Build real Kadena use-cases designed for real-world deployment.',
                icon: <FiTarget size={36} />,
              },
              {
                title: 'Submit Solutions',
                text: 'Submit Pact smart contracts, demos, and technical documentation.',
                icon: <FiUpload size={36} />,
              },
              {
                title: 'Win Rewards',
                text: 'Earn prizes, visibility, and long-term project opportunities.',
                icon: <FiAward size={36} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className='rounded-2xl border border-green-900 bg-[#0b1f0b] p-8 text-center transition hover:border-green-500'
              >
                {/* Icon */}
                <div className='mb-4 flex justify-center text-[var(--ft-primary)]'>
                  {item.icon}
                </div>

                <h3 className='mb-3 text-xl font-semibold text-white'>
                  {item.title}
                </h3>
                <p className='text-sm leading-relaxed text-[var(--ft-only-gray)]'>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* MVP Badge */}
          <div className='mt-16 text-center'>
            <span className='inline-flex items-center gap-2 rounded-full border border-white bg-green-500/10 px-6 py-2 text-sm text-white'>
              ⭐ Top projects may become official Kadena MVPs
            </span>
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
                      <button className='flex-1 rounded-full bg-[var(--ft-primary)] px-6 py-3 text-sm font-medium text-black transition-all duration-600 hover:bg-[var(--ft-btn-hover)] hover:text-white'>
                        View Details
                      </button>

                      <button className='flex-1 rounded-full border border-[var(--ft-primary)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--ft-primary)] transition-all duration-300 hover:text-[var(--ft-primary)]'>
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative bg-[#1f7201] py-24'>
        <div className='mx-auto max-w-6xl px-6 text-center'>
          <h2 className='mb-16 text-center text-4xl font-bold text-green-400 text-white md:text-5xl'>
            Why These Challenges Matter
          </h2>

          <div className='grid gap-6 md:grid-cols-2'>
            {[
              {
                text: 'Real problems, not toy demos',
                icon: <FiCheckCircle />,
              },
              {
                text: 'Designed for production use',
                icon: <FiShield />,
              },
              {
                text: 'No KYC, no gatekeeping',
                icon: <FiLock />,
              },
              {
                text: 'Builders keep credit for their work',
                icon: <FiUserCheck />,
              },
              {
                text: 'Potential revenue-sharing projects',
                icon: <FiTrendingUp />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className='flex items-center rounded-xl border border-green-900 bg-[#081a08] px-6 py-5 text-[var(--ft-only-gray)]'
              >
                <span className='mr-3 text-xl text-[var(--ft-primary)]'>{item.icon}</span>
                {item.text}
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
                      <FillButton onClick={() => console.log('View Details')}>
                        GitHub Link
                      </FillButton>

                      <StrokeButton onClick={() => console.log('Join Now')}>
                        Demo
                      </StrokeButton>
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
