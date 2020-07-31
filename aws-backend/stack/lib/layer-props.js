const { Runtime, Code } = require('@aws-cdk/aws-lambda')
const path = require('path')

const layerProps = {
  code: Code.fromAsset(path.join(__dirname, '..', 'layer')),
  compatibleRuntimes: [Runtime.NODEJS_10_X, Runtime.NODEJS_12_X],
  license: 'Apache-2.0',
  description: 'Auxiliaries to the POC webshop backend',
}

module.exports = {layerProps}