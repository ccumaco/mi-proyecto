import { createBrowserClient } from '@supabase/ssr'

export const createClientBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
          return cookie ? cookie.split('=')[1] : null
        },
        set(name: string, value: string, options: any) {
          let cookieString = `${name}=${value}; Path=${options.path || '/'}`
          if (options.expires) {
            cookieString += `; Expires=${options.expires.toUTCString()}`
          }
          if (options.domain) {
            cookieString += `; Domain=${options.domain}`
          }
          if (options.secure) {
            cookieString += `; Secure`
          }
          if (options.sameSite) {
            cookieString += `; SameSite=${options.sameSite}`
          }
          document.cookie = cookieString
        },
        remove(name: string, options: any) {
          document.cookie = `${name}=; Path=${options.path || '/'}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        },
      },
    }
  )
