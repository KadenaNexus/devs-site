import Footer from './components/Footer'
import Header from './components/Header'

type HomeLayoutProps = {
  children: React.ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />
      <main className='bg-[var(--ft-dark-bg)] pt-[65px] text-[var(--foreground)] transition-colors'>
        {children}
      </main>
      <Footer />
    </>
  )
}
