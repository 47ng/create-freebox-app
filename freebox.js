import axios from 'axios'
import crypto from 'crypto'

export const authorizeApp = ({ freeboxURL, appId, appName, appVersion }) => {
  const url = `${freeboxURL}/api/v4/login/authorize/`
  const data = {
    app_id: appId,
    app_name: appName,
    app_version: appVersion,
    device_name: process.env.DEVICE_NAME || 'Docker'
  }
  return axios
    .post(url, data)
    .then(response => response.data)
    .then(data => (data.success ? data.result : new Error(data)))
    .then(({ track_id, app_token }) => ({
      trackId: track_id,
      appToken: app_token
    }))
}

// --

export const trackAuthorizationProgress = ({ freeboxURL, trackId }) => {
  const url = `${freeboxURL}/api/v4/login/authorize/${trackId}`
  return axios
    .get(url)
    .then(response => response.data)
    .then(data => (data.success ? data.result : new Error(data)))
}

// --

export const getLoginChallenge = ({ freeboxURL }) => {
  const url = `${freeboxURL}/api/v4/login/`
  return axios
    .get(url)
    .then(response => response.data)
    .then(data => (data.success ? data.result : new Error(data)))
}

// --

export const solveChallenge = ({ appToken, challenge }) =>
  crypto
    .createHmac('sha1', appToken)
    .update(challenge)
    .digest('hex')

// --

export const login = ({ freeboxURL, appId, password }) => {
  const url = `${freeboxURL}/api/v4/login/session`
  const data = {
    app_id: appId,
    password
  }
  return axios
    .post(url, data)
    .then(response => response.data)
    .then(data => (data.success ? data.result : new Error(data)))
    .then(({ session_token, permissions }) => ({
      sessionToken: session_token,
      permissions
    }))
}

// --

export const logout = ({ freeboxURL, sessionToken }) => {
  const url = `${freeboxURL}/api/v4/login/logout`
  const headers = {
    'X-Fbx-App-Auth': sessionToken
  }
  return axios
    .post(url, null, { headers })
    .then(response => response.data)
    .then(data => (data.success ? null : new Error(data)))
}
