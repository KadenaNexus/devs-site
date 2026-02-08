'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const ADDRESSES = [
  {
    label: 'USDT (BEP20)',
    value: '0x8F4Dc858dDCd30e9D82a720c104b4f03A0AdF19D',
  },
]

export function SupportDonationDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Fuel Innovation in the Dev Community Now </DialogTitle>
        </DialogHeader>

        <p className='text-muted-foreground text-sm'>
          Support developers. Sponsor challenges. Accelerate innovation
        </p>

        <div className='space-y-4'>
          {ADDRESSES.map((item) => (
            <div key={item.label} className='bg-muted/40 rounded-lg border p-3'>
              <div className='text-muted-foreground mb-1 text-xs font-semibold uppercase'>
                {item.label}
              </div>

              <div className='grid grid-cols-[1fr_auto] items-start gap-3'>
                <code className='text-sm leading-relaxed break-all select-all'>
                  {item.value}
                </code>

                <Button
                  size='icon'
                  variant='outline'
                  className='shrink-0'
                  onClick={() => copy(item.value)}
                >
                  <Copy size={16} />
                </Button>
              </div>

              {copied === item.value && (
                <p className='mt-1 text-xs text-green-600'>Copied!</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
