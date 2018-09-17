import chalk from 'chalk'

const checkEnvDefaultOptions = {
  exit: true,
  onFirstError: false,
  exitCode: 1
}

export const checkEnv = (vars = [], options = checkEnvDefaultOptions) => {
  let success = true
  vars.forEach(name => {
    if (!process.env[name]) {
      console.error(chalk.red(`Missing required environment variable ${name}`))
      if (options.exit && options.onFirstError) {
        process.exit(options.exitCode || 1)
      }
      success = false
    }
  })
  if (!success && options.exit) {
    process.exit(options.exitCode || 1)
  }
}

// --

export const sleep = timeMs =>
  new Promise(resolve => setTimeout(() => resolve(), timeMs))
