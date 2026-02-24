import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'

type HomeLayoutProps = {
  children: React.ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <main className='bg-[var(--ft-dark-bg)] text-[var(--foreground)] transition-colors'>
          {children}
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}
