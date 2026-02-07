'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWinners, fetchApprovedSubmissions } from '@/services/submissions'
import { HomeLayout } from '../home-layout'

export function WinnersPage() {
  const [isVisible, setIsVisible] = useState(false)

  const { data: winnersData = [], isLoading: winnersLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: fetchWinners,
  })

  const { data: approvedData = [], isLoading: approvedLoading } = useQuery({
    queryKey: ['approved-submissions'],
    queryFn: fetchApprovedSubmissions,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Helper function to get styling based on rank
  const getRankStyling = (rank: number) => {
    const styles: Record<number, any> = {
      1: {
        borderColor: 'border-[#FFD700]',
        glowColor: 'shadow-[0_0_30px_rgba(255,215,0,0.3)]',
        place: '1ST PLACE:',
      },
      2: {
        borderColor: 'border-[#C0C0C0]',
        glowColor: 'shadow-[0_0_30px_rgba(192,192,192,0.3)]',
        place: '2ND PLACE:',
      },
      3: {
        borderColor: 'border-[#CD7F32]',
        glowColor: 'shadow-[0_0_30px_rgba(205,127,50,0.3)]',
        place: '3RD PLACE:',
      },
    }
    return (
      styles[rank] || {
        borderColor: 'border-[var(--ft-primary)]',
        glowColor: 'shadow-[0_0_20px_rgba(76,175,80,0.3)]',
        place: `${rank}TH PLACE:`,
      }
    )
  }

  // Get top 3 winners
  const topWinners = winnersData
    .filter((w: any) => w.rank <= 3)
    .sort((a: any, b: any) => a.rank - b.rank)
    .map((winner: any) => ({
      id: winner.id,
      rank: winner.rank,
      ...getRankStyling(winner.rank),
      project: winner.project_name || winner.title || 'Untitled Project',
      category: winner.challenges?.title || winner.category || 'General',
      prize: winner.prize_amount ? `$${winner.prize_amount}` : winner.challenges?.prize_pool || 'TBA',
      image: winner.profile_pic || '/images/user.jpg',
      author: winner.public_name || winner.user_name || 'Anonymous',
    }))

  const approvedSubmissions = approvedData.map((submission: any) => ({
    id: submission.id,
    title: submission.challenges?.title || 'Challenge Title N/A',
    category: submission.category || 'General',
    image: submission.profile_pic || '/images/user.jpg',
    author: submission.developer_name || submission.public_name || submission.user_name || 'Anonymous',
  }))

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
              {winnersLoading ? (
                <div className='py-12 text-center'>
                  <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--ft-primary)] border-t-transparent'></div>
                  <p className='text-lg text-gray-400'>Loading winners...</p>
                </div>
              ) : topWinners.length === 0 ? (
                <div className='py-12 text-center'>
                  <p className='text-lg text-gray-400'>No winners announced yet.</p>
                </div>
              ) : (
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
              )}
            </div>
          </section>

          <section className='py-12 pb-0 lg:py-16'>
            <div className='mx-auto max-w-[1296px] px-[15px]'>
              <h2 className='text-gradient animate-fadeIn mb-8 text-3xl font-bold md:text-4xl lg:text-5xl'>
                APPROVED SUBMISSIONS
              </h2>

              {approvedLoading ? (
                <div className='py-12 text-center'>
                  <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--ft-primary)] border-t-transparent'></div>
                  <p className='text-lg text-gray-400'>Loading submissions...</p>
                </div>
              ) : approvedSubmissions.length === 0 ? (
                <div className='py-12 text-center'>
                  <p className='text-lg text-gray-400'>No approved submissions yet.</p>
                </div>
              ) : (
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
              )}
            </div>
          </section>
        </div>
      </section>
    </HomeLayout>
  )
}
