import Header from './components/Header'
import Footer from './components/Footer'

type HomeLayoutProps = {
  children: React.ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
    <Header/>
      <main className='bg-[#0D1D18] pt-[65px]'>
          {children}
      </main>
      <Footer />
    </>
  )
}
