import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type DateTimePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
}

export function DateTimePicker({
  selected,
  onSelect,
  placeholder = 'Pick a date and time',
  disabled,
}: DateTimePickerProps) {
  const [time, setTime] = useState<string>(
    selected ? format(selected, 'HH:mm') : '00:00'
  )

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onSelect(undefined)
      return
    }

    const [hours, minutes] = time.split(':').map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours || 0, minutes || 0, 0, 0)
    onSelect(newDate)
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (selected) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(selected)
      newDate.setHours(hours || 0, minutes || 0, 0, 0)
      onSelect(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!selected}
          className='data-[empty=true]:text-muted-foreground w-full justify-start text-start font-normal'
        >
          {selected ? (
            format(selected, 'MMM d, yyyy HH:mm')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          selected={selected}
          onSelect={handleDateSelect}
          disabled={disabled}
        />
        <div className='border-t border-border p-3'>
          <Label htmlFor='time-picker' className='text-sm'>
            Time
          </Label>
          <div className='flex items-center gap-2 mt-2'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <Input
              id='time-picker'
              type='time'
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className='w-full'
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
