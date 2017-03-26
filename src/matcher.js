const chalk = require('chalk')
const diff = require('jest-diff')
const stripAnsi = require('strip-ansi')
const { toMatchSnapshot } = require('jest-snapshot')

const isAddition = line => /^\+/.test(line)

const isDeletion = line => /^-/.test(line)

const isClassName = line => (
  (isAddition(line) || isDeletion(line)) &&
  (/\.[a-zA-Z:]+ {/.test(line) || /className="[a-zA-Z]+"/.test(line))
)

const colorize = message => (
  message.split('\n').map((line) => {
    if (isClassName(line)) {
      return chalk.white(line)
    }

    if (isAddition(line)) {
      return chalk.red(line)
    }

    if (isDeletion(line)) {
      return chalk.green(line)
    }

    return chalk.dim(line)
  }).join('\n')
)

const matcher = {

  toMatchStyledComponentsSnapshot(received) {
    const result = toMatchSnapshot.call(this, received)
    let message

    if (!result.pass) {
      message = diff(result.expected, result.actual)
      message = stripAnsi(message)
      message = colorize(message)
    }

    return { pass: result.pass, message }
  },

}

module.exports = matcher
