'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navItems = [
    { name: 'Services', href: '#services' },
    { name: 'Works', href: '#works' },
    { name: 'Resume', href: '#resume' },
    { name: 'Skills', href: '#skills' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 py-[15px] transition-all duration-300 ${
        isScrolled ? 'bg-black/80 shadow-lg backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className='mx-auto max-w-[1296px] px-[15px]'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex-shrink-0'>
            <a href='#' className='flex items-center space-x-2'>
              <img src='/images/logo.png' alt='Logo' />
            </a>
          </div>

          <nav className='hidden items-center space-x-8 lg:flex'>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='text-sm font-medium text-white transition-colors hover:text-[#00BA7C]'
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className='ml-8 hidden items-center lg:flex'>
            <a
              href='#contact'
              className='rounded-full bg-[var(--frontend-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--frontend-btn-hover)]'
            >
              Hire me!
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='rounded-md p-2 text-white transition-colors hover:bg-gray-800 lg:hidden'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className='border-t border-gray-800 bg-black lg:hidden'>
          <div className='space-y-3 px-6 py-4'>
            <a
              href='mailto:mail@geroiddesign.com'
              className='block border-b border-gray-800 pb-3 text-sm text-white transition-colors hover:text-gray-300'
            >
              mail@geroiddesign.com
            </a>

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='block py-2 text-sm font-medium text-white transition-colors hover:text-gray-300'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <a
              href='#contact'
              className='mt-4 block rounded-full bg-[var(--frontend-primary)] px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[var(--frontend-btn-hover)]'
              onClick={() => setIsMenuOpen(false)}
            >
              Hire me!
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
