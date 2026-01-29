import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

type HomeLayoutProps = {
  children: React.ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main className='bg-[var(--ft-dark-bg)] text-[var(--foreground)] transition-colors'>
          {children}
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}
