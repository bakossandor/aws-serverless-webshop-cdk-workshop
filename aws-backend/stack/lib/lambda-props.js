const { Runtime, Code } = require("@aws-cdk/aws-lambda")
const path = require('path')

const customerProfileProps = {
    runtime: Runtime.NODEJS_12_X,
    handler: 'customer-profile.handler',
    code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
}

const customerOrdersProps = {
  runtime: Runtime.NODEJS_12_X,
  handler: 'customer-orders.handler',
  code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
}

const customerAddressesProps = {
  runtime: Runtime.NODEJS_12_X,
  handler: 'customer-addresses.handler',
  code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
}

module.exports = {
  customerAddressesProps,
  customerProfileProps,
  customerOrdersProps,
}
