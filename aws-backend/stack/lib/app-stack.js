const cdk = require('@aws-cdk/core');
const { Function } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')

const { customerProfileProps, customerOrdersProps, customerAddressesProps } = require('./lambda-props')
const { dynamoGetItemPolicyProps, dynamoQueryPolicyProps } = require('./iam-props')

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Policy
    const getPolicy = new Policy(this, 'WebshopDynamoGetItemPolicy', dynamoGetItemPolicyProps)
    const queryPolicy = new Policy(this, 'WebshopDynamoQueryPolicy', dynamoQueryPolicyProps)

    // Lambda 
    const getCustomerProfileLamda = new Function(
      this, 
      'webshop-backend-get-customer-profile-lamda', 
      customerProfileProps
    )
    getCustomerProfileLamda.role.attachInlinePolicy(getPolicy)
    
    const queryCustomerOrdersLamda = new Function(
      this, 
      'webshop-backend-get-customer-orders-lamda', 
      customerOrdersProps
    )
    queryCustomerOrdersLamda.role.attachInlinePolicy(queryPolicy)
    
    const queryCustomerAddressesLamda = new Function(
      this, 
      'webshop-backend-get-customer-addresses-lamda', 
      customerAddressesProps
    )
    queryCustomerAddressesLamda.role.attachInlinePolicy(queryPolicy)
  }
}

module.exports = { AppStack }
