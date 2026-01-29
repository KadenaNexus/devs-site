'use client'

import React, { useState, ReactNode, ReactElement } from 'react'
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
        React.cloneElement(child, {
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
        React.cloneElement(child as ReactElement, {
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
  questions: FAQItem[]
}

export function FAQs() {
  const faqCategories: FAQCategory[] = [
    {
      category: '',
      questions: [
        {
          id: 'faq-1',
          question: 'What is Kadena and why should I build on it?',
          answer:
            'Kadena is a next-generation blockchain platform that combines the security of Bitcoin with the scalability of modern distributed systems...',
        },
        {
          id: 'faq-2',
          question: 'Do I need blockchain experience to participate?',
          answer:
            "While some blockchain knowledge is helpful, it's not required...",
        },
        {
          id: 'faq-3',
          question: 'What are the technical requirements?',
          answer:
            'You need basic programming knowledge and familiarity with web development...',
        },
      ],
    },
    // remaining categories unchanged
  ]

  return (
    <HomeLayout>
      <section className="relative overflow-hidden bg-[var(--ft-bg-black)] py-20 lg:py-32">
        <section className='relative z-10 mx-auto mb-16 flex max-w-[1296px] px-3.75 text-center lg:mb-20'>
            <div className='serv-banner w-full bg-[var(--ft-light)] py-15 text-center'>
              <h1 className='text-gradient text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                How It Works
              </h1>
            </div>
          </section>


        <div className="relative z-10 mx-auto max-w-[1296px] px-6 lg:px-8">
          <div className=" space-y-12">
            {faqCategories.map((category, index) => (
              <div
                key={category.category}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h2 className="mb-6 text-2xl font-bold text-[var(--ft-primary)] lg:text-3xl">
                  {category.category}
                </h2>

                <Accordion type="single" className="space-y-4">
                  {category.questions.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="rounded-2xl border border-[#0d1d18] bg-[var(--ft-light)] px-6"
                    >
                      <AccordionTrigger className="py-6 text-left text-lg font-semibold text-white lg:text-xl">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 pt-2 text-base text-[var(--ft-only-gray)] lg:text-lg">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}
