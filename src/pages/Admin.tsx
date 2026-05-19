import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://otvtxkaojtsyonnyzfnk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mv6z4uMeRYAh3YAZyfixCw_0i14zXku'
const ADMIN_PASSWORD = 'jesse26'
const MAX_ATTENDANCE = 50

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface RSVP {
  id: string
  name: string
  attending: boolean
  created_at: string
}

async function sbFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json().catch(() => null)
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
      setPw('')
    }
  }

  const fetchRSVPs = async () => {
    setLoading(true)
    try {
      const data = await sbFetch('rsvps?select=*&order=created_at.desc')
      setRsvps(Array.isArray(data) ? data : [])
    } catch {
      setRsvps([])
    }
    setLoading(false)
  }

  // Realtime subscription so admin sees live updates too
  useEffect(() => {
    if (!authed) return

    fetchRSVPs()

    const channel = supabase
      .channel('admin-rsvp-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rsvps' },
        () => {
          // Re-fetch full list so admin table stays in sync
          fetchRSVPs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [authed])

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this RSVP?')) return
    setDeleting(id)
    setDeleteError(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvps?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          // No Content-Type or Prefer header on DELETE — avoids Supabase returning 406
        },
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText)
      }
      // Optimistically remove from local state immediately
      setRsvps(r => r.filter(x => x.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
      setDeleteError('Delete failed. Make sure you added the DELETE policy in Supabase SQL editor:  create policy "Anyone can delete" on rsvps for delete using (true);')
    }
    setDeleting(null)
  }

  const exportCSV = () => {
    const rows = [
      ['Name', 'Attending', 'Date'].join(','),
      ...rsvps.map(r =>
        [`"${r.name}"`, r.attending ? 'Yes' : 'No', new Date(r.created_at).toLocaleDateString()].join(',')
      ),
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }))
    a.download = 'jesse-rsvps.csv'
    a.click()
  }

  const filtered = rsvps.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )
  const count = rsvps.length
  const pct = Math.min((count / MAX_ATTENDANCE) * 100, 100)

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a0a0a' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="font-playfair text-cream text-3xl mb-2">Admin Access</h1>
          <p className="font-cormorant italic text-cream/40 text-lg mb-8">Jesse's RSVP Dashboard</p>

          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <input
              type="password"
              placeholder="Password..."
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-xl font-mono text-sm text-cream placeholder-cream/30 outline-none mb-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: pwError ? '1px solid #ef4444' : '1px solid rgba(201,168,76,0.3)',
              }}
            />
            <AnimatePresence>
              {pwError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[0.65rem] text-red-400 mb-3"
                >
                  Wrong password. Try again.
                </motion.p>
              )}
            </AnimatePresence>
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl font-mono text-sm tracking-widest font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e879f9)', color: '#0a0a0a' }}
            >
              Enter
            </button>
          </div>

          <a
            href="/"
            className="block mt-6 font-mono text-[0.65rem] tracking-widest text-cream/25 hover:text-cream/40 transition-colors"
          >
            ← Back to invitation
          </a>
        </motion.div>
      </div>
    )
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#0a0a0a', fontFamily: 'Cormorant Garamond, serif' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-playfair text-cream text-3xl">RSVP Dashboard</h1>
            <p className="font-mono text-[0.65rem] tracking-widest text-gold uppercase mt-1">Jesse's 26th · Admin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchRSVPs}
              className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider text-cream/60 hover:text-cream transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ↺ Refresh
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c' }}
            >
              ↓ CSV
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider text-cream/40 hover:text-cream/70 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              ← Site
            </a>
          </div>
        </div>

        {/* Delete error banner */}
        <AnimatePresence>
          {deleteError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl font-mono text-xs text-red-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              ⚠️ {deleteError}
              <button
                onClick={() => setDeleteError(null)}
                className="ml-4 underline opacity-60 hover:opacity-100"
              >
                dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Confirmed', value: count, color: '#c9a84c' },
            { label: 'Spots Left', value: MAX_ATTENDANCE - count, color: count >= MAX_ATTENDANCE ? '#ef4444' : '#34d399' },
            { label: 'Capacity', value: `${Math.round(pct)}%`, color: '#e879f9' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="font-playfair font-bold text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="font-mono text-[0.6rem] tracking-widest text-cream/40 uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[0.6rem] tracking-widest text-cream/40 uppercase">Attendance</span>
            <span className="font-mono text-[0.6rem] tracking-widest text-cream/40">{count} / {MAX_ATTENDANCE}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full"
              style={{
                background: count >= MAX_ATTENDANCE
                  ? '#ef4444'
                  : 'linear-gradient(90deg, #c9a84c, #e879f9)',
              }}
            />
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl font-mono text-sm text-cream placeholder-cream/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 font-cormorant italic text-cream/30 text-xl">
            Loading RSVPs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 font-cormorant italic text-cream/30 text-xl">
            {search ? 'No matches found.' : 'No RSVPs yet. Share the invitation!'}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Table header */}
            <div
              className="grid grid-cols-12 px-4 py-2 font-mono text-[0.6rem] tracking-widest text-cream/30 uppercase"
              style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="col-span-1">#</span>
              <span className="col-span-5">Name</span>
              <span className="col-span-4">Date</span>
              <span className="col-span-2 text-right">Action</span>
            </div>

            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0, padding: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 px-4 py-3 items-center"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                >
                  <span className="col-span-1 font-mono text-[0.65rem] text-cream/30">{i + 1}</span>
                  <span className="col-span-5 font-cormorant text-cream text-lg">{r.name}</span>
                  <span className="col-span-4 font-mono text-[0.65rem] text-cream/40">
                    {new Date(r.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      className="font-mono text-[0.6rem] tracking-wider px-3 py-1 rounded-lg transition-all hover:bg-red-900/30 disabled:opacity-40"
                      style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      {deleting === r.id ? '...' : 'Remove'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <p className="font-mono text-[0.6rem] tracking-widest text-cream/15 text-center mt-8">
          jesse's 26th · admin panel · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}