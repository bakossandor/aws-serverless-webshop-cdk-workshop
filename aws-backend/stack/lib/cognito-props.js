const { PolicyStatement, Effect } = require('@aws-cdk/aws-iam')
const { Runtime, Code } = require("@aws-cdk/aws-lambda")
const path = require('path')

const { dynamoTableArn } = require('../.env.js')

const userPoolProps = (lambda) => {
  return {
    selfSignUpEnabled: true,
    standardAttributes: {
      fullname: {
        required: true,
        mutable: true,
      },
      phoneNumber: {
        required: true,
        mutable: true,
      }
    },
    signInAliases: {
      email: true,
    },
    userVerification: {
      emailStyle: 'LINK',
    },
    lambdaTriggers: {
      postConfirmation: lambda
    }
  }
}

const userPoolClientProps = (userPool) => {
  return {
    userPool: userPool,
    authFlows: {
      refreshToken: true,
      userSrp: true,
      userPassword: true
    },
    generateSecret: false,
  }
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

const postConfirmationFunctionProps = {
  runtime: Runtime.NODEJS_12_X,
  handler: 'cognito-post-confirmation.handler',
  code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
}

module.exports = {
  userPoolProps,
  userPoolClientProps,
  postConfirmationFunctionProps,
  dynamoPutItemPolicyProps
}
