import {
  ensureProductAccess,
  getAuthSessionUser,
  hasProductAccess,
  isOAuthReturn,
  loginWithGoogle as sharedLoginWithGoogle,
  logoutAuth as sharedLogoutAuth,
  subscribeToAuthChanges,
} from '@gestalt/auth'

const PRODUCT_CODE = 'milebrick'

export { isOAuthReturn }

export function subscribeToMilebrickAuthChanges(callback) {
  return subscribeToAuthChanges((sessionUser, event) => {
    callback(sessionUser, event)
  })
}

export async function getMilebrickSessionUser() {
  const sessionUser = await getAuthSessionUser()
  if (!sessionUser) return null

  return {
    id: sessionUser.id,
    email: sessionUser.email ?? '',
    name: sessionUser.user_metadata?.full_name
      ?? sessionUser.user_metadata?.name
      ?? sessionUser.email?.split('@')[0]
      ?? 'Usuário',
  }
}

export async function checkMilebrickAccess(userId) {
  return hasProductAccess(userId, PRODUCT_CODE)
}

export async function ensureMilebrickAccess(sessionUser) {
  if (!sessionUser) return false
  return ensureProductAccess(sessionUser, PRODUCT_CODE)
}

export async function loginWithGoogle() {
  await sharedLoginWithGoogle(`${window.location.origin}/auth/callback`)
}

export async function logoutAuth() {
  await sharedLogoutAuth()
}
