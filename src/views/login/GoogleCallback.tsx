import { useEffect } from 'react'

const GoogleCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    window.opener?.postMessage(
      {
        source: 'google-oauth',
        auth: params.get('auth') ?? undefined,
        error: params.get('error') ?? undefined,
        message: params.get('message') ?? undefined,
      },
      window.location.origin
    )

    window.close()
  }, [])

  return null
}

export default GoogleCallback
