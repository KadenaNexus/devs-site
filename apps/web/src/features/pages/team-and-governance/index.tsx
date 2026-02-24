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
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--ft-light)] bg-[var(--ft-dark)] pt-24 pb-14 lg:pt-32 lg:pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-gradient mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-words">
              {hero.heading}
            </h1>
            <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-[var(--ft-text-color)]">
              {hero.subheading}
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="bg-[var(--ft-dark-bg)] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-gradient mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
              {hero.heading}
            </h2>
            <p className="text-[var(--ft-text-color)]">{hero.subheading}</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="feature-card rounded-3xl bg-[var(--ft-light)] p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="winner-image-glow absolute inset-0 rounded-full"></div>
                  <div className="relative h-36 w-36 sm:h-44 sm:w-44 lg:h-48 lg:w-48 overflow-hidden rounded-full border-4 border-[var(--ft-primary)]">
                    <div className="flex h-full w-full items-center justify-center bg-[#071004]">
                      <FiUsers className="h-12 w-12 sm:h-14 sm:w-14 text-[var(--ft-primary)]" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="mb-2 text-2xl sm:text-3xl font-bold text-white break-words">
                    {founder.name}
                  </h3>
                  <p className="mb-4 text-lg sm:text-xl text-[var(--ft-primary)]">
                    {founder.designation}
                  </p>
                  <p className="mb-6 leading-relaxed text-[var(--ft-only-gray)]">
                    {founder.bio}
                  </p>

                  <div className="flex justify-center lg:justify-start gap-4 flex-wrap">
                    <a href={founder.social.linkedin} className="social-btn">
                      <FiLinkedin size={20} />
                    </a>
                    <a href={founder.social.twitter} className="social-btn">
                      <FiTwitter size={20} />
                    </a>
                    <a href={founder.social.github} className="social-btn">
                      <FiGithub size={20} />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="bg-[var(--ft-bg-black)] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-gradient mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
              Core Team
            </h2>
            <p className="text-[var(--ft-text-color)]">
              Expert builders and operators scaling the platform
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {coreTeam.map((member: any, index: any) => (
              <div
                key={member.id}
                className="feature-card rounded-2xl bg-[var(--ft-light)] p-6 text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[var(--ft-primary)] opacity-20 blur-xl"></div>
                    <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-2 border-[var(--ft-primary)]">
                      <div className="flex h-full w-full items-center justify-center bg-[#071004]">
                        <FiUsers className="h-12 w-12 text-[var(--ft-primary)]" />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-1 text-lg sm:text-xl font-bold text-white break-words">
                  {member.name}
                </h3>
                <p className="mb-3 text-sm text-[var(--ft-primary)]">
                  {member.designation}
                </p>
                <p className="mb-4 text-sm leading-relaxed text-[var(--ft-only-gray)]">
                  {member.bio}
                </p>

                <div className="flex justify-center gap-3 flex-wrap">
                  <a href={member.social.linkedin} className="social-btn-small">
                    <FiLinkedin size={16} />
                  </a>
                  <a href={member.social.twitter} className="social-btn-small">
                    <FiTwitter size={16} />
                  </a>
                  <a href={member.social.github} className="social-btn-small">
                    <FiGithub size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="bg-[#1f7201] py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {join_our_team.heading}
          </h2>
          <p className="mb-8 text-base sm:text-lg text-[var(--ft-only-gray)]">
            {join_our_team.subheading}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <a
              href={join_our_team.primaryCtaLink}
              className="rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition hover:bg-[var(--ft-btn-hover)] hover:text-white"
            >
              {join_our_team.primaryCtaText}
            </a>
            <a
              href={join_our_team.secondaryCtaLink}
              className="rounded-full border border-white px-8 py-4 font-medium text-white transition hover:bg-white hover:text-black"
            >
              {join_our_team.secondaryCtaText}
            </a>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}