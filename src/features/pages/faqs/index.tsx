'use client'

import React, { useState, ReactNode, ReactElement, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { 
  FiHelpCircle, 
  FiSearch,
  FiMessageCircle,
  FiMail
} from 'react-icons/fi'
import { HomeLayout } from '../home-layout'

/* =====================
   Accordion Types
===================== */

type AccordionType = 'single' | 'multiple'

interface AccordionProps {
  children: ReactElement<AccordionItemProps>[]
  type?: AccordionType
  className?: string
}

interface AccordionItemProps {
  value: string
  isOpen?: boolean
  onToggle?: () => void
  className?: string
  children: ReactElement[]
}

interface AccordionTriggerProps {
  isOpen?: boolean
  onToggle?: () => void
  className?: string
  children: ReactNode
}

interface AccordionContentProps {
  isOpen?: boolean
  className?: string
  children: ReactNode
}

/* =====================
   Accordion Components
===================== */

function Accordion({
  children,
  type = 'single',
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value])
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter((item) => item !== value)
          : [...openItems, value]
      )
    }
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as ReactElement<AccordionItemProps>, {
          isOpen: openItems.includes(child.props.value),
          onToggle: () => toggleItem(child.props.value),
        })
      )}
    </div>
  )
}

function AccordionItem({
  isOpen,
  onToggle,
  className = '',
  children,
}: AccordionItemProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as ReactElement<any>, {
          isOpen,
          onToggle,
        })
      )}
    </div>
  )
}

function AccordionTrigger({
  isOpen,
  onToggle,
  className = '',
  children,
}: AccordionTriggerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full ${className}`}
      aria-expanded={isOpen}
    >
      <div className="flex w-full items-center justify-between">
        {children}
        <svg
          className={`h-5 w-5 shrink-0 text-[var(--ft-primary)] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>
  )
}

function AccordionContent({
  isOpen,
  className = '',
  children,
}: AccordionContentProps) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className={className}>{children}</div>
    </div>
  )
}

/* =====================
   FAQ Page
===================== */

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  category: string
  icon: ReactNode
  questions: FAQItem[]
}

export function FAQs() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const faqCategories: FAQCategory[] = [
    {
      category: 'Getting Started',
      icon: '🚀',
      questions: [
        {
          id: 'faq-1',
          question: 'What is Kadena and why should I build on it?',
          answer: 'Kadena is a next-generation blockchain platform that combines the security of Bitcoin with the scalability of modern distributed systems. It uses a unique multi-chain architecture (Chainweb) that can scale to handle millions of transactions. Kadena\'s smart contract language, Pact, is designed to be more secure and easier to audit than Solidity, making it ideal for production applications.'
        },
        {
          id: 'faq-2',
          question: 'Do I need blockchain experience to participate?',
          answer: 'While some blockchain knowledge is helpful, it\'s not required. If you\'re a developer who can learn quickly, you can pick up Pact and Kadena concepts through our documentation and community resources. Many successful participants started with zero blockchain experience.'
        },
        {
          id: 'faq-3',
          question: 'What are the technical requirements to participate?',
          answer: 'You need basic programming knowledge and familiarity with web development. For Kadena specifically, you\'ll write smart contracts in Pact (similar syntax to Lisp/Scheme) and can use any frontend framework (React, Vue, Svelte, etc.). Access to Kadena testnet is free and you don\'t need any cryptocurrency to test your applications.'
        },
        {
          id: 'faq-4',
          question: 'Can I work in a team or must I participate solo?',
          answer: 'Teams are encouraged! You can form a team of up to 5 members. Make sure to clearly indicate all team members when submitting your project. Prize money will be split among team members as they decide. Working in a team often leads to better projects and learning experiences.'
        },
        {
          id: 'faq-5',
          question: 'How much time do I need to complete a challenge?',
          answer: 'Most challenges run for 4-6 weeks, giving you plenty of time to learn, build, and refine your solution. You can work at your own pace - some builders spend evenings and weekends, while others work full-time on their projects. The key is creating a working MVP, not a perfect product.'
        }
      ]
    },
    {
      category: 'Submission Process',
      icon: '📤',
      questions: [
        {
          id: 'faq-6',
          question: 'What should I include in my submission?',
          answer: 'Your submission must include: (1) Public GitHub repository with complete source code, (2) Live demo URL that judges can access, (3) Comprehensive README with setup instructions and architecture overview, (4) Technical documentation explaining your design decisions. Optional but recommended: demo video, architecture diagrams, test results, and deployment guide.'
        },
        {
          id: 'faq-7',
          question: 'How long does the review process take?',
          answer: 'We typically complete reviews within 7-10 business days after the challenge deadline. The process includes automated screening, technical review by judges, demo testing, and final scoring. You\'ll receive email updates on your submission status at each stage. Winners are announced publicly on our platform and social media channels.'
        },
        {
          id: 'faq-8',
          question: 'Can I participate in multiple challenges simultaneously?',
          answer: 'Absolutely! You can participate in as many challenges as you want, either solo or with different teams. Each challenge is evaluated independently, so participating in multiple challenges won\'t hurt your chances. However, make sure you can dedicate enough time to create quality submissions for each.'
        },
        {
          id: 'faq-9',
          question: 'What happens if my demo goes down during judging?',
          answer: 'Make sure your demo is deployed on reliable hosting (we recommend Vercel, Netlify, or similar platforms with good uptime). If there are technical issues during judging, we\'ll contact you via email to give you a chance to fix them. However, having a stable, accessible demo is part of the evaluation criteria, so choose your hosting carefully.'
        },
        {
          id: 'faq-10',
          question: 'Can I update my submission after the deadline?',
          answer: 'You can update your submission until the official deadline. After the deadline, minor fixes like README updates or broken demo links may be allowed on a case-by-case basis, but substantial code changes are not permitted. We recommend submitting your best work before the deadline to avoid any issues.'
        },
        {
          id: 'faq-11',
          question: 'Do I need to deploy my smart contracts to mainnet?',
          answer: 'No, testnet deployment is sufficient for most challenges. We want to see working code and understand your architecture, not production deployment. However, if your solution is particularly innovative and viable, we may discuss mainnet deployment and potential funding as a follow-up opportunity.'
        }
      ]
    },
    {
      category: 'Judging & Prizes',
      icon: '🏆',
      questions: [
        {
          id: 'faq-12',
          question: 'How are submissions judged and scored?',
          answer: 'Submissions are evaluated on five criteria totaling 100 points: Technical Excellence (35 points) - code quality, security, architecture, performance; Innovation (25 points) - novel approach, creative use of Kadena features; Real-World Viability (25 points) - production readiness, scalability, market fit; Documentation (10 points) - README, code comments, technical docs; User Experience (5 points) - interface design, ease of use, polish.'
        },
        {
          id: 'faq-13',
          question: 'Who are the judges and how are they selected?',
          answer: 'Our judges are experienced blockchain developers, smart contract auditors, and Kadena ecosystem experts. All judges are publicly identified on our Team & Governance page. We maintain strict conflict of interest policies - judges cannot evaluate projects they\'re personally connected to. Each submission is reviewed by at least 3 judges, and scores are averaged for fairness.'
        },
        {
          id: 'faq-14',
          question: 'When and how are prizes distributed?',
          answer: 'Prizes are distributed within 2 weeks of winner announcement. We support payment via cryptocurrency (KDA, USDC, or other major coins) or traditional methods (PayPal, bank transfer, or check). Winners will be contacted directly via email for payment details. For international winners, we work with you to find the best payment method.'
        },
        {
          id: 'faq-15',
          question: 'What happens after I win a challenge?',
          answer: 'Beyond the cash prize, winners get featured on our homepage, recognition in our community newsletter, and social media promotion. You\'ll also be invited to present your project in a community showcase. Some winning projects have received additional funding to develop into full products, partnerships with Kadena ecosystem projects, or invitations to join accelerator programs.'
        },
        {
          id: 'faq-16',
          question: 'Are the judging scores and feedback made public?',
          answer: 'Yes! We believe in full transparency. After judging is complete, all scores are published along with general feedback from judges. Individual detailed feedback may be shared privately with participants. This transparency helps the community learn what makes a winning submission and ensures fair evaluation.'
        },
        {
          id: 'faq-17',
          question: 'What if I disagree with the judging results?',
          answer: 'While judging decisions are final, we\'re open to feedback. If you believe there was a scoring error or unfair evaluation, you can contact us within 48 hours of results announcement. We\'ll review your concerns, though this rarely changes outcomes. Our transparent criteria and multi-judge system minimize subjective bias.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: '🛠️',
      questions: [
        {
          id: 'faq-18',
          question: 'Where can I get help with Pact smart contract development?',
          answer: 'Join our Discord community for real-time help from other builders, mentors, and Kadena developers. We also provide documentation links, code examples, and video tutorials. We host weekly office hours where you can ask questions directly to experienced Pact developers. The Kadena documentation at docs.kadena.io is also an excellent resource.'
        },
        {
          id: 'faq-19',
          question: 'Are there starter templates or boilerplates available?',
          answer: 'Yes! We provide official starter templates for common use cases. Check our GitHub organization for templates including: Pact + React boilerplate, NFT marketplace starter, DeFi protocol template, token swap interface, and more. These templates help you get started quickly and follow best practices.'
        },
        {
          id: 'faq-20',
          question: 'Can I use existing open-source code or libraries?',
          answer: 'Yes, you can use open-source libraries, frameworks, and code. However, the core smart contract logic and unique features of your submission must be your own work. Clearly document any third-party code used in your README. Using well-tested libraries for common functionality (like UI components) is encouraged and shows good engineering practices.'
        },
        {
          id: 'faq-21',
          question: 'What development tools do you recommend?',
          answer: 'For smart contracts: Pact local development environment or Kadena DevNet. For frontend: any framework you\'re comfortable with (React, Vue, Next.js, etc.). For testing: Pact\'s built-in testing framework. For deployment: Vercel, Netlify, or GitHub Pages for frontend; Kadena testnet for smart contracts. For version control: Git and GitHub.'
        },
        {
          id: 'faq-22',
          question: 'How do I test my Pact smart contracts?',
          answer: 'Pact has a built-in testing framework that lets you write tests directly in Pact. You can also use the Pact REPL for interactive testing. Deploy to Kadena testnet for integration testing. We recommend writing comprehensive tests covering normal operations, edge cases, and security scenarios. Good test coverage is considered in the Technical Excellence scoring.'
        },
        {
          id: 'faq-23',
          question: 'What if I encounter a bug in Kadena or Pact during development?',
          answer: 'First, check if it\'s a known issue in the Kadena GitHub issues. If it\'s a new bug, report it on GitHub with detailed reproduction steps. For challenges, document any platform limitations you encountered and how you worked around them. Judges understand platform constraints and won\'t penalize you for legitimate bugs outside your control.'
        }
      ]
    },
    {
      category: 'Rules & Policies',
      icon: '📋',
      questions: [
        {
          id: 'faq-24',
          question: 'Who owns the intellectual property of my submission?',
          answer: 'You retain full ownership and intellectual property rights to your code and project. By submitting, you grant us permission to showcase your project publicly (on our platform, social media, etc.) and use it as an example for future participants. You\'re free to commercialize, open-source, or do whatever you want with your project.'
        },
        {
          id: 'faq-25',
          question: 'Are there any restrictions on who can participate?',
          answer: 'Challenges are open to anyone worldwide, with a few exceptions: (1) You must be 18 years or older, (2) You cannot be a judge or organizer of the specific challenge you\'re entering, (3) Some regions may have restrictions due to local regulations. There\'s no KYC required to participate, though winners need to provide payment details to receive prizes.'
        },
        {
          id: 'faq-26',
          question: 'What happens if I plagiarize or copy someone else\'s code?',
          answer: 'Plagiarism results in immediate disqualification and permanent ban from all future challenges. We use automated tools and manual review to detect code copying. Using open-source libraries is fine (with attribution), but your core logic must be original. If we discover plagiarism after prizes are awarded, we will reclaim the prize and publicly announce the disqualification.'
        },
        {
          id: 'faq-27',
          question: 'Can I submit a project I built before the challenge started?',
          answer: 'Projects must be built specifically for the challenge, with the majority of work done during the challenge period. You can use your own previous code snippets or utilities, but the main application must be new. If you\'re adapting an existing project, make it clear what\'s new vs. what existed before. Judges look for challenge-specific work.'
        },
        {
          id: 'faq-28',
          question: 'What if I can\'t finish my project by the deadline?',
          answer: 'Submit whatever you have completed by the deadline. A partial working demo is better than nothing. Clearly document what works, what doesn\'t, and what you would have built with more time. Incomplete submissions can still win if the completed portions are exceptional. However, extensions are rarely granted except in extreme circumstances affecting all participants.'
        }
      ]
    }
  ]

  // Filter FAQs based on search query and category
  const filteredCategories = faqCategories
    .map(category => ({
      ...category,
      questions: category.questions.filter(faq =>
        (activeCategory === 'all' || category.category === activeCategory) &&
        (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.questions.length > 0)

  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-[var(--ft-dark)] pt-30 pb-16 lg:pt-32 lg:pb-20 border border-b-[var(--ft-light)]'>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-[var(--ft-primary)] opacity-10 blur-3xl"></div>
        </div>

        <div className='relative z-10 mx-auto max-w-7xl px-6 text-center'>
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className='mb-6 flex justify-center'>
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ft-primary)] text-4xl'>
                <FiHelpCircle className='text-black' />
              </div>
            </div>
            <h1 className='text-gradient mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl'>
              Frequently Asked Questions
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl'>
              Everything you need to know about participating in Kadena challenges. Can't find your answer? Contact our support team.
            </p>
          </div>

          {/* Search Bar */}
          <div
            className={`mt-12 transition-all delay-300 duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className='mx-auto max-w-2xl'>
              <div className='relative'>
                <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ft-only-gray)]' size={20} />
                <input
                  type='text'
                  placeholder='Search questions...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-full border-2 border-green-900 bg-[#0b1f0b] py-4 pl-12 pr-4 text-white placeholder-[var(--ft-only-gray)] transition-all focus:border-[var(--ft-primary)] focus:outline-none'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className='sticky top-0 z-40 bg-[var(--ft-dark-bg)] backdrop-blur-lg border-b border-[var(--ft-light)]'>
        <div className='mx-auto max-w-7xl px-6 py-6'>
          <div className='flex flex-wrap justify-center gap-3'>
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-6 py-3 text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-[var(--ft-primary)] text-black'
                  : 'bg-[var(--ft-light)] text-[var(--ft-only-gray)] hover:text-white'
              }`}
            >
              All Questions
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                  activeCategory === category.category
                    ? 'bg-[var(--ft-primary)] text-black'
                    : 'bg-[var(--ft-light)] text-[var(--ft-only-gray)] hover:text-white'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className='relative overflow-hidden bg-[var(--ft-bg-black)] py-16 lg:py-20'>
        <div className='relative z-10 mx-auto max-w-5xl px-6 lg:px-8'>
          {filteredCategories.length === 0 ? (
            <div className='text-center py-16'>
              <FiHelpCircle className='mx-auto mb-4 text-[var(--ft-only-gray)]' size={48} />
              <h3 className='mb-2 text-2xl font-bold text-white'>No questions found</h3>
              <p className='text-[var(--ft-only-gray)]'>
                Try adjusting your search or browse all categories
              </p>
            </div>
          ) : (
            <div className='space-y-16'>
              {filteredCategories.map((category, index) => (
                <div
                  key={category.category}
                  className='animate-fadeInUp'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='mb-8 flex items-center gap-3'>
                    <span className='text-4xl'>{category.icon}</span>
                    <h2 className='text-3xl font-bold lg:text-4xl text-gradient'>
                      {category.category}
                    </h2>
                  </div>

                  <Accordion type='single' className='space-y-4'>
                    {category.questions.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className='faq-accordion-item feature-card rounded-2xl border border-[#0d1d18] bg-[var(--ft-light)] px-6 transition-all'
                      >
                        <AccordionTrigger className='py-6 text-left text-lg font-semibold text-white lg:text-xl'>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className='pb-6 pt-2 text-base leading-relaxed text-[var(--ft-only-gray)] lg:text-lg'>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className='relative bg-[#1f7201] py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
            Still Have Questions?
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-only-gray)]'>
            Our community is here to help. Join Discord for real-time support or contact us directly.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button className='flex items-center gap-2 rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'>
              <FiMessageCircle size={20} />
              Join Discord
            </button>
            <button className='flex items-center gap-2 rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black'>
              <FiMail size={20} />
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}