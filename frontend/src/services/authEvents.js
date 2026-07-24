// Small event bridge so api.js (a plain module, not a component) can trigger
// a forced logout when token refresh fails, without importing AuthContext
// directly and creating a circular dependency.

let logoutHandler = null

export const setLogoutHandler = (fn) => {
  logoutHandler = fn
}

export const triggerForcedLogout = () => {
  if (logoutHandler) logoutHandler()
}