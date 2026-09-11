import {
  getAuthSessionUser,
  grantProductAccess,
  isOAuthReturn,
  loginWithGoogle as sharedLoginWithGoogle,
  logoutAuth as sharedLogoutAuth,
  provisionProductUser,
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

/** Beta: any signed-in Google user may enter Flashbrix. */
export async function checkMilebrickAccess(userId) {
  return Boolean(userId)
}

export async function ensureMilebrickAccess(sessionUser) {
  if (!sessionUser) return false
  try {
    await grantProductAccess({
      userId: sessionUser.id,
      productCode: PRODUCT_CODE,
      role: 'member',
      grantedBy: sessionUser.id,
    })
  } catch {
    // RLS may block self-grant; session still counts as access in beta.
  }
  try {
    await provisionProductUser(sessionUser, PRODUCT_CODE, 'member')
  } catch {
    // Profile row can wait; the app is usable.
  }
  return true
}

export async function loginWithGoogle() {
  await sharedLoginWithGoogle(`${window.location.origin}/auth/callback`)
}

export async function logoutAuth() {
  await sharedLogoutAuth()
}
