const cdk = require('@aws-cdk/core');
const { Function, LayerVersion, CfnPermission } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')
const {
  HttpApi,
  CfnAuthorizer,
  CfnRoute,
  CfnIntegration
 } = require('@aws-cdk/aws-apigatewayv2')

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
const { httpApiProps } = require('./http-api-props')
const { identityIssuer, identiyAudience } = require('../.env.js')
const createRoute = require('./create-route')

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

    // Adding the HTTP API
    const httpApi = new HttpApi(this, 'HttpApi', httpApiProps);
    
    // Adding the Authorizer
    const authorizer = new CfnAuthorizer(this, 'HttpAPIAuthorizer', {
      'name': 'HttpAPIAuthorizer',
      'apiId': httpApi.httpApiId,
      'authorizerType': 'JWT',
      'identitySource': ['$request.header.Authorization'],
      'jwtConfiguration': {
        'audience': [identiyAudience],
        'issuer': identityIssuer
      }
    })

    // Routes to the API
    const getCustomerProfileIntegration = new CfnIntegration(this, "getCustomerProfileIntegration", {
      apiId: httpApi.httpApiId,
      integrationType: "AWS_PROXY",
      integrationUri: getCustomerProfileLamda.functionArn,
      payloadFormatVersion: '2.0'
    })

    const getCustomerProfileRoute = new CfnRoute(this, "getCustomerProfileRoute", {
      'apiId': httpApi.httpApiId,
      'routeKey': 'GET /customer/profile',
      'target': `integrations/${getCustomerProfileIntegration.ref}`,
      'authorizerId': authorizer.ref,
      'authorizationType': 'JWT',
    })

    const getCustomerPermission = new CfnPermission(this, "customerPermission", {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: getCustomerProfileLamda.functionArn,
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${httpApi.httpApiId}/*/*/customer/profile`
    })

    // Custom Rute Add method

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: queryCustomerOrdersLamda,
      integrationId: 'GetCustomerOrdersIntegration',
      routeId: 'GetCustomerOrdersRoute',
      permissionId: 'GetCustomerOrdersPermission',
      method: 'GET',
      path: '/customer/orders',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: queryCustomerAddressesLamda,
      integrationId: 'GetCustomerAddressesIntegration',
      routeId: 'GetCustomerAddressesRoute',
      permissionId: 'GetCustomerAddressesPermission',
      method: 'GET',
      path: '/customer/addresses',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: postCustomerOrderLamda,
      integrationId: 'PostCustomerOrderIntegration',
      routeId: 'PostCustomerOrderRoute',
      permissionId: 'PostCustomerOrderPermission',
      method: 'POST',
      path: '/customer/orders',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: postCustomerAddressesLamda,
      integrationId: 'PostCustomerAddressesIntegration',
      routeId: 'PostCustomerAddressesRoute',
      permissionId: 'PostCustomerAddressesPermission',
      method: 'POST',
      path: '/customer/addresses',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: deleteCustomerAddressesLamda,
      integrationId: 'DeleteCustomerAddressesIntegration',
      routeId: 'DeleteCustomerAddressesRoute',
      permissionId: 'DeleteCustomerAddressesPermission',
      method: 'DELETE',
      path: '/customer/addresses',
    })
  }
}

module.exports = { AppStack }
