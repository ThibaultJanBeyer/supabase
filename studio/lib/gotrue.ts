import { GoTrueClient, User } from '@supabase/gotrue-js'

export const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'supabase.dashboard.auth.token'

export const auth = new GoTrueClient({
  url: process.env.NEXT_PUBLIC_GOTRUE_URL,
  storageKey: STORAGE_KEY,
  detectSessionInUrl: true,
})

export const getAuthUser = async (token: String): Promise<any> => {
  try {
    const {
      data: { user },
      error,
    } = await auth.getUser(token.replace('Bearer ', ''))
    if (error) throw error

    return { user, error: null }
  } catch (err) {
    console.log(err)
    return { user: null, error: err }
  }
}

export const getAuth0Id = (provider: String, providerId: String): String => {
  return `${provider}|${providerId}`
}

export const getIdentity = (gotrueUser: User) => {
  try {
    if (gotrueUser !== undefined && gotrueUser.identities !== undefined) {
      return { identity: gotrueUser.identities[0], error: null }
    }
    throw 'Missing identity'
  } catch (err) {
    return { identity: null, error: err }
  }
}

// NOTE: do not use any imports in this function,
// as it is use standalone in the documents head
export const getNextPath = () => {
  if (typeof window === 'undefined') {
    // make sure this method is SSR safe
    return '/projects'
  }

  const searchParams = new URLSearchParams(location.search)
  const returnTo = searchParams.get('next')

  searchParams.delete('next')

  const next = returnTo ?? '/projects'
  const remainingSearchParams = searchParams.toString()

  if (next === 'new-project') {
    return '/new/new-project' + (remainingSearchParams ? `?${remainingSearchParams}` : '')
  }

  return next + (remainingSearchParams ? `?${remainingSearchParams}` : '')
}
