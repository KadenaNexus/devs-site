import { useEffect, useState } from 'react'

const Counter = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const isK = value.includes('K')
    const isPlus = value.includes('+')

    const target = parseFloat(value)
    const duration = 1500
    const startTime = performance.now()

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span>
      {count}
      {value.includes('K') && 'K'}
      {value.includes('+') && '+'}
    </span>
  )
}

export default Counter
