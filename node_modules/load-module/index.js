/**
 * Node's `require` with a few extra features:
 * - You can specify additional folders in which to search for modules
 * - You can specify a module prefix
 * @module load-module
 * @example
 * > const loadModule = require('load-module')
 *
 * > loadModule('react-dom')
 *
 * > loadModule('dom', { prefix: 'react-' })
 *
 * > loadModule('something.js', { paths: '.' })
 *
 * > loadModule('something.js', { paths: [ '.', '~/my-modules' ] })
 */
module.exports = loadModule

/**
 * @alias module:load-module
 * @param {string} - The module name, directory or file to load.
 * @param {object} [options]
 * @param {string} [options.prefix] - Also attempt to load the given module name with this prefix.
 * @param {string|string[]} [options.paths] - One or more additional directories in which to search for modules.
 */
function loadModule (request, options) {
  if (typeof request !== 'string') {
    throw new Error('request expected')
  }
  options = options || {}
  const arrayify = require('array-back')
  const prefix = options.prefix
  const paths = options.paths ? arrayify(options.paths) : undefined
  const origModulePaths = module.paths
  if (paths && paths.length) {
    module.paths = module.paths.concat(paths)
  }
  let output

  if (prefix) {
    /* Try first with the prefix then without */
    try {
      output = require(require.resolve(`${options.prefix}${request}`, { paths }))
    } catch (err) {
      output = require(require.resolve(request, { paths }))
    }
  } else {
    output = require(require.resolve(request, { paths }))
  }

  module.paths = origModulePaths
  return output
}
