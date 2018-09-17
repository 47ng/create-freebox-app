import axios from 'axios'
import crypto from 'crypto'

export const authorizeApp = async ({
  freeboxURL,
  appId,
  appName,
  appVersion
}) => {
  try {
    const url = `${freeboxURL}/api/v4/login/authorize/`
    const data = {
      app_id: appId,
      app_name: appName,
      app_version: appVersion,
      device_name: process.env.DEVICE_NAME || 'Docker'
    }
    const res = await axios.post(url, data)
    if (res.data && res.data.success) {
      const trackId = res.data.result.track_id
      const appToken = res.data.result.app_token
      return { freeboxURL, trackId, appToken }
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

// --

export const trackAuthorizationProgress = async ({ freeboxURL, trackId }) => {
  const url = `${freeboxURL}/api/v4/login/authorize/${trackId}`
  return axios
    .get(url)
    .then(response => response.data)
    .then(data => (data.success ? data.result : new Error(data)))
}

// --

export const login = async ({ freeboxURL, appId, appToken }) => {
  const url = `${freeboxURL}/api/v4/login/`
  return axios
    .get(url)
    .then(response => response.data)
    .then(data => (data.success ? data.result : new Error(data)))
    .then(({ logged_in, challenge }) => {
      if (logged_in) {
        console.log('Already logged in')
        return
      }
      const password = crypto
        .createHmac('sha1', appToken)
        .update(challenge)
        .digest('hex')
      const sessionUrl = `${freeboxURL}/api/v4/login/session`
      const data = {
        app_id: appId,
        password
      }
      return axios
        .post(sessionUrl, data)
        .then(response => response.data)
        .then(data => (data.success ? data.result : new Error(data)))
        .then(({ session_token, permissions }) => ({
          sessionToken: session_token,
          permissions
        }))
    })
}
