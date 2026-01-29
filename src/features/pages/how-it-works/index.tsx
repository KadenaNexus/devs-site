'use client'

import { useState, useEffect } from 'react'
import { FiAward, FiArrowRight, FiCheck } from 'react-icons/fi'
import { FiCheckCircle, FiCode } from 'react-icons/fi'
import { GiStairsGoal } from 'react-icons/gi'
import { ImUpload } from 'react-icons/im'
import { HomeLayout } from '../home-layout'

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const processSteps = [
    {
      id: 1,
      step: '01',
      icon: <GiStairsGoal className='h-10 w-10' />,
      title: 'Pick a Real-World Challenge',
      description:
        'Browse our active challenges focused on real problems like P2P payments, fraud detection, supply chain tracking, or DeFi infrastructure. Choose one that matches your skills and interests.',
      details: [
        'Review challenge requirements and guidelines',
        'Understand the problem space and objectives',
        'Check prize pool, deadline, and judging criteria',
        'Join the challenge-specific Discord channel',
      ],
    },
    {
      id: 2,
      step: '02',
      icon: <FiCode className='h-10 w-10' />,
      title: 'Build an MVP on Kadena',
      description:
        'Develop your solution using Pact smart contracts. Focus on creating a working prototype that demonstrates real-world viability and production thinking.',
      details: [
        'Write secure Pact smart contracts',
        'Build your frontend with any framework (React, Vue, etc.)',
        'Test thoroughly on Kadena testnet',
        'Ensure code quality, security, and documentation',
      ],
    },
    {
      id: 3,
      step: '03',
      icon: <ImUpload className='h-10 w-10' />,
      title: 'Submit Code & Demo',
      description:
        'Upload your GitHub repository, deploy a live demo, and provide clear technical documentation explaining your approach and architecture.',
      details: [
        'Push complete code to public GitHub repository',
        'Deploy live demo (Vercel, Netlify, or similar)',
        'Write comprehensive README with setup instructions',
        'Record demo video showcasing features (optional)',
      ],
    },
    {
      id: 4,
      step: '04',
      icon: <FiCheckCircle className='h-10 w-10' />,
      title: 'Get Reviewed & Ranked',
      description:
        'Our expert judges evaluate submissions based on technical excellence, innovation, real-world viability, and documentation quality. All scores are transparent.',
      details: [
        'Automated initial screening for completeness',
        'Technical review by expert judges',
        'Live demo assessment and testing',
        'Final scoring published (out of 100 points)',
      ],
    },
    {
      id: 5,
      step: '05',
      icon: <FiAward className='h-10 w-10' />,
      title: 'Win Rewards & Recognition',
      description:
        'Winners receive cash prizes, public recognition on our platform, and potential opportunities for long-term collaboration or project funding.',
      details: [
        'Cash prizes distributed within 2 weeks',
        'Featured on platform homepage and social media',
        'Community recognition and builder reputation',
        'Potential partnerships and funding opportunities',
      ],
    },
  ]

  const quickStats = [
    { number: '$2000+', label: 'In Prizes', sublabel: 'Distributed Monthly' },
    { number: '100+', label: 'Builders', sublabel: 'Active Community' },
    { number: '24/7', label: 'Support', sublabel: 'Discord Community' },
    { number: '4+', label: 'Challenges', sublabel: 'Always Active' },
  ]

  const keyPoints = [
    {
      title: 'No Blockchain Experience Required',
      description:
        'If you can code, you can learn Kadena. Our community and documentation will help you get started.',
      icon: '🚀',
    },
    {
      title: 'Real Problems, Real Solutions',
      description:
        'Build production-ready MVPs that solve actual market needs, not toy demos or academic exercises.',
      icon: '💡',
    },
    {
      title: 'Fair & Transparent Judging',
      description:
        'Clear evaluation criteria, expert judges, and public scoring. No favoritism, no hidden agendas.',
      icon: '⚖️',
    },
    {
      title: 'Keep Your Code & Credit',
      description:
        'You retain full ownership and credit for your work. We just help you build and get recognized.',
      icon: '✅',
    },
    {
      title: 'Team Friendly',
      description:
        'Work solo or with a team of up to 5 people. Collaborate and split prizes as you decide.',
      icon: '👥',
    },
    {
      title: 'Beyond Just Prizes',
      description:
        'Top projects may become official Kadena MVPs with potential for funding and long-term partnerships.',
      icon: '🏆',
    },
  ]

  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-[var(--ft-dark)] pt-30 pb-16 lg:pt-32 lg:pb-20 border border-b-[var(--ft-light)]'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl'></div>
          <div className='absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl'></div>
        </div>
        <div className='relative z-10 mx-auto max-w-7xl px-6 text-center'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className='text-gradient mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
              How It Works
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl'>
              From challenge selection to winning prizes — your complete guide
              to building real-world Web3 solutions on Kadena.
            </p>
          </div>

          {/* Quick Stats */}
          <div
            className={`mt-16 transition-all delay-300 duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className='grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8'>
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className='stat-card rounded-2xl border border-green-900 bg-[#0b1f0b] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[var(--ft-primary)]'
                >
                  <h3 className='mb-1 text-3xl font-bold text-[var(--ft-primary)]'>
                    {stat.number}
                  </h3>
                  <p className='text-sm font-medium text-white'>{stat.label}</p>
                  <p className='text-xs text-[var(--ft-only-gray)]'>
                    {stat.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps - Timeline Design */}
      <section className='relative overflow-hidden bg-[var(--ft-dark-bg)] py-16 lg:py-20'>
        <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-gradient mb-4 text-4xl font-bold md:text-5xl'>
              Your Journey to Success
            </h2>
            <p className='text-lg text-[var(--ft-text-color)]'>
              Follow these 5 simple steps to build, submit, and win
            </p>
          </div>

          <div className='space-y-12'>
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className='animate-fadeInUp'
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className='feature-card group relative overflow-hidden rounded-3xl bg-[var(--ft-light)] p-8 lg:p-12'>
                  <div className='relative flex flex-col gap-8 lg:flex-row lg:items-start'>
                    {/* Icon Section */}
                    <div className='flex-shrink-0'>
                      <div className='relative'>
                        <div className='absolute inset-0 rounded-full bg-[var(--ft-primary)] opacity-20 blur-xl'></div>
                        <div className='relative flex h-20 w-20 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] lg:h-24 lg:w-24'>
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className='flex-1'>
                      <div className='mb-2 inline-block rounded-full bg-[var(--ft-primary)] px-4 py-1 text-sm font-bold text-black'>
                        Step {step.step}
                      </div>

                      <h3 className='mb-4 text-2xl font-bold text-white lg:text-3xl'>
                        {step.title}
                      </h3>

                      <p className='mb-6 text-base leading-relaxed text-[var(--ft-only-gray)] lg:text-lg'>
                        {step.description}
                      </p>

                      {/* Details List */}
                      <div className='grid gap-3 sm:grid-cols-2'>
                        {step.details.map((detail, idx) => (
                          <div key={idx} className='flex items-start gap-2'>
                            <FiCheck
                              className='mt-1 flex-shrink-0 text-[var(--ft-primary)]'
                              size={16}
                            />
                            <span className='text-sm text-[var(--ft-only-gray)]'>
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow to next step (hidden on last item) */}
                  {index < processSteps.length - 1 && (
                    <div className='mt-8 flex justify-center lg:hidden'>
                      <div className='step-arrow flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ft-dark-bg)] text-[var(--ft-primary)]'>
                        <FiArrowRight size={24} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why These Challenges Matter */}
      <section className='relative bg-[var(--ft-bg-black)] py-16 lg:py-20'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-16 text-center'>
            <h2 className='text-gradient mb-4 text-4xl font-bold md:text-5xl'>
              Why These Challenges Matter
            </h2>
            <p className='text-lg text-[var(--ft-text-color)]'>
              Real impact, fair opportunities, and meaningful recognition
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {keyPoints.map((point, index) => (
              <div
                key={index}
                className='animate-fadeInUp feature-card group rounded-2xl bg-[var(--ft-light)] p-8 text-center'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='mb-6 text-5xl'>{point.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {point.title}
                </h3>
                <p className='text-sm leading-relaxed text-[var(--ft-only-gray)]'>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative bg-[#1f7201] py-16 lg:py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
            Ready to Start Building?
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-only-gray)]'>
            Don't wait! Choose a challenge and start building your Kadena MVP
            today.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button className='cta-button rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'>
              Browse Active Challenges
            </button>
            <button className='cta-button rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black'>
              Join Discord Community
            </button>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className='relative bg-[var(--ft-bg-black)] py-16 lg:py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-[var(--ft-text-color)] md:text-4xl'>
            Need More Information?
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-text-color)]'>
            Check out our comprehensive FAQ or get in touch with our team
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button className='rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'>
              View FAQ
            </button>
            <button className='rounded-full border border-[var(--ft-btn-hover)] bg-transparent px-8 py-4 font-medium text-[var(--ft-btn-hover)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'>
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
