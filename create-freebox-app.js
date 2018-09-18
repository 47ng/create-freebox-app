import dotenv from 'dotenv'
import chalk from 'chalk'
import { checkEnv, sleep } from './helpers'
import {
  authorizeApp,
  trackAuthorizationProgress,
  getLoginChallenge,
  solveChallenge,
  login
} from './freebox'

const createFreeboxApp = async ({ freeboxURL, appId, appName, appVersion }) => {
  let trackId = null
  let appToken = null
  try {
    console.info(`Sending app authorization request to Freebox at ${freeboxURL} with parameters:
  - App ID:     ${appId}
  - App Name:   ${appName}
  - Version:    ${appVersion}
`)

    const data = await authorizeApp({
      freeboxURL,
      appId,
      appName,
      appVersion
    })
    trackId = data.trackId
    appToken = data.appToken
    process.stdout.write(
      chalk.yellow('Go to your Freebox and click "yes" on the screen')
    )
  } catch (error) {
    console.log(chalk.red(error))
    process.exit(1)
  }
  while (true) {
    await sleep(1000)
    try {
      const { status, challenge } = await trackAuthorizationProgress({
        freeboxURL,
        trackId
      })
      if (status === 'granted') {
        console.log(chalk.green('\n✓ Application authorized.'))
        break
      } else if (status === 'denied') {
        console.log(chalk.red('\nApplication rejected, aborting.'))
        process.exit(1)
      } else if (status === 'timeout') {
        console.log(chalk.yellow('\nTimeout, try again.'))
        process.exit(1)
      }
      process.stdout.write(chalk.yellow('.'))
    } catch (error) {
      console.error(error)
    }
  }
  // console.info('Logging in...')
  try {
    const { challenge } = await getLoginChallenge({ freeboxURL })
    const password = solveChallenge({ appToken, challenge })
    const { permissions } = await login({ freeboxURL, appId, password })
    console.log('\nPermissions:')
    Object.keys(permissions).map(p =>
      console.log(
        `  ${permissions[p] ? chalk.green('✓') : chalk.red('✗')} ${p}`
      )
    )
    console.log(chalk.cyan('App token:') + `\n${appToken}`)
  } catch (error) {
    console.error(error)
  }
}

// Bootstrap --

if (require.main === module) {
  // Initialize environment
  dotenv.config()
  checkEnv(['FREEBOX_URL', 'APP_ID', 'APP_NAME', 'APP_VERSION'])

  const setup = {
    freeboxURL: process.env.FREEBOX_URL,
    appId: process.env.APP_ID,
    appName: process.env.APP_NAME,
    appVersion: process.env.APP_VERSION
  }
  createFreeboxApp(setup)
}
