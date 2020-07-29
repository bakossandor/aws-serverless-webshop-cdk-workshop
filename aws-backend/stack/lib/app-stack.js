const cdk = require('@aws-cdk/core');
const { Function } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')

const { customerProfileProps } = require('./lambda-props')
const { dynamoGetItemPolicyProps } = require('./iam-props')

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Policy
    const getPolicy = new Policy(this, 'WebshopDynamoGetItemPolicy', dynamoGetItemPolicyProps)

    // Lambda 
    const getCustomerProfileLamda = new Function(
      this, 
      'webshop-backend-get-customer-profile-lamda', 
      customerProfileProps
    )
    getCustomerProfileLamda.role.attachInlinePolicy(getPolicy)

  }
}

module.exports = { AppStack }
