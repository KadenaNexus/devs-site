import { FiGithub, FiTwitter } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='relative bg-[#071004] text-white'>
      <div className='mx-auto max-w-7xl px-4 py-16 text-center'>
        {/* Logo */}
        <div className='mb-8 flex justify-center footer-logo-sec'>
          <img
            src='/images/logo.png'
            width={200}
            height={200}
            alt='Kadena Logo'
            className='opacity-90'
          />
        </div>

        {/* Navigation Links */}
        <nav className='mb-8'>
          <ul className='flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-gray-300'>
            <li>
              <a
                href='#'
                className='flex items-center gap-2 transition hover:text-[var(--ft-primary)]'
              >
                <FiGithub className='h-4 w-4' />
                GitHub Repository
              </a>
            </li>

            <li>
              <a
                href='#'
                className='flex items-center gap-2 transition hover:text-[var(--ft-primary)]'
              >
                <FaDiscord className='h-4 w-4' />
                Discord Community
              </a>
            </li>

            <li>
              <a
                href='#'
                className='flex items-center gap-2 transition hover:text-[var(--ft-primary)]'
              >
                <FiTwitter className='h-4 w-4' />
                X (Twitter)
              </a>
            </li>
          </ul>
        </nav>

        {/* Trust / Tech Signals */}
        <div className='mb-6 space-y-1 text-sm text-[var(--ft-primary)]'>
          <p>Built by the Kadena community.</p>
          <p>Powered by Pact smart contracts.</p>
          <p>Secured by Proof-of-Work.</p>
        </div>

        {/* Copyright */}
        <p className='text-xs text-[var(--ft-secondary)]'>
          © 2026 All Rights Reserved by Kadena
        </p>
      </div>
    </footer>
  )
}

export default Footer
