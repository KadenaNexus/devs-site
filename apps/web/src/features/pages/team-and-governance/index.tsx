'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTeamAndGovernancePage } from '@/services/strapi'
import { FiUsers, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi'
import { HomeLayout } from '../home-layout'

export function TeamGovernance() {
  const [isVisible, setIsVisible] = useState(false)

  const { data: page, isLoading } = useQuery({
    queryKey: ['team-and-governance'],
    queryFn: getTeamAndGovernancePage,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isLoading) return null
  if (!page) return null

  const mapSocialLinks = (links: any[] = []) => ({
    linkedin: links[0]?.link || '#',
    twitter: links[1]?.link || '#',
    github: links[2]?.link || '#',
  })

  const hero = page.hero
  const founder = {
    ...page.founder,
    social: mapSocialLinks(page.founder?.social_media),
  }

  const coreTeam = page.core_team.map((member: any) => ({
    ...member,
    social: mapSocialLinks(member.social_media),
  }))

  const join_our_team = page.join_our_team

  return (
    <HomeLayout>
      <section className='relative overflow-hidden border border-b-[var(--ft-light)] bg-[var(--ft-dark)] pt-30 pb-16 lg:pt-32 lg:pb-20'>
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
              {hero.heading}
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl'>
              {hero.subheading}
            </p>
          </div>
        </div>
      </section>

      <>
        <section className='relative bg-[var(--ft-dark-bg)] py-16 lg:py-20'>
          <div className='mx-auto max-w-7xl px-6'>
            <div className='mb-10 text-center'>
              <h2 className='text-gradient mb-4 text-4xl font-bold md:text-5xl'>
                {hero?.heading}
              </h2>
              <p className='text-[var(--ft-text-color)]'>{hero?.subheading}</p>
            </div>

            <div className='mx-auto max-w-4xl'>
              <div className='feature-card group rounded-3xl bg-[var(--ft-light)] p-8 lg:p-12'>
                <div className='flex flex-col items-center gap-8 lg:flex-row lg:items-start'>
                  <div className='relative flex-shrink-0'>
                    <div className='winner-image-glow absolute inset-0 rounded-full'></div>
                    <div className='relative h-48 w-48 overflow-hidden rounded-full border-4 border-[var(--ft-primary)]'>
                      <div className='flex h-full w-full items-center justify-center bg-[#071004]'>
                        <FiUsers className='h-14 w-14 text-[var(--ft-primary)]' />
                      </div>
                    </div>
                  </div>

                  <div className='flex-1 text-center lg:text-left'>
                    <h3 className='mb-2 text-3xl font-bold text-white'>
                      {founder.name}
                    </h3>
                    <p className='mb-4 text-xl text-[var(--ft-primary)]'>
                      {founder.designation}
                    </p>
                    <p className='mb-6 leading-relaxed text-[var(--ft-only-gray)]'>
                      {founder.bio}
                    </p>

                    <div className='flex justify-center gap-4 lg:justify-start'>
                      <a
                        href={founder.social_media.linkedin}
                        className='flex h-12 w-12 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'
                      >
                        <FiLinkedin size={20} />
                      </a>
                      <a
                        href={founder.social.twitter}
                        className='flex h-12 w-12 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'
                      >
                        <FiTwitter size={20} />
                      </a>
                      <a
                        href={founder.social.github}
                        className='flex h-12 w-12 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'
                      >
                        <FiGithub size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='relative bg-[var(--ft-bg-black)] py-20'>
          <div className='mx-auto max-w-7xl px-6'>
            <div className='mb-10 text-center'>
              <h2 className='text-gradient mb-4 text-4xl font-bold md:text-5xl'>
                Core Team
              </h2>
              <p className='text-[var(--ft-text-color)]'>
                Expert builders and operators scaling the platform
              </p>
            </div>

            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {coreTeam.map((member: any, index: any) => (
                <div
                  key={member.id}
                  className='animate-fadeInUp feature-card group rounded-2xl bg-[var(--ft-light)] p-6'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='mb-6 flex justify-center'>
                    <div className='relative'>
                      <div className='absolute inset-0 rounded-full bg-[var(--ft-primary)] opacity-20 blur-xl'></div>
                      <div className='relative h-32 w-32 overflow-hidden rounded-full border-2 border-[var(--ft-primary)]'>
                        <div className='flex h-full w-full items-center justify-center bg-[#071004]'>
                          <FiUsers className='h-14 w-14 text-[var(--ft-primary)]' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='text-center'>
                    <h3 className='mb-1 text-xl font-bold text-white'>
                      {member.name}
                    </h3>
                    <p className='mb-3 text-sm text-[var(--ft-primary)]'>
                      {member.designation}
                    </p>
                    <p className='mb-4 text-sm leading-relaxed text-[var(--ft-only-gray)]'>
                      {member.bio}
                    </p>

                    <div className='flex justify-center gap-3'>
                      <a
                        href={member.social.linkedin}
                        className='flex h-10 w-10 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'
                      >
                        <FiLinkedin size={16} />
                      </a>
                      <a
                        href={member.social.twitter}
                        className='flex h-10 w-10 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'
                      >
                        <FiTwitter size={16} />
                      </a>
                      <a
                        href={member.social.github}
                        className='flex h-10 w-10 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black'
                      >
                        <FiGithub size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>

      <section className='relative bg-[#1f7201] py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
            {join_our_team.heading}
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-only-gray)]'>
            {join_our_team.subheading}
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <a
              href={join_our_team.primaryCtaLink}
              className='rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'
            >
              {join_our_team.primaryCtaText}
            </a>
            <a
              href={join_our_team.secondaryCtaLink}
              className='rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black'
            >
              {join_our_team.secondaryCtaText}
            </a>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
