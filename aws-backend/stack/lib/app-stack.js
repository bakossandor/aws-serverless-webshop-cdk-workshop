const cdk = require('@aws-cdk/core');
const { Function, LayerVersion } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')

const { 
  customerProfileProps, 
  customerOrdersProps, 
  customerAddressesProps,
  postCustomerAddressesProps,
  deleteCustomerAddressesProps,
  postCustomerOrderProps,
} = require('./lambda-props')
const { 
  dynamoGetItemPolicyProps, 
  dynamoQueryPolicyProps,
  dynamoPutItemPolicyProps,
  dynamoDeleteItemPolicyProps,
  dynamoBatchGetItemItemPolicyProps,
} = require('./iam-props')
const { layerProps } = require('./layer-props')

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Policy
    const getPolicy = new Policy(this, 'WebshopDynamoGetItemPolicy', dynamoGetItemPolicyProps)
    const queryPolicy = new Policy(this, 'WebshopDynamoQueryPolicy', dynamoQueryPolicyProps)
    const putPolicy = new Policy(this, 'WebshopDynamoPutItemPolicy', dynamoPutItemPolicyProps)
    const deletePolicy = new Policy(this, 'WebshopDynamoDeleteItemPolicy', dynamoDeleteItemPolicyProps)
    const batchGetItemPolicy = new Policy(this, 'WebshopDynamoBatchGetItemPolicy', dynamoBatchGetItemItemPolicyProps)

    // Lambda Layer
    const auxiliariesLayer = new LayerVersion(this, 'AuxiliariesLayer', layerProps)

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
    
    const postCustomerAddressesLamda = new Function(
      this, 
      'webshop-backend-post-customer-addresses-lamda', 
      postCustomerAddressesProps
    )
    postCustomerAddressesLamda.role.attachInlinePolicy(putPolicy)
    postCustomerAddressesLamda.addLayers(auxiliariesLayer)
    
    const deleteCustomerAddressesLamda = new Function(
      this,
      'webshop-backend-delete-customer-addresses-lamda', 
      deleteCustomerAddressesProps
    )
    deleteCustomerAddressesLamda.role.attachInlinePolicy(deletePolicy)

    const postCustomerOrderLamda = new Function(
      this, 
      'webshop-backend-post-customer-order-lamda', 
      postCustomerOrderProps
    )
    postCustomerOrderLamda.role.attachInlinePolicy(putPolicy)
    postCustomerOrderLamda.role.attachInlinePolicy(batchGetItemPolicy)
    postCustomerOrderLamda.addLayers(auxiliariesLayer)
  }
}

module.exports = { AppStack }
