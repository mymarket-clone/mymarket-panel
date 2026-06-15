import type { User } from '../types/User'

type GoogleCallbackMessage = {
  source: 'google-oauth'
  auth?: string
  error?: string
  message?: string
}

const decodeAuth = (payload: string): User => {
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  return JSON.parse(atob(padded)) as User
}

export const signInWithGoogle = async (): Promise<User> => {
  const redirectUri = `${window.location.origin}/google-callback`
  const apiUrl = import.meta.env.VITE_API_URL || ''
  const startUrl = `${apiUrl}/api/auth/google/panel/start?returnUrl=${encodeURIComponent(redirectUri)}`

  const popup = window.open(startUrl, 'google-login', 'width=500,height=650')

  if (!popup) throw new Error('Google popup was blocked.')

  return new Promise<User>((resolve, reject) => {
    const timer = window.setInterval(() => {
      if (popup.closed) {
        cleanup()
        reject(new Error('Google sign-in was cancelled.'))
      }
    }, 500)

    const cleanup = (): void => {
      window.clearInterval(timer)
      window.removeEventListener('message', onMessage)
    }

    const onMessage = (event: MessageEvent<GoogleCallbackMessage>): void => {
      if (event.origin !== window.location.origin || event.data?.source !== 'google-oauth') return

      cleanup()
      popup.close()

      if (event.data.error) {
        reject(new Error(event.data.message || event.data.error))
        return
      }

      if (!event.data.auth) {
        reject(new Error('Invalid Google response.'))
        return
      }

      resolve(decodeAuth(event.data.auth))
    }

    window.addEventListener('message', onMessage)
  })
}
