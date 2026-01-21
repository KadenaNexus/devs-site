const Footer = () => {
  return (
    <footer className='relative bg-gradient-to-b from-[#081814] to-[#0b1f19]'>
      <div className='mx-auto max-w-7xl px-4 py-14 text-center'>
        <div className='mb-6 flex justify-center'>
          <img src='/images/logo.png' alt='Logo' />
        </div>

        <nav className='mb-6'>
          <ul className='flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-300'>
            <li>
              <a
                href='#'
                className='transition hover:text-[var(--frontend-primary)]'
              >
                Services.
              </a>
            </li>
            <li>
              <a
                href='#'
                className='transition hover:text-[var(--frontend-primary)]'
              >
                Work.
              </a>
            </li>
            <li>
              <a
                href='#'
                className='transition hover:text-[var(--frontend-primary)]'
              >
                Skills.
              </a>
            </li>
            <li>
              <a
                href='#'
                className='transition hover:text-[var(--frontend-primary)]'
              >
                Experience.
              </a>
            </li>
            <li>
              <a
                href='#'
                className='transition hover:text-[var(--frontend-primary)]'
              >
                Blog.
              </a>
            </li>
          </ul>
        </nav>

        <p className='text-xs text-[var(--frontend-secondary)]'>
          © 2026 All Rights Reserved by Kadena
        </p>
      </div>
    </footer>
  )
}

export default Footer
