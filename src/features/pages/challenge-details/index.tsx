'use client'

import { useState } from 'react'
import {
  FiFileText,
  FiShield,
  FiCalendar,
  FiAward,
  FiBarChart2,
} from 'react-icons/fi'
import FillButton from '../components/FillButton'
import { HomeLayout } from '../home-layout'

export function ChallengeDetails() {
  const [activeTab, setActiveTab] = useState('description')

  const tabs = [
    { id: 'description', label: 'DESCRIPTION', icon: <FiFileText /> },
    { id: 'rules', label: 'RULES', icon: <FiShield /> },
    { id: 'timeline', label: 'TIMELINE', icon: <FiCalendar /> },
  ]

  const timeline = [
    { phase: 'Registration Date', date: '01/05/25' },
    { phase: 'Submission Deadline', date: '01/20/25' },
    { phase: 'Judging', date: '01/25/25' },
    { phase: 'Winners Announcement', date: '02/01/25' },
  ]

  const prizeDistribution = [
    { place: '1st', amount: '$25k' },
    { place: '2nd', amount: '$10k' },
    { place: '3rd', amount: '$5k' },
  ]

  const evaluationCriteria = [
    { name: 'Creativity', percentage: 40 },
    { name: 'Innovation', percentage: 30 },
    { name: 'Execution', percentage: 20 },
    { name: 'Code Quality', percentage: 10 },
  ]

  return (
    <HomeLayout>
      <section className='serv-main other-bg relative'>
        <div className='serv-overlay overflow-hidden pt-30 pb-16'>
          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner w-full bg-[var(--ft-light)] py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                Challenge Details
              </h1>
            </div>
          </section>
          <section className='relative mx-auto max-w-[1296px] px-3.75 mt-18'>
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

            <div className='grid gap-6 lg:grid-cols-2'>
              <div className='space-y-6'>
                {(activeTab === 'description' ||
                  activeTab === 'rules' ||
                  activeTab === 'timeline') && (
                  <div className='rounded-3xl border-1 border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] backdrop-blur-[4px] p-6'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                        {tabs.find((t) => t.id === activeTab)?.icon}
                      </div>
                      <h2 className='text-xl font-bold text-white'>
                        {activeTab.toUpperCase()}
                      </h2>
                    </div>

                    {activeTab === 'timeline' ? (
                      <div className='space-y-3'>
                        {timeline.map((item, i) => (
                          <div
                            key={i}
                            className='flex items-center justify-between rounded-xl border border-[#071004] bg-[#071004] p-4'
                          >
                            <span className='text-white'>{item.phase}</span>
                            <span className='rounded-full bg-[var(--ft-primary)]/20 px-4 py-1 text-xs font-bold text-[var(--ft-primary)]'>
                              {item.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm leading-relaxed text-gray-300'>
                        This challenge focuses on building decentralized
                        identity systems that are secure, privacy-preserving,
                        and usable in real-world production environments.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className='space-y-6'>
                <div className='rounded-3xl border-1 border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] backdrop-blur-[4px] p-6'>
                  <div className='mb-6 flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                      <FiAward />
                    </div>
                    <h2 className='text-xl font-bold text-white'>PRIZE POOL</h2>
                  </div>

                  <div className='space-y-3'>
                    {prizeDistribution.map((prize, i) => (
                      <div
                        key={i}
                        className='flex items-center justify-between rounded-xl bg-[#071004] p-4'
                      >
                        <span className='font-bold text-white'>
                          {prize.place}
                        </span>
                        <span className='text-[var(--ft-primary)]'>
                          {prize.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-3xl border-1 border-[var(--ft-primary)] bg-[var(--ft-serv-box-bg)] backdrop-blur-[4px] p-6 mt-8'>
              <div className='mb-6 flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ft-primary)]/20 text-[var(--ft-primary)]'>
                  <FiBarChart2 />
                </div>
                <h2 className='text-xl font-bold text-white'>
                  EVALUATION CRITERIA
                </h2>
              </div>

              <div className='space-y-4'>
                {evaluationCriteria.map((c, i) => (
                  <div key={i}>
                    <div className='mb-1 flex justify-between text-sm'>
                      <span className='text-white'>{c.name}</span>
                      <span className='text-[var(--ft-primary)]'>
                        {c.percentage}%
                      </span>
                    </div>
                    <div className='h-2 rounded-full bg-[#071004]'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-[var(--ft-primary)] to-emerald-400'
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-14 flex justify-center'>
              <FillButton className='px-12 py-4 text-lg font-bold'>
                SUBMIT PROJECT
              </FillButton>
            </div>
          </section>
        </div>
      </section>
    </HomeLayout>
  )
}
