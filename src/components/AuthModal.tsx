'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { login, signup, loginWithGoogle, isLoading } = useAuth()

  // Prevent body scroll when modal is open and handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.classList.remove('modal-open')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name')
      return
    }

    try {
      let success = false
      if (mode === 'login') {
        success = await login(email, password)
      } else {
        success = await signup(email, password, name)
      }

      if (success) {
        onClose()
        setEmail('')
        setPassword('')
        setName('')
        setError('')
      } else {
        setError(mode === 'login' ? 'Invalid credentials' : 'Signup failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const success = await loginWithGoogle()
      if (success) {
        onClose()
        setEmail('')
        setPassword('')
        setName('')
        setError('')
      } else {
        setError('Google login failed')
      }
    } catch {
      setError('Google login failed. Please try again.')
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          transform: 'translate(0, 0)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#475569'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <X style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>

        <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#0f172a',
              marginBottom: '0.5rem',
              margin: '0 0 0.5rem 0'
            }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              margin: '0'
            }}>
              {mode === 'login'
                ? 'Sign in to access your dashboard'
                : 'Join us to manage your properties'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    width: '1.25rem',
                    height: '1.25rem'
                  }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  width: '1.25rem',
                  height: '1.25rem'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  width: '1.25rem',
                  height: '1.25rem'
                }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  placeholder="Enter your password"
                  minLength={6}
                  required
                />
              </div>
              {mode === 'signup' && (
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}>
                <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #f59e0b, #f97316)',
                color: '#1f2937',
                fontWeight: '600',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1.125rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '1.5rem 0' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: '#d1d5db'
              }}></div>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}>
                <span style={{
                  padding: '0 0.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280'
                }}>Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              color: '#374151',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              fontSize: '1rem',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'white')}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Switch mode */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', margin: '0' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={switchMode}
                style={{
                  marginLeft: '0.5rem',
                  color: '#d97706',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#b45309'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#d97706'}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo info */}
          {mode === 'login' && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#eff6ff',
              borderRadius: '0.5rem',
              border: '1px solid #bfdbfe'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#1e40af',
                fontWeight: '500',
                marginBottom: '0.5rem',
                margin: '0 0 0.5rem 0'
              }}>Demo Mode:</p>
              <p style={{
                fontSize: '0.75rem',
                color: '#1d4ed8',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Create an account or use Google login to access the dashboard.<br />
                This is a demo app with Firebase Authentication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
