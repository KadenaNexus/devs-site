'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { HomeLayout } from '../home-layout'

interface ProjectSubmissionFormData {
  developerName: string
  email: string
  bsceed: string
  telegram: string
  projectTitle: string
  problemStatement: string
  solutionDescription: string
  githubLink: string
  demoLink: string
  contractDetails: string
}

export function ProjectSubmission() {
  const [formData, setFormData] = useState<ProjectSubmissionFormData>({
    developerName: '',
    email: '',
    bsceed: '',
    telegram: '',
    projectTitle: '',
    problemStatement: '',
    solutionDescription: '',
    githubLink: '',
    demoLink: '',
    contractDetails: '',
  })

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <HomeLayout>
      <section className='serv-main other-bg relative'>
        <div className='serv-overlay overflow-hidden pt-16 pb-16'>
          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner w-full py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                Project Submission
              </h1>
            </div>
          </section>

          <section className='relative mt-16 overflow-hidden'>
            <div className='mx-auto max-w-[1296px] px-[15px]'>
              <div className='relative z-10'>
                <div className='rounded-3xl border-1 border-[var(--frontend-primary)] bg-[#1f413780] p-8 backdrop-blur-[4px] backdrop-blur-sm lg:p-12'>
                  <h2 className='mb-12 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl'>
                    SUBMIT YOUR <span className='text-emerald-400'>BUIDL</span>
                  </h2>

                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid gap-6 md:grid-cols-3'>
                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Developer/Team Name
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='developerName'
                            value={formData.developerName}
                            onChange={handleChange}
                            placeholder='Buidl Team Name'
                            className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 pl-14 text-white placeholder-gray-500 transition-colors focus:border-emerald-500 focus:outline-none'
                          />
                          <div className='absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-gradient-to-br from-gray-700 to-gray-600'>
                            <svg
                              className='h-4 w-4 text-gray-400'
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
                        </div>
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Email
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Bsceed
                        </label>
                        <input
                          type='text'
                          name='bsceed'
                          value={formData.bsceed}
                          onChange={handleChange}
                          className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Telegram
                        </label>
                        <input
                          type='text'
                          name='telegram'
                          value={formData.telegram}
                          onChange={handleChange}
                          className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Project Title
                        </label>
                        <input
                          type='text'
                          name='projectTitle'
                          value={formData.projectTitle}
                          onChange={handleChange}
                          className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Problem Statement
                        </label>
                        <textarea
                          name='problemStatement'
                          value={formData.problemStatement}
                          onChange={handleChange}
                          rows={4}
                          className='w-full resize-none rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Solution Description
                        </label>
                        <textarea
                          name='solutionDescription'
                          value={formData.solutionDescription}
                          onChange={handleChange}
                          rows={4}
                          className='w-full resize-none rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          GitHub Repository Link
                        </label>
                        <input
                          type='url'
                          name='githubLink'
                          value={formData.githubLink}
                          onChange={handleChange}
                          className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Demo Link
                        </label>
                        <input
                          type='url'
                          name='demoLink'
                          value={formData.demoLink}
                          onChange={handleChange}
                          className='w-full rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          Smart Contract / Medicine Details
                        </label>
                        <textarea
                          name='contractDetails'
                          value={formData.contractDetails}
                          onChange={handleChange}
                          rows={4}
                          className='w-full resize-none rounded-xl border border-emerald-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none'
                        />
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-gray-400'>
                          STATUS
                        </label>
                        <div className='mt-8 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4'>
                          <svg
                            className='h-6 w-6 text-emerald-400'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                          <span className='text-lg font-bold text-emerald-400'>
                            {isSubmitted ? 'SUBMITTED' : 'READY TO SUBMIT'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex justify-center pt-6'>
                      <button
                        type='submit'
                        className='transform rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-12 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-cyan-600'
                      >
                        CONFIRM SUBMISSION
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </HomeLayout>
  )
}
