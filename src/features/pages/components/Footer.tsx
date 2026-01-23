const Footer = () => {
  return (
    <footer className='relative bg-[#071004] text-white'>
      <div className='mx-auto max-w-7xl px-4 py-14 text-center'>
        <div className='mb-6 flex justify-center'>
          <img
            src='/images/light-logo.svg'
            width={200}
            height={200}
            alt='Logo'
          />
        </div>

        <nav className='mb-6'>
          <ul className='flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-300'>
            <li>
              <a href='#' className='transition hover:text-[var(--ft-primary)]'>
                GitHub Repository
              </a>
            </li>
            <li>
              <a href='#' className='transition hover:text-[var(--ft-primary)]'>
                Discord Community
              </a>
            </li>
            <li>
              <a href='#' className='transition hover:text-[var(--ft-primary)]'>
                X (Twitter)
              </a>
            </li>
          </ul>
        </nav>

        <div className='mb-4 space-y-1 text-sm text-[var(--ft-primary)]'>
          <p>Built by the Kadena community.</p>
          <p>Powered by Pact.</p>
          <p>Secured by Proof-of-Work.</p>
        </div>

        <p className='text-xs text-[var(--ft-secondary)]'>
          © 2026 All Rights Reserved by Kadena
        </p>
      </div>
    </footer>
  )
}

export default Footer
