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

const dynamoQueryPolicyProps = {
  policyName: 'WebshopDynamoQueryItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:Query'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}

const dynamoPutItemPolicyProps = {
  policyName: 'WebshopDynamoPutItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:PutItem'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}

const dynamoDeleteItemPolicyProps = {
  policyName: 'WebshopDynamoDeleteItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:DeleteItem'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}

const dynamoBatchGetItemItemPolicyProps = {
  policyName: 'WebshopDynamoBatchGetItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:BatchGetItem'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}


module.exports = {
  dynamoGetItemPolicyProps,
  dynamoQueryPolicyProps,
  dynamoPutItemPolicyProps,
  dynamoDeleteItemPolicyProps,
  dynamoBatchGetItemItemPolicyProps
}
