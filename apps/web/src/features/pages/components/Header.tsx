'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { SupportDonationDialog } from '@/components/support-donation-dialog'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'How it Works', href: 'how-it-works' },
    { name: 'Challenges', href: 'challenge-list' },
    { name: 'Submit Project', href: 'project-submission' },
    { name: 'Winners & Rewards', href: 'winners-page' },
    { name: 'Team & Governance', href: 'team-and-governance' },
    { name: 'FAQ', href: 'faqs' },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 py-[15px] transition-all duration-300 ${
          isScrolled
            ? 'border-b border-[var(--ft-header-border)] bg-[var(--ft-header-bg)] shadow-lg backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className='mx-auto max-w-[1296px] px-[15px]'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex-shrink-0'>
              <a href='/' className='flex items-center space-x-2'>
                <img
                  src='/images/logo.png'
                  alt='Logo'
                  className='m-0 w-26'
                  style={{ display: 'var(--logo-dark-display)' }}
                />
                <img
                  src='/images/logo.png'
                  alt='Logo'
                  className='m-0 w-26'
                  style={{ display: 'var(--logo-light-display)' }}
                />
              </a>
            </div>

            <nav className='hidden items-center space-x-8 lg:flex'>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--ft-primary)]'
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className='ml-8 hidden items-center gap-4 lg:flex'>
              <button
                onClick={toggleTheme}
                aria-label='Toggle theme'
                className='flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ft-primary)] bg-[var(--ft-light)] text-[var(--ft-primary)] transition-all duration-300 hover:bg-[var(--ft-primary)] hover:text-black'
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <a
                href='contact'
                className='rounded-full bg-[var(--ft-primary)] px-6 py-2.5 text-sm font-medium text-black transition-all duration-600 hover:bg-[var(--ft-btn-hover)] hover:text-white'
              >
                Contact
              </a>

              <button
                onClick={() => setIsSupportOpen(true)}
                className='rounded-full bg-[var(--ft-primary)] px-6 py-2.5 text-sm font-medium text-black transition-all duration-600 hover:bg-[var(--ft-btn-hover)] hover:text-white'
              >
                Sponsor a challenge
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='rounded-md p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--ft-light)] lg:hidden'
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className='border-t border-[var(--ft-header-border)] bg-[var(--ft-header-bg)] backdrop-blur-md lg:hidden'>
            <div className='space-y-3 px-6 py-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-[var(--foreground)]'>Theme</span>
                <button
                  onClick={toggleTheme}
                  className='flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ft-primary)] bg-[var(--ft-light)] text-[var(--ft-primary)]'
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>

              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='block py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--ft-primary)]'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <div className='space-y-3 pt-4'>
                <button
                  onClick={() => {
                    setIsSupportOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className='w-full rounded-full bg-[var(--ft-primary)] px-6 py-2.5 text-sm font-medium text-black hover:bg-[var(--ft-btn-hover)] hover:text-white'
                >
                  Sponsor a challenge
                </button>

                <a
                  href='contact'
                  onClick={() => setIsMenuOpen(false)}
                  className='block w-full rounded-full border border-[var(--ft-primary)] px-6 py-2.5 text-center text-sm font-medium text-[var(--ft-primary)] hover:bg-[var(--ft-primary)] hover:text-black'
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <SupportDonationDialog
        open={isSupportOpen}
        onOpenChange={setIsSupportOpen}
      />
    </>
  )
}
