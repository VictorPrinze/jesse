import { useCountdown } from '../hooks/useCountdown'

interface UnitProps {
  value: number
  label: string
}

function Unit({ value, label }: UnitProps) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-playfair font-black text-gold leading-none tabular-nums"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
      >
        {display}
      </span>
      <span className="font-mono text-[0.6rem] tracking-[0.25em] text-cream/40 uppercase mt-1">
        {label}
      </span>
    </div>
  )
}

export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown()

  if (isExpired) {
    return (
      <p className="font-playfair italic text-gold text-2xl animate-pulse">
        The party is happening right now! 🥂
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3 justify-center flex-nowrap">
      <Unit value={days} label="Days" />
      <span className="text-gold/40 font-playfair text-2xl leading-none mb-4">·</span>
      <Unit value={hours} label="Hours" />
      <span className="text-gold/40 font-playfair text-2xl leading-none mb-4">·</span>
      <Unit value={minutes} label="Minutes" />
      <span className="text-gold/40 font-playfair text-2xl leading-none mb-4">·</span>
      <Unit value={seconds} label="Seconds" />
    </div>
  )
}