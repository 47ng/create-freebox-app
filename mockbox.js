export const authorizeApp = async ({
  freeboxURL,
  appId,
  appName,
  appVersion
}) => new Promise(resolve => resolve({ trackId: 42, appToken: 'apptoken' }))

// --

let counter = Math.floor(Math.random() * 5)

export const trackAuthorizationProgress = async ({ freeboxURL, trackId }) =>
  new Promise(resolve =>
    resolve({ status: counter-- <= 0 ? 'granted' : 'pending' })
  )

// --

export const getLoginChallenge = ({ freeboxURL }) =>
  new Promise(resolve => resolve({ challenge: 'challenge' }))

// --

export const solveChallenge = ({ appToken, challenge }) => 'password'

// --

export const login = async ({ freeboxURL, appId, password }) =>
  new Promise(resolve =>
    resolve({
      permissions: {
        foo: true,
        bar: false,
        egg: true,
        spam: true
      }
    })
  )
