'use client'

import { useState, useEffect } from 'react'
import Counter from '../components/Counter'
import { HomeLayout } from '../home-layout'
import { createFileRoute, redirect } from '@tanstack/react-router'
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

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: '14', label: 'Years of', sublabel: 'Experience' },
    { number: '50+', label: 'Project', sublabel: 'Completed' },
    { number: '1.5K', label: 'Happy', sublabel: 'Clients' },
    { number: '14', label: 'Years of', sublabel: 'Experience' },
  ]

  const features = [
    {
      id: 1,
      icon: (
        <svg
          viewBox='0 0 64 64'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-full w-full'
        >
          <path
            d='M32 8L8 20V44L32 56L56 44V20L32 8Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M32 8V32M32 56V32M32 32L8 20M32 32L56 20M32 32L8 44M32 32L56 44'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
      title: 'Solve Challenges',
      description: 'Decentralize use-cases & challenge submissions.',
    },
    {
      id: 2,
      icon: (
        <svg
          viewBox='0 0 64 64'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-full w-full'
        >
          <rect
            x='12'
            y='12'
            width='14'
            height='14'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            transform='rotate(45 19 19)'
          />
          <rect
            x='32'
            y='12'
            width='14'
            height='14'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            transform='rotate(45 39 19)'
          />
          <rect
            x='12'
            y='32'
            width='14'
            height='14'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            transform='rotate(45 19 39)'
          />
          <rect
            x='32'
            y='32'
            width='14'
            height='14'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            transform='rotate(45 39 39)'
          />
        </svg>
      ),
      title: 'Submit Solutions',
      description: 'Submit smart contract and submit your work demos.',
    },
    {
      id: 3,
      icon: (
        <svg
          viewBox='0 0 64 64'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-full w-full'
        >
          <path
            d='M32 8L38 24H55L41 35L47 52L32 41L17 52L23 35L9 24H26L32 8Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M24 48L20 56H44L40 48'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20 56L18 60H46L44 56'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
      title: 'Win Rewards',
      description: 'Show your work, win rewards, and gain recognition.',
    },
  ]

  const challenges = [
    {
      id: 1,
      badge: 'DF',
      badgeColor: 'bg-emerald-500',
      title: 'DeFi Protocol Builder',
      description:
        'Build protocol builder, in protocol and contact anbmissions.',
      prizePool: '$300',
      timeLeft: '1d 2h Left',
    },
    {
      id: 2,
      badge: 'NF',
      badgeColor: 'bg-emerald-500',
      title: 'NFT Launchpad Creator',
      description:
        'Create launchpad accept and either okie with 1 and casuels and eNFT tde to laee for stuseeas.',
      prizePool: '$200',
      timeLeft: '1d 2h Left',
    },
    {
      id: 4,
      badge: 'DF',
      badgeColor: 'bg-emerald-500',
      title: 'DeFi Protocol Builder',
      description:
        'Build protocol builder, in protocol and contact anbmissions.',
      prizePool: '$300',
      timeLeft: '1d 2h Left',
    },
    {
      id: 5,
      badge: 'NF',
      badgeColor: 'bg-emerald-500',
      title: 'NFT Launchpad Creator',
      description:
        'Create launchpad accept and either okie with 1 and casuels and eNFT tde to laee for stuseeas.',
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
        <div className='relative z-10 mx-auto max-w-[1296px] items-center justify-center px-[15px]'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className='space-y-4'>
                <p className='text-[30px] font-semibold tracking-wider text-white'>
                  Web3
                </p>
                <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                  <span className='text-[var(--frontend-primary)]'>
                    Build the Future
                  </span>
                  <br />
                  <span className='text-white'>of Web3.</span>
                </h1>
                <p className='max-w-xl text-base leading-relaxed text-gray-300 md:text-lg'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className='flex flex-wrap gap-4'>
                <button className='btn-primary rounded-full border-2 border-[var(--frontend-primary)] bg-transparent px-8 py-3 font-medium text-[var(--frontend-primary)] transition-all duration-300 hover:bg-[var(--frontend-primary)] hover:text-slate-900'>
                  Get Started
                </button>
                <button className='btn-secondary rounded-full bg-[var(--frontend-primary)] px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-[var(--frontend-btn-hover)]'>
                  Start a Challenge
                </button>
              </div>
            </div>
            <div
              className={`relative transition-all delay-300 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
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
                  className='stat-card space-y-1 rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm'
                >
                  <h3 className='text-4xl font-bold text-white md:text-5xl'>
                    {isVisible && <Counter value={stat.number} />}
                  </h3>

                  <p className='text-sm font-medium text-gray-300'>
                    {stat.label}
                  </p>
                  <p className='text-sm text-gray-400'>{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='what-we-do-section relative overflow-hidden bg-black py-20 lg:py-32'>
        <div className='bg-gradient-radial absolute inset-0 from-emerald-900/5 via-transparent to-transparent'></div>

        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-16 text-center lg:mb-20'>
            <h2 className='fade-in text-gradient mb-4 text-4xl font-bold md:text-5xl lg:text-6xl'>
              How It Works
            </h2>
            <p className='fade-in-delay mx-auto max-w-2xl text-base text-gray-400 md:text-lg'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
          </div>

          <div className='resume-widget grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`feature-card group resume-item relative cursor-pointer rounded-3xl bg-[#0D1D18] p-8 text-center transition-all duration-500 lg:p-10`}
              >
                <div className='relative mb-8'>
                  <div
                    className={`mx-auto h-10 w-10 transition-all duration-500 lg:h-12 lg:w-12`}
                  >
                    {feature.icon}
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-2xl font-bold text-white transition-all duration-30 lg:text-3xl'>
                    {feature.title}
                  </h3>
                  <p className='text-sm leading-relaxed text-gray-400 transition-all duration-300 group-hover:text-gray-300 lg:text-base'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-[#0D1D18] py-20 lg:py-32'>
        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='fade-in text-gradient text-4xl font-bold md:text-5xl lg:text-6xl'>
              Upcomming Challenges
            </h2>
          </div>

          <div className='proj-grid mx-auto grid auto-rows-fr gap-10 md:grid-cols-2'>
            {challenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className='upcoming-card relative h-full'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='proj-main-box relative h-full rounded-[10px] bg-[#1F4136] p-9 pb-0'>
                  <div className='proj-inner-box relative flex h-full flex-col overflow-hidden bg-[#0D0D0D] p-9'>
                    <div className='mb-8 flex items-center justify-between'>
                      <div
                        className={`${challenge.badgeColor} badge-float rounded-lg px-4 py-4 text-xl font-bold text-white shadow-lg`}
                      >
                        {challenge.badge}
                      </div>

                      <div className='timer-pulse flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-4 py-2'>
                        <svg
                          className='h-4 w-4 text-emerald-400'
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
                        <span className='text-sm font-medium text-emerald-400'>
                          {challenge.timeLeft}
                        </span>
                      </div>
                    </div>

                    <div className='mb-6 flex-1 space-y-4'>
                      <h3 className='text-2xl font-bold text-white lg:text-3xl'>
                        {challenge.title}
                      </h3>

                      <p className='text-sm leading-relaxed text-gray-400'>
                        {challenge.description}
                      </p>

                      <div className='pt-2'>
                        <p className='mb-1 text-xs text-gray-500'>Prize pool</p>
                        <p className='text-3xl font-bold text-white'>
                          {challenge.prizePool}
                        </p>
                      </div>
                    </div>

                    <div className='proj-btn-box mt-auto flex flex-wrap gap-5'>
                      <button className='button-glow flex-1 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-600'>
                        View Details
                      </button>

                      <button className='flex-1 rounded-full border-1 border-white bg-transparent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-emerald-500 hover:text-emerald-400'>
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

      <section className='relative overflow-hidden bg-[#050709] py-20 lg:py-32'>
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
                  className="winner-card flex items-center justify-between rounded-2xl bg-[#0D1D18] p-6 backdrop-blur-sm mb-6 last:mb-0 recent-winner-item"
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

                  <div className='approved-badge flex items-center gap-2 rounded-full border border-[#00BA7C] bg-[rgba(0,186,124,0.21)] px-5 py-3'>
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

            <div className='space-y-6 bg-[#0D1D18] p-8 rounded-2xl'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-2xl font-bold text-white'>
                  Top Submisssion
                </h3>
                <button className='rounded-full border-1 border-emerald-500 bg-transparent px-6 py-2 text-sm font-medium text-emerald-400 transition-all duration-300 hover:bg-emerald-500 hover:text-white'>
                  View All
                </button>
              </div>

              <div className='space-y-4'>
                {topSubmissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className='submission-card rounded-2xl bg-[#0D0D0D] p-6 backdrop-blur-sm '
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
                      <button className='flex-1 rounded-full bg-[#00BA7C] px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-600'>
                        GitHub Link
                      </button>
                      <button className='flex-1 rounded-full border-1 border-[#00BA7C] bg-transparent px-6 py-2.5 text-sm font-medium text-emerald-400 transition-all duration-300 hover:bg-[#00BA7C] hover:text-white'>
                        Demo
                      </button>
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
