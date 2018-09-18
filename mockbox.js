export const authorizeApp = ({ freeboxURL, appId, appName, appVersion }) =>
  Promise.resolve({ trackId: 42, appToken: 'apptoken' }))

// --

let counter = Math.floor(Math.random() * 5)

export const trackAuthorizationProgress = ({ freeboxURL, trackId }) =>
  Promise.resolve({ status: counter-- <= 0 ? 'granted' : 'pending' })

// --

export const getLoginChallenge = ({ freeboxURL }) =>
  Promise.resolve({ challenge: 'challenge' }))

// --

export const solveChallenge = ({ appToken, challenge }) => 'password'

// --

export const login = ({ freeboxURL, appId, password }) =>
  Promise.resolve({
      permissions: {
        foo: true,
        bar: false,
        egg: true,
        spam: true
      }
    })
  )

// --

export const logout = ({ freeboxURL, sessionToken }) => Promise.resolve(null)
