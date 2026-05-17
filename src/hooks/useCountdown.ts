import { useState, useEffect } from 'react'

interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

// Party: Tuesday 26 May 2026, 18:00 BST (UTC+1)
const PARTY_DATE = new Date('2026-05-26T18:00:00+01:00').getTime()

export function useCountdown(): CountdownValues {
  const calculate = (): CountdownValues => {
    const now = Date.now()
    const diff = PARTY_DATE - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isExpired: false }
  }

  const [countdown, setCountdown] = useState<CountdownValues>(calculate)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculate())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return countdown
}
