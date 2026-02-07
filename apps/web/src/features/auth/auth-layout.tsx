import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid min-h-svh max-w-none items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px] md:w-[480px]'>
        <div className='flex flex-col items-center justify-center space-y-2 text-center'>
          <div className='flex items-center justify-center gap-2'>
            <Logo className='h-8 w-8' />
            <h1 className='text-2xl font-semibold tracking-tight'>Kadena Challenge</h1>
          </div>
          <p className='text-muted-foreground text-sm'>Welcome to the platform</p>
        </div>
        {children}
      </div>
    </div>
  )
}
