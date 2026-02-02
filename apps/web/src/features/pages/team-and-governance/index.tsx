'use client'

import { useState, useEffect } from 'react'
import { 
  FiUsers, 
  FiShield, 
  FiAward, 
  FiLinkedin, 
  FiTwitter, 
  FiGithub,
  FiCheck,
  FiTarget,
  FiLock,
  FiEye
} from 'react-icons/fi'
import { HomeLayout } from '../home-layout'

export function TeamGovernance() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('team')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const founder = {
    name: 'JOHN ANDERSON',
    role: 'Founder & CEO',
    bio: 'Former blockchain architect at leading DeFi protocols. 10+ years in distributed systems and smart contract development.',
    image: '/images/founder.jpg',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  }

  const coreTeam = [
    {
      id: 1,
      name: 'SARAH CHEN',
      role: 'Head of Engineering',
      bio: 'Ex-Senior Engineer at Chainlink. Specialized in cross-chain protocols and Pact smart contracts.',
      image: '/images/team1.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 2,
      name: 'MARCUS WILLIAMS',
      role: 'Product Lead',
      bio: 'Product veteran from Web3 startups. Expert in building developer-first platforms and community engagement.',
      image: '/images/team2.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'ELENA RODRIGUEZ',
      role: 'Head of Community',
      bio: 'Community builder with experience in growing developer ecosystems from 0 to 10K+ members.',
      image: '/images/team3.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 4,
      name: 'DAVID KIM',
      role: 'Smart Contract Auditor',
      bio: 'Security researcher with 50+ audits. Previously at OpenZeppelin and Trail of Bits.',
      image: '/images/team4.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ]

  const advisors = [
    {
      id: 1,
      name: 'DR. EMILY WATSON',
      role: 'Technical Advisor',
      expertise: 'Blockchain Architecture & Consensus',
      bio: 'Ph.D. in Distributed Systems. Former researcher at MIT Media Lab.',
      image: '/images/advisor1.jpg'
    },
    {
      id: 2,
      name: 'JAMES RICHARDSON',
      role: 'Strategy Advisor',
      expertise: 'Tokenomics & DeFi',
      bio: 'Early contributor to major DeFi protocols. Advised 20+ blockchain projects.',
      image: '/images/advisor2.jpg'
    },
    {
      id: 3,
      name: 'LISA MARTINEZ',
      role: 'Legal Advisor',
      expertise: 'Crypto Regulation & Compliance',
      bio: 'Partner at top crypto law firm. Expert in Web3 governance structures.',
      image: '/images/advisor3.jpg'
    }
  ]

  const governancePrinciples = [
    {
      icon: <FiEye className="w-10 h-10" />,
      title: 'Transparency',
      description: 'All judging criteria, scores, and decisions are publicly documented and accessible.'
    },
    {
      icon: <FiShield className="w-10 h-10" />,
      title: 'Fairness',
      description: 'Multi-judge system with conflict of interest policies and blind evaluation phases.'
    },
    {
      icon: <FiLock className="w-10 h-10" />,
      title: 'Accountability',
      description: 'Judges are publicly identified and their evaluations can be reviewed by the community.'
    },
    {
      icon: <FiTarget className="w-10 h-10" />,
      title: 'Merit-Based',
      description: 'Winners selected purely on technical quality, innovation, and real-world applicability.'
    }
  ]

  const judgingProcess = [
    {
      step: '01',
      title: 'Initial Screening',
      description: 'Automated checks for completeness, code quality, and basic requirements.'
    },
    {
      step: '02',
      title: 'Technical Review',
      description: 'Expert evaluation of smart contract architecture, security, and innovation.'
    },
    {
      step: '03',
      title: 'Demo Assessment',
      description: 'Live demonstration review for usability, performance, and real-world viability.'
    },
    {
      step: '04',
      title: 'Final Scoring',
      description: 'Combined scores from multiple judges, averaged and publicly posted.'
    }
  ]

  return (
    <HomeLayout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[var(--ft-dark)] pt-30 pb-16 lg:pt-32 lg:pb-20 border border-b-[var(--ft-light)]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-gradient mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Team & Governance
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl">
              Meet the people building the future of Kadena developer challenges. 
              Our transparent governance ensures fair, merit-based evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-[var(--ft-dark-bg)] backdrop-blur-lg border-b border-[var(--ft-light)] ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-center gap-4 py-6">
            {['team', 'advisors', 'governance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[var(--ft-primary)] text-black'
                    : 'bg-[var(--ft-light)] text-[var(--ft-only-gray)] hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      {activeTab === 'team' && (
        <>
          <section className="relative bg-[var(--ft-dark-bg)] py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 text-center">
                <h2 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
                  Founder
                </h2>
                <p className="text-[var(--ft-text-color)]">
                  Visionary leader driving innovation in Web3
                </p>
              </div>

              <div className="mx-auto max-w-4xl">
                <div className="feature-card group rounded-3xl bg-[var(--ft-light)] p-8 lg:p-12">
                  <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                    <div className="relative flex-shrink-0">
                      <div className="winner-image-glow absolute inset-0 rounded-full"></div>
                      <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-[var(--ft-primary)]">
                        <div className="flex h-full w-full items-center justify-center bg-[#071004]">
                          <FiUsers className="h-14 w-14 text-[var(--ft-primary)]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="mb-2 text-3xl font-bold text-white">
                        {founder.name}
                      </h3>
                      <p className="mb-4 text-xl text-[var(--ft-primary)]">
                        {founder.role}
                      </p>
                      <p className="mb-6 leading-relaxed text-[var(--ft-only-gray)]">
                        {founder.bio}
                      </p>

                      <div className="flex justify-center gap-4 lg:justify-start">
                        <a
                          href={founder.social.linkedin}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                        >
                          <FiLinkedin size={20} />
                        </a>
                        <a
                          href={founder.social.twitter}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                        >
                          <FiTwitter size={20} />
                        </a>
                        <a
                          href={founder.social.github}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
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

          {/* Core Team Section */}
          <section className="relative bg-[var(--ft-bg-black)] py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 text-center">
                <h2 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
                  Core Team
                </h2>
                <p className="text-[var(--ft-text-color)]">
                  Expert builders and operators scaling the platform
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {coreTeam.map((member, index) => (
                  <div
                    key={member.id}
                    className="animate-fadeInUp feature-card group rounded-2xl bg-[var(--ft-light)] p-6"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-[var(--ft-primary)] opacity-20 blur-xl"></div>
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-[var(--ft-primary)]">
                          <div className="flex h-full w-full items-center justify-center bg-[#071004]">
                            <FiUsers className="h-14 w-14 text-[var(--ft-primary)]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="mb-1 text-xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="mb-3 text-sm text-[var(--ft-primary)]">
                        {member.role}
                      </p>
                      <p className="mb-4 text-sm leading-relaxed text-[var(--ft-only-gray)]">
                        {member.bio}
                      </p>

                      <div className="flex justify-center gap-3">
                        <a
                          href={member.social.linkedin}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                        >
                          <FiLinkedin size={16} />
                        </a>
                        <a
                          href={member.social.twitter}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                        >
                          <FiTwitter size={16} />
                        </a>
                        <a
                          href={member.social.github}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
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
      )}

      {/* Advisors Section */}
      {activeTab === 'advisors' && (
        <section className="relative bg-[var(--ft-dark-bg)] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <h2 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
                Strategic Advisors
              </h2>
              <p className="text-[var(--ft-text-color)]">
                Industry experts guiding our vision and strategy
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {advisors.map((advisor, index) => (
                <div
                  key={advisor.id}
                  className="animate-fadeInUp feature-card group rounded-2xl bg-[var(--ft-light)] p-8"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-[var(--ft-primary)] opacity-20 blur-xl"></div>
                      <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[var(--ft-primary)]">
                        <div className="flex h-full w-full items-center justify-center bg-[#071004]">
                          <FiAward className="h-14 w-14 text-[var(--ft-primary)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="mb-1 text-2xl font-bold text-white">
                      {advisor.name}
                    </h3>
                    <p className="mb-2 text-sm text-[var(--ft-primary)]">
                      {advisor.role}
                    </p>
                    <div className="mb-4 inline-block rounded-full bg-[#071004] px-4 py-1">
                      <p className="text-xs text-[var(--ft-only-gray)]">
                        {advisor.expertise}
                      </p>
                    </div>
                    <p className="leading-relaxed text-[var(--ft-only-gray)]">
                      {advisor.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Governance Section */}
      {activeTab === 'governance' && (
        <>
          {/* Governance Principles */}
          <section className="relative bg-[var(--ft-dark-bg)] py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 text-center">
                <h2 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
                  Governance Principles
                </h2>
                <p className="text-[var(--ft-text-color)]">
                  Our commitment to fair and transparent evaluation
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {governancePrinciples.map((principle, index) => (
                  <div
                    key={index}
                    className="animate-fadeInUp feature-card group rounded-2xl bg-[var(--ft-light)] p-8 text-center"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)]">
                        {principle.icon}
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--ft-only-gray)]">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Judging Process */}
          <section className="relative bg-[#1f7201] py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                  Judging Process
                </h2>
                <p className="text-[var(--ft-only-gray)]">
                  Four-phase evaluation ensuring quality and fairness
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {judgingProcess.map((phase, index) => (
                  <div
                    key={index}
                    className="animate-fadeInUp relative rounded-2xl border border-green-900 bg-[#0b1f0b] p-8"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-6">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ft-primary)] text-2xl font-bold text-black">
                        {phase.step}
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      {phase.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--ft-only-gray)]">
                      {phase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Judging Criteria */}
          <section className="relative bg-[var(--ft-bg-black)] py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
                  Evaluation Criteria
                </h2>
                <p className="text-[var(--ft-only-gray)]">
                  What we look for in winning submissions
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'Technical Excellence',
                    points: '35 points',
                    items: [
                      'Code quality and architecture',
                      'Smart contract security',
                      'Performance optimization',
                      'Proper error handling'
                    ]
                  },
                  {
                    title: 'Innovation',
                    points: '25 points',
                    items: [
                      'Novel approach or solution',
                      'Creative use of Kadena features',
                      'Unique value proposition',
                      'Problem-solving ingenuity'
                    ]
                  },
                  {
                    title: 'Real-World Viability',
                    points: '25 points',
                    items: [
                      'Production readiness',
                      'Scalability potential',
                      'Market fit and demand',
                      'Deployment feasibility'
                    ]
                  },
                  {
                    title: 'Documentation',
                    points: '10 points',
                    items: [
                      'Clear README and setup',
                      'Code comments',
                      'API documentation',
                      'Architecture diagrams'
                    ]
                  },
                  {
                    title: 'User Experience',
                    points: '5 points',
                    items: [
                      'Interface design',
                      'Ease of use',
                      'Error feedback',
                      'Overall polish'
                    ]
                  }
                ].map((criteria, index) => (
                  <div
                    key={index}
                    className="animate-fadeInUp feature-card rounded-2xl bg-[var(--ft-light)] p-6"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        {criteria.title}
                      </h3>
                      <span className="rounded-full bg-[var(--ft-primary)] px-3 py-1 text-sm font-bold text-black">
                        {criteria.points}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {criteria.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--ft-only-gray)]">
                          <FiCheck className="mt-1 flex-shrink-0 text-[var(--ft-primary)]" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="relative bg-[#1f7201] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Join Our Mission
          </h2>
          <p className="mb-8 text-lg text-[var(--ft-only-gray)]">
            We're always looking for talented individuals to join our team and contribute to the Kadena ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white">
              View Open Positions
            </button>
            <button className="rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}