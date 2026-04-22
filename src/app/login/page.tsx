'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dumbbell } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    // Read directly from the DOM — iOS autofill doesn't always fire onChange
    const value = (inputRef.current?.value ?? email).trim()
    if (!value) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setEmail(value)
      setSubmitted(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--color-surface)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#84cc16' }}>
            <Dumbbell size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            Workout Planner
          </span>
        </div>

        {submitted ? (
          <div>
            <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Check your email
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail('') }}
              className="mt-6 text-sm font-medium"
              style={{ color: '#84cc16' }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              Sign in
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
              Enter your email to receive a magic link.
            </p>

            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Email address
            </label>
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border focus:border-lime-500"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />

            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: loading ? '#65a30d' : '#84cc16' }}
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
