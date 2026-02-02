'use client'

import { useState, ChangeEvent } from 'react'
import {
  PersonIcon,
  EnvelopeClosedIcon,
  DiscordLogoIcon,
  CodeIcon,
  VideoIcon,
  FileTextIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons'
import FillButton from '../components/FillButton'
import StrokeButton from '../components/StrokeButton'
import { HomeLayout } from '../home-layout'

interface ProjectSubmissionFormData {
  developerName: string
  email: string
  discord: string
  telegram: string
  projectTitle: string
  problemStatement: string
  solutionDescription: string
  githubLink: string
  demoLink: string
  contractDetails: string
}

interface FormErrors {
  [key: string]: string
}

export function ProjectSubmission() {
  const [formData, setFormData] = useState<ProjectSubmissionFormData>({
    developerName: '',
    email: '',
    discord: '',
    telegram: '',
    projectTitle: '',
    problemStatement: '',
    solutionDescription: '',
    githubLink: '',
    demoLink: '',
    contractDetails: '',
  })

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'developerName':
        return value.trim() === '' ? 'Developer/Team name is required' : ''
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value)
          ? 'Please enter a valid email address'
          : ''
      case 'discord':
        return value.trim() === '' ? 'Discord username is required' : ''
      case 'projectTitle':
        return value.trim() === '' ? 'Project title is required' : ''
      case 'problemStatement':
        return value.trim().length < 20
          ? 'Please provide at least 20 characters'
          : ''
      case 'solutionDescription':
        return value.trim().length < 20
          ? 'Please provide at least 20 characters'
          : ''
      case 'githubLink':
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+/
        return value.trim() !== '' && !githubRegex.test(value)
          ? 'Please enter a valid GitHub URL'
          : ''
      case 'demoLink':
        const urlRegex = /^https?:\/\/.+/
        return value.trim() !== '' && !urlRegex.test(value)
          ? 'Please enter a valid URL'
          : ''
      default:
        return ''
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(
      name,
      formData[name as keyof ProjectSubmissionFormData]
    )
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const isFormValid = (): boolean => {
    const requiredFields: (keyof ProjectSubmissionFormData)[] = [
      'developerName',
      'email',
      'discord',
      'projectTitle',
      'problemStatement',
      'solutionDescription',
    ]

    return requiredFields.every((field) => {
      const value = formData[field]
      return value.trim() !== '' && validateField(field, value) === ''
    })
  }

  const handleSubmit = () => {
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {}
    )
    setTouched(allTouched)

    const newErrors: FormErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key,
        formData[key as keyof ProjectSubmissionFormData]
      )
      if (error) newErrors[key] = error
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && isFormValid()) {
      setIsSubmitted(true)
      console.log('Form submitted:', formData)
    }
  }

  return (
    <HomeLayout>
      <div className='serv-main other-bg relative'>
        <section className='serv-overlay overflow-hidden pt-30 pb-16'>
          <div className='absolute inset-0 via-transparent to-transparent'></div>

          <section className='relative z-10 mx-auto flex max-w-[1296px] px-3.75'>
            <div className='serv-banner w-full bg-[var(--ft-light)] py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                Project Submission
              </h1>
            </div>
          </section>

          <section className='relative mt-16 overflow-hidden'>
            <div className='mx-auto max-w-[1296px] px-[15px]'>
              <div className='relative z-10'>
                <div className='form-main rounded-3xl border-1 border-[var(--ft-primary)] bg-[var(--ft-light)] p-8 shadow-2xl backdrop-blur-[4px] backdrop-blur-md lg:p-12'>
                  <div className='flex justify-center'>
                    <h2 className='text-gradient mb-12 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl lg:text-5xl'>
                      SUBMIT YOUR BUILD
                    </h2>
                  </div>

                  <div className='space-y-6'>
                    <div className='grid gap-6 md:grid-cols-3'>
                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Developer/Team Name{' '}
                          <span className='text-red-400'>*</span>
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='developerName'
                            value={formData.developerName}
                            onChange={handleChange}
                            onBlur={() => handleBlur('developerName')}
                            placeholder='Developer/Team Name'
                            className={`w-full rounded-xl border ${
                              errors.developerName && touched.developerName
                                ? 'border-red-500/50'
                                : 'border-[var(--ft-primary)]'
                            } bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <PersonIcon className='h-5 w-5 text-[var(--ft-primary)]' />
                          </div>
                        </div>
                        {errors.developerName && touched.developerName && (
                          <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                            <ExclamationTriangleIcon className='h-3 w-3' />
                            {errors.developerName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Email <span className='text-red-400'>*</span>
                        </label>
                        <div className='relative'>
                          <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            placeholder='your@email.com'
                            className={`w-full rounded-xl border ${
                              errors.email && touched.email
                                ? 'border-red-500/50'
                                : 'border-[var(--ft-primary)]'
                            } bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <EnvelopeClosedIcon className='h-5 w-5 text-[var(--ft-primary)]' />
                          </div>
                        </div>
                        {errors.email && touched.email && (
                          <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                            <ExclamationTriangleIcon className='h-3 w-3' />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Discord <span className='text-red-400'>*</span>
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='discord'
                            value={formData.discord}
                            onChange={handleChange}
                            onBlur={() => handleBlur('discord')}
                            placeholder='username#0000'
                            className={`w-full rounded-xl border ${
                              errors.discord && touched.discord
                                ? 'border-red-500/50'
                                : 'border-[var(--ft-primary)]'
                            } bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <DiscordLogoIcon className='h-5 w-5 text-[var(--ft-primary)]' />
                          </div>
                        </div>
                        {errors.discord && touched.discord && (
                          <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                            <ExclamationTriangleIcon className='h-3 w-3' />
                            {errors.discord}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Telegram
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='telegram'
                            value={formData.telegram}
                            onChange={handleChange}
                            placeholder='@username'
                            className='w-full rounded-xl border border-[var(--ft-primary)] bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none'
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <svg
                              className='h-5 w-5 text-[var(--ft-primary)]'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.305.02.469z' />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Project Title <span className='text-red-400'>*</span>
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='projectTitle'
                            value={formData.projectTitle}
                            onChange={handleChange}
                            onBlur={() => handleBlur('projectTitle')}
                            placeholder='Your Project Name'
                            className={`w-full rounded-xl border ${
                              errors.projectTitle && touched.projectTitle
                                ? 'border-red-500/50'
                                : 'border-[var(--ft-primary)]'
                            } bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <FileTextIcon className='h-5 w-5 text-[var(--ft-primary)]' />
                          </div>
                        </div>
                        {errors.projectTitle && touched.projectTitle && (
                          <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                            <ExclamationTriangleIcon className='h-3 w-3' />
                            {errors.projectTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Problem Statement{' '}
                          <span className='text-red-400'>*</span>
                        </label>
                        <textarea
                          name='problemStatement'
                          value={formData.problemStatement}
                          onChange={handleChange}
                          onBlur={() => handleBlur('problemStatement')}
                          placeholder='Describe the problem your project solves...'
                          rows={4}
                          className={`w-full resize-none rounded-xl border ${
                            errors.problemStatement && touched.problemStatement
                              ? 'border-red-500/50'
                              : 'border-[var(--ft-primary)]'
                          } bg-gray-900/50 px-4 py-3 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                        />
                        {errors.problemStatement &&
                          touched.problemStatement && (
                            <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                              <ExclamationTriangleIcon className='h-3 w-3' />
                              {errors.problemStatement}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Solution Description{' '}
                          <span className='text-red-400'>*</span>
                        </label>
                        <textarea
                          name='solutionDescription'
                          value={formData.solutionDescription}
                          onChange={handleChange}
                          onBlur={() => handleBlur('solutionDescription')}
                          placeholder='Describe how your project solves the problem...'
                          rows={4}
                          className={`w-full resize-none rounded-xl border ${
                            errors.solutionDescription &&
                            touched.solutionDescription
                              ? 'border-red-500/50'
                              : 'border-[var(--ft-primary)]'
                          } bg-gray-900/50 px-4 py-3 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                        />
                        {errors.solutionDescription &&
                          touched.solutionDescription && (
                            <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                              <ExclamationTriangleIcon className='h-3 w-3' />
                              {errors.solutionDescription}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          GitHub Repository Link
                        </label>
                        <div className='relative'>
                          <input
                            type='url'
                            name='githubLink'
                            value={formData.githubLink}
                            onChange={handleChange}
                            onBlur={() => handleBlur('githubLink')}
                            placeholder='https://github.com/username/repo'
                            className={`w-full rounded-xl border ${
                              errors.githubLink && touched.githubLink
                                ? 'border-red-500/50'
                                : 'border-[var(--ft-primary)]'
                            } bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <CodeIcon className='h-5 w-5 text-[var(--ft-primary)]' />
                          </div>
                        </div>
                        {errors.githubLink && touched.githubLink && (
                          <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                            <ExclamationTriangleIcon className='h-3 w-3' />
                            {errors.githubLink}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Demo Link
                        </label>
                        <div className='relative'>
                          <input
                            type='url'
                            name='demoLink'
                            value={formData.demoLink}
                            onChange={handleChange}
                            onBlur={() => handleBlur('demoLink')}
                            placeholder='https://your-demo-link.com'
                            className={`w-full rounded-xl border ${
                              errors.demoLink && touched.demoLink
                                ? 'border-red-500/50'
                                : 'border-[var(--ft-primary)]'
                            } bg-gray-900/50 px-4 py-3 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none`}
                          />
                          <div className='absolute top-1/2 left-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center'>
                            <VideoIcon className='h-5 w-5 text-[var(--ft-primary)]' />
                          </div>
                        </div>
                        {errors.demoLink && touched.demoLink && (
                          <p className='mt-1 flex items-center gap-1 text-xs text-red-400'>
                            <ExclamationTriangleIcon className='h-3 w-3' />
                            {errors.demoLink}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          Smart Contract / Medicine Details
                        </label>
                        <textarea
                          name='contractDetails'
                          value={formData.contractDetails}
                          onChange={handleChange}
                          placeholder='Provide smart contract addresses or medicine details...'
                          rows={4}
                          className='w-full resize-none rounded-xl border border-[var(--ft-primary)] bg-gray-900/50 px-4 py-3 text-white placeholder-[var(--ft-only-gray)] transition-colors focus:border-[var(--ft-primary)] focus:outline-none'
                        />
                      </div>

                      <div>
                        <label className='mb-2 block text-sm text-[var(--ft-only-gray)]'>
                          STATUS
                        </label>
                        <div
                          className={`mt-8 flex items-center gap-3 rounded-xl border px-6 py-4 transition-all ${
                            isSubmitted
                              ? 'border-[var(--ft-primary)] bg-emerald-500/10'
                              : isFormValid()
                                ? 'border-blue-500/30 bg-blue-500/10'
                                : 'border-gray-500/30 bg-gray-500/10'
                          }`}
                        >
                          {isSubmitted ? (
                            <>
                              <CheckCircledIcon className='h-6 w-6 text-[var(--ft-primary)]' />
                              <span className='text-lg font-bold text-[var(--ft-primary)]'>
                                SUBMITTED
                              </span>
                            </>
                          ) : isFormValid() ? (
                            <>
                              <CheckCircledIcon className='h-6 w-6 text-blue-400' />
                              <span className='text-lg font-bold text-blue-400'>
                                READY TO SUBMIT
                              </span>
                            </>
                          ) : (
                            <>
                              <CrossCircledIcon className='h-6 w-6 text-[var(--ft-only-gray)]' />
                              <span className='text-lg font-bold text-[var(--ft-only-gray)]'>
                                INCOMPLETE
                              </span>
                            </>
                          )}
                        </div>
                        {!isFormValid() && !isSubmitted && (
                          <p className='mt-2 text-xs text-[var(--ft-only-gray)]'>
                            Fill all required fields (*) to enable submission
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='flex justify-center pt-6'>
                      <button
                        onClick={handleSubmit}
                        disabled={!isFormValid() || isSubmitted}
                        className={`transform rounded-full px-12 py-4 text-lg font-bold text-black transition-all duration-300 ${
                          isFormValid() && !isSubmitted
                            ? 'cursor-pointer bg-[var(--ft-primary)] shadow-lg hover:scale-105 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-[var(--ft-primary)]'
                            : 'cursor-not-allowed bg-gray-600 opacity-50'
                        }`}
                      >
                        {isSubmitted ? 'SUBMITTED ✓' : 'CONFIRM SUBMISSION'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </HomeLayout>
  )
}
