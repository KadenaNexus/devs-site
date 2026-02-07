'use client'

import React, { useState, ReactNode, ReactElement, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFAQPage } from '@/services/strapi'
import { FiHelpCircle, FiSearch, FiMessageCircle, FiMail } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { HomeLayout } from '../home-layout'

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
      type='button'
      onClick={onToggle}
      className={`w-full ${className}`}
      aria-expanded={isOpen}
    >
      <div className='flex w-full items-center justify-between'>
        {children}
        <svg
          className={`h-5 w-5 shrink-0 text-[var(--ft-primary)] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
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

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  category: string
  questions: FAQItem[]
}

export function FAQs() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const { data: page, isLoading } = useQuery({
    queryKey: ['faq'],
    queryFn: getFAQPage,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isLoading) return null
  if (!page) return null

  const hero = page.hero
  const gettingStarted = page.getting_started
  const submissionProcess = page.submission_process
  const judgeAndPrizes = page.judge_and_prizes
  const technicalSupport = page.techincal_support
  const rulesAndPolicies = page.rules_and_policies
  const faqContact = page.faq_contact

  const buildFaqCategories = (): FAQCategory[] => {
    return [
      {
        category: gettingStarted?.title,
        questions:
          gettingStarted?.items.map((item: any) => ({
            id: `getting-${item.id}`,
            question: item.title,
            answer: item.description,
          })) || [],
      },
      {
        category: submissionProcess?.title,
        questions:
          submissionProcess?.items.map((item: any) => ({
            id: `submission-${item.id}`,
            question: item.title,
            answer: item.description,
          })) || [],
      },
      {
        category: judgeAndPrizes?.title,
        questions:
          judgeAndPrizes?.items.map((item: any) => ({
            id: `judge-${item.id}`,
            question: item.title,
            answer: item.description,
          })) || [],
      },
      {
        category: technicalSupport?.title,
        questions:
          technicalSupport?.items.map((item: any) => ({
            id: `tech-${item.id}`,
            question: item.title,
            answer: item.description,
          })) || [],
      },
      {
        category: rulesAndPolicies?.title,
        questions:
          rulesAndPolicies?.items.map((item: any) => ({
            id: `rules-${item.id}`,
            question: item.title,
            answer: item.description,
          })) || [],
      },
    ].filter((cat) => cat.category && cat.questions.length > 0)
  }
  const faqCategories = buildFaqCategories()

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          (activeCategory === 'all' || category.category === activeCategory) &&
          (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter((category) => category.questions.length > 0)

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
            <div className='mb-6 flex justify-center'>
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ft-primary)] text-4xl'>
                <FiHelpCircle className='text-black' />
              </div>
            </div>
            <h1 className='text-gradient mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl'>
              {hero?.heading}
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl'>
              {hero?.subheading}
            </p>
          </div>

          <div
            className={`mt-12 transition-all delay-300 duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className='mx-auto max-w-2xl'>
              <div className='relative'>
                <FiSearch
                  className='absolute top-1/2 left-4 -translate-y-1/2 text-[var(--ft-only-gray)]'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Search questions...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-full border-2 border-green-900 bg-[#0b1f0b] py-4 pr-4 pl-12 text-white placeholder-[var(--ft-only-gray)] transition-all focus:border-[var(--ft-primary)] focus:outline-none'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='sticky top-0 z-40 border-b border-[var(--ft-light)] bg-[var(--ft-dark-bg)] backdrop-blur-lg'>
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
                <span>{category.category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-[var(--ft-bg-black)] py-16 lg:py-20'>
        <div className='relative z-10 mx-auto max-w-5xl px-6 lg:px-8'>
          {filteredCategories.length === 0 ? (
            <div className='py-16 text-center'>
              <FiHelpCircle
                className='mx-auto mb-4 text-[var(--ft-only-gray)]'
                size={48}
              />
              <h3 className='mb-2 text-2xl font-bold text-white'>
                No questions found
              </h3>
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
                    <h2 className='text-gradient text-3xl font-bold lg:text-4xl'>
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
                        <AccordionContent className='pt-2 pb-6 text-base leading-relaxed text-[var(--ft-only-gray)] lg:text-lg'>
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

      <section className='relative bg-[#1f7201] py-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
            {faqContact?.heading}
          </h2>
          <p className='mb-8 text-lg text-[var(--ft-only-gray)]'>
            {faqContact?.subheading}
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button className='flex items-center gap-2 rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white'>
              <FiMessageCircle size={20} />
              <Link to={faqContact?.primaryCtaLink}>
                {' '}
                {faqContact?.primaryCtaText}
              </Link>
            </button>
            <button className='flex items-center gap-2 rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black'>
              <FiMail size={20} />
              <Link to={faqContact?.secondaryCtaLink}>
                {' '}
                {faqContact?.secondaryCtaText}
              </Link>
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
