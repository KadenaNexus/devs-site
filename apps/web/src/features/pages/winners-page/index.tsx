'use client'

import { useState, useEffect } from 'react'
import { HomeLayout } from '../home-layout'

export function WinnersPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const topWinners = [
    {
      id: 1,
      place: '1ST PLACE:',
      project: 'PROJECT AEGIS',
      category: 'DEFI',
      prize: '$25k',
      image: '/images/user.jpg',
      borderColor: 'border-[#FFD700]',
      gradientFrom: 'from-[#FFD700]/20',
      gradientTo: 'to-[#FFA500]/5',
      glowColor: 'shadow-[0_0_30px_rgba(255,215,0,0.3)]',
    },
    {
      id: 2,
      place: '2ND PLACE:',
      project: 'NEBULA BRIDGE',
      category: 'CROSS-CHAIN',
      prize: '$15k',
      image: '/images/user.jpg',
      borderColor: 'border-[#C0C0C0]',
      gradientFrom: 'from-[#C0C0C0]/20',
      gradientTo: 'to-[#808080]/5',
      glowColor: 'shadow-[0_0_30px_rgba(192,192,192,0.3)]',
    },
    {
      id: 3,
      place: '3RD PLACE:',
      project: 'ECO-CHAIN',
      category: 'SUSTAINABLE',
      prize: '$10k',
      image: '/images/user.jpg',
      borderColor: 'border-[#CD7F32]',
      gradientFrom: 'from-[#CD7F32]/20',
      gradientTo: 'to-[#8B4513]/5',
      glowColor: 'shadow-[0_0_30px_rgba(205,127,50,0.3)]',
    },
  ]

  const approvedSubmissions = [
    {
      id: 1,
      title: 'Decentralised Identity',
      category: 'IDENTITY',
      image: '/images/user.jpg',
      author: 'Alex Chen',
    },
    {
      id: 2,
      title: 'Cross-Chain Bridge',
      category: 'CROSS-CHAIN',
      image: '/images/user.jpg',
      author: 'Sarah Kim',
    },
    {
      id: 3,
      title: 'Sustainable Blockchain',
      category: 'SUSTAINABLE',
      image: '/images/user.jpg',
      author: 'Mike Johnson',
    },
    {
      id: 4,
      title: 'NFT Marketplace',
      category: 'NFT',
      image: '/images/user.jpg',
      author: 'Emma Davis',
    },
    {
      id: 5,
      title: 'DeFi Aggregator',
      category: 'DEFI',
      image: '/images/user.jpg',
      author: 'James Wilson',
    },
    {
      id: 6,
      title: 'Gaming Protocol',
      category: 'GAMING',
      image: '/images/user.jpg',
      author: 'Lisa Brown',
    },
  ]

  return (
    <HomeLayout>
      <section className='winners-main other-bg relative'>
        <div className='serv-overlay overflow-hidden pt-30 pb-16'>
          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner w-full bg-[var(--ft-light)] py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                CELEBRATING OUR CHAMPIONS!
              </h1>
            </div>
          </section>

          <section className='py-12 lg:py-16'>
            <div className='mx-auto max-w-[1296px] px-[15px]'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {topWinners.map((winner, index) => (
                  <div
                    key={winner.id}
                    className={`winner-card rounded-[24px] border-2 ${winner.borderColor} backdrop-blur-md overflow-hidden ${winner.glowColor} animate-fadeInUp`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className='space-y-6 p-6'>
                      <div className='${winner.borderColor} relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4'>
                        <div className='winner-image-glow absolute inset-0'></div>
                        <img
                          src={winner.image}
                          alt={winner.project}
                          className='relative z-10 h-full w-full object-cover'
                        />
                      </div>

                      <div className='space-y-2 text-center'>
                        <p className='text-sm font-bold tracking-wider text-white/80'>
                          {winner.place}
                        </p>
                        <h3 className='text-2xl font-bold text-white'>
                          {winner.project}
                        </h3>
                        <p className='text-sm font-semibold text-[var(--ft-primary)]'>
                          {winner.category}
                        </p>
                        <p className='mt-4 text-3xl font-bold text-white'>
                          {winner.prize}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='py-12 pb-0 lg:py-16'>
            <div className='mx-auto max-w-[1296px] px-[15px]'>
              <h2 className='text-gradient animate-fadeIn mb-8 text-3xl font-bold md:text-4xl lg:text-5xl'>
                APPROVED SUBMISSIONS
              </h2>

              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {approvedSubmissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className='submission-card animate-fadeInUp overflow-hidden rounded-[20px] border border-[#0d1d18] bg-[var(--ft-serv-box-bg)] backdrop-blur-[4px] transition-all duration-500 hover:border-[var(--ft-primary)]'
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className='space-y-4 p-5'>
                      <div className='flex items-start gap-4'>
                        <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--ft-primary)]/50'>
                          <img
                            src={submission.image}
                            alt={submission.title}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='mb-1 truncate text-lg font-bold text-white'>
                            {submission.title}
                          </h3>
                          <p className='text-sm font-semibold text-[var(--ft-primary)]'>
                            {submission.category}
                          </p>
                        </div>
                      </div>

                      <div className='border-t border-[#5a5a5a] pt-2'>
                        <p className='mb-1 text-xs text-white/60'>Created by</p>
                        <p className='text-sm font-medium text-white'>
                          {submission.author}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </HomeLayout>
  )
}
