const cdk = require('@aws-cdk/core');
const { UserPool, UserPoolClient } = require('@aws-cdk/aws-cognito')
const { Function } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')

const {
  userPoolProps,
  userPoolClientProps,
  dynamoPutItemPolicyProps,
  postConfirmationFunctionProps
} = require('./cognito-props')

class CognitoStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    // The code that defines your stack goes here
    const putPolicy = new Policy(
      this,
      'CognitoWebshopDynamoPutItemPolicy',
      dynamoPutItemPolicyProps
    )

    const postConfirmationLambda = new Function(
      this, 
      'webshop-userpool-congito-post-confirmatin',
      postConfirmationFunctionProps
    )
    postConfirmationLambda.role.attachInlinePolicy(putPolicy)

    const userPool = new UserPool(this, 'webshop-userpool', userPoolProps(postConfirmationLambda));

    const userPoolClient = new UserPoolClient(
      this, 
      'webshop-userpool-client-001',
      userPoolClientProps(userPool)  
    )
  }
}

module.exports = { CognitoStack }
