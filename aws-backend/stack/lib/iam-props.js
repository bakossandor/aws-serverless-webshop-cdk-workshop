const { PolicyStatement, Effect } = require('@aws-cdk/aws-iam')

const { dynamoTableArn } = require('../.env.js')

const dynamoGetItemPolicyProps = {
  policyName: 'WebshopDynamoGetItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:GetItem'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}

module.exports = {
  dynamoGetItemPolicyProps,
}