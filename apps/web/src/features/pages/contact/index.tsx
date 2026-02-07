'use client'

import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { 
  FiMail, 
  FiMessageSquare, 
  FiTwitter, 
  FiGithub,
  FiSend,
  FiMapPin,
  FiPhone,
  FiClock,
  FiLinkedin,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi'
import { HomeLayout } from '../home-layout'
import FillButton from '../components/FillButton'
import StrokeButton from '../components/StrokeButton'
import { sendContactEmail } from '@/services/email'

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Send email to admin (dekatediksha@gmail.com for testing)
      const result = await sendContactEmail(formData)
      
      if (result.success) {
        setIsSubmitting(false)
        setSubmitSuccess(true)
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            category: 'general',
            message: ''
          })
          setSubmitSuccess(false)
        }, 3000)
      } else {
        setIsSubmitting(false)
        setSubmitError(result.error || 'Failed to send message. Please try again.')
      }
    } catch (error: any) {
      setIsSubmitting(false)
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.')
    }
  }

  const contactInfo = [
    {
      icon: <FiMail className="w-8 h-10" />,
      title: 'Email Us',
      detail: 'support@kadenachallenges.io',
      link: 'mailto:support@kadenachallenges.io',
      description: 'For general inquiries and support'
    },
    {
      icon: <FiMessageSquare className="w-8 h-10" />,
      title: 'Discord Community',
      detail: 'Join our Discord',
      link: '#',
      description: 'Chat with builders and get help'
    },
    {
      icon: <FiTwitter className="w-8 h-10" />,
      title: 'Twitter',
      detail: '@KadenaChallenges',
      link: '#',
      description: 'Follow for updates and news'
    },
    {
      icon: <FiGithub className="w-8 h-10" />,
      title: 'GitHub',
      detail: 'github.com/kadena-challenges',
      link: '#',
      description: 'View our open-source code'
    }
  ]

  const officeInfo = [
    {
      icon: <FiMapPin className="h-6 w-6" />,
      title: 'Office Location',
      detail: 'San Francisco, CA 94105, USA'
    },
    {
      icon: <FiPhone className="h-6 w-6" />,
      title: 'Phone',
      detail: '+1 (555) 123-4567'
    },
    {
      icon: <FiClock className="h-6 w-6" />,
      title: 'Business Hours',
      detail: 'Mon - Fri: 9:00 AM - 6:00 PM PST'
    }
  ]

  const faqs = [
    {
      question: 'How long does it take to review submissions?',
      answer: 'We typically review submissions within 7-10 business days. You\'ll receive email updates on your submission status.'
    },
    {
      question: 'Can I participate in multiple challenges?',
      answer: 'Yes! You can participate in as many challenges as you want, either solo or with different teams.'
    },
    {
      question: 'What happens after I win a challenge?',
      answer: 'Winners receive prizes, public recognition, and potential opportunities for long-term collaboration and project funding.'
    },
    {
      question: 'Do you provide technical support?',
      answer: 'Yes! Join our Discord community for technical help, or email our support team for specific questions.'
    }
  ]

  return (
    <HomeLayout>
      {/* Hero Section */}
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
              Get in Touch
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-[var(--ft-text-color)] md:text-xl">
              Have questions about challenges, submissions, or partnerships? 
              We're here to help you build on Kadena.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="relative bg-[var(--ft-dark-bg)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
              Connect With Us
            </h2>
            <p className="text-[var(--ft-only-gray)]">
              Choose your preferred way to reach out
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="animate-fadeInUp feature-card group block rounded-2xl bg-[var(--ft-light)] p-8 text-center transition-all hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all group-hover:scale-110">
                    {info.icon}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {info.title}
                </h3>
                <p className="mb-3 text-sm text-[var(--ft-primary)]">
                  {info.detail}
                </p>
                <p className="text-xs text-[var(--ft-only-gray)]">
                  {info.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="relative bg-[var(--ft-bg-black)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="rounded-3xl bg-[var(--ft-light)] p-8 lg:p-10">
                <h2 className="text-white mb-6 text-3xl font-bold md:text-4xl">
                  Send Us a Message
                </h2>
                <p className="mb-8 text-[var(--ft-only-gray)]">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>

                {submitSuccess ? (
                  <div className="rounded-2xl border border-[var(--ft-primary)] bg-[var(--ft-dark-bg)] p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ft-primary)]">
                        <FiCheck className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      Message Sent!
                    </h3>
                    <p className="text-[var(--ft-only-gray)]">
                      Thanks for reaching out. We'll respond to <strong className="text-white">{formData.email}</strong> soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="rounded-xl border border-red-500 bg-red-500/10 p-4">
                        <div className="flex items-start gap-3">
                          <FiAlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                          <div>
                            <h4 className="font-semibold text-red-500">Error</h4>
                            <p className="text-sm text-red-400">{submitError}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-[#071004] bg-[#071004] px-4 py-3 text-white placeholder-[var(--ft-only-gray)] focus:border-[var(--ft-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ft-primary)] focus:ring-opacity-20"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-[#071004] bg-[#071004] px-4 py-3 text-white placeholder-[var(--ft-only-gray)] focus:border-[var(--ft-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ft-primary)] focus:ring-opacity-20"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-[#071004] bg-[#071004] px-4 py-3 text-white focus:border-[var(--ft-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ft-primary)] focus:ring-opacity-20"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="submission">Submission Question</option>
                        <option value="judging">Judging Process</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-[#071004] bg-[#071004] px-4 py-3 text-white placeholder-[var(--ft-only-gray)] focus:border-[var(--ft-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ft-primary)] focus:ring-opacity-20"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full rounded-xl border border-[#071004] bg-[#071004] px-4 py-3 text-white placeholder-[var(--ft-only-gray)] focus:border-[var(--ft-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ft-primary)] focus:ring-opacity-20"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend size={18} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Office Info & FAQ */}
            <div
              className={`space-y-8 transition-all delay-200 duration-1000 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              {/* Office Information */}
              <div className="rounded-3xl bg-[var(--ft-light)] p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">
                  Office Information
                </h3>
                <div className="space-y-6">
                  {officeInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)]">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-white">
                          {info.title}
                        </h4>
                        <p className="text-sm text-[var(--ft-only-gray)]">
                          {info.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="rounded-3xl bg-[var(--ft-light)] p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                  >
                    <FiTwitter size={24} />
                  </a>
                  <a
                    href="#"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                  >
                    <FiGithub size={24} />
                  </a>
                  <a
                    href="#"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                  >
                    <FiLinkedin size={24} />
                  </a>
                  <a
                    href="#"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#071004] text-[var(--ft-primary)] transition-all hover:bg-[var(--ft-primary)] hover:text-black"
                  >
                    <FiMessageSquare size={24} />
                  </a>
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="rounded-3xl bg-[var(--ft-light)] p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.slice(0, 2).map((faq, index) => (
                    <div key={index} className="border-b border-[var(--ft-dark-bg)] pb-4 last:border-0 last:pb-0">
                      <h4 className="mb-2 font-semibold text-white">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-[var(--ft-only-gray)]">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
                <a href="faqs" className="mt-6 text-sm font-medium text-[var(--ft-primary)] hover:underline">
                  View All FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-[#1f7201] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Ready to Start Building?
          </h2>
          <p className="mb-8 text-lg text-[var(--ft-only-gray)]">
            Don't wait! Join active challenges and start building production-ready MVPs on Kadena.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-[var(--ft-primary)] px-8 py-4 font-medium text-black transition-all hover:bg-[var(--ft-btn-hover)] hover:text-white">
              Browse Challenges
            </button>
            <button className="rounded-full border border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black">
              Join Community
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  )
}