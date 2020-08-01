const cdk = require('@aws-cdk/core');
const { Function, LayerVersion, CfnPermission } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')
const { 
  LambdaProxyIntegration,
  HttpMethod,
  HttpApi,
  CfnAuthorizer,
  CfnRoute,
  CfnIntegration
 } = require('@aws-cdk/aws-apigatewayv2')
 const { ApiEventSource } = require('@aws-cdk/aws-lambda-event-sources')

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
    })

    const getCustomerPermission = new CfnPermission(this, "customerPermission", {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: getCustomerProfileLamda.functionArn,
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${httpApi.httpApiId}/*/*/customer/profile`
    })

    new cdk.CfnOutput(this, "permission source arn", {
      value: `arn:aws:execute-api:${this.region}:${this.account}:${httpApi.httpApiId}/*/*/customer/profile`
    })
    

    // GET /customer/profile
    // const getCustomerProfileIntegration = new LambdaProxyIntegration({
    //   handler: getCustomerProfileLamda,
    // });

    // const getCustomerProfileRoute = new CfnRoute(this, "getCustomerProfileRoute", {
    //   'apiId': httpApi.httpApiId,
    //   'routeKey': 'GET /customer/profile',
    //   'target': '/integrations/' + getCustomerProfileIntegration,
    //   ''
    // })
    


    // httpApi.addRoutes({
    //   path: '/customer/profile',
    //   methods: [ HttpMethod.GET ],
    //   integration: getCustomerProfileIntegration,
    // });

    // // GET /customer/orders
    // const getCustomerOrdersIntegration = new LambdaProxyIntegration({
    //   handler: queryCustomerOrdersLamda,
    // });

    // httpApi.addRoutes({
    //   path: '/customer/orders',
    //   methods: [ HttpMethod.GET ],
    //   integration: getCustomerOrdersIntegration,
    // });

    // // GET /customer/adresses
    // const getCustomerAddressesIntegration = new LambdaProxyIntegration({
    //   handler: queryCustomerAddressesLamda,
    // });

    // httpApi.addRoutes({
    //   path: '/customer/adresses',
    //   methods: [ HttpMethod.GET ],
    //   integration: getCustomerAddressesIntegration,
    // });

    // // POST /customer/orders
    // const postCustomerOrdersIntegration = new LambdaProxyIntegration({
    //   handler: postCustomerOrderLamda,
    // });

    // httpApi.addRoutes({
    //   path: '/customer/orders',
    //   methods: [ HttpMethod.POST ],
    //   integration: postCustomerOrdersIntegration,
    // });

    // // POST /customer/addresses
    // const postCustomerAddressesIntegration = new LambdaProxyIntegration({
    //   handler: postCustomerAddressesLamda,
    // });

    // httpApi.addRoutes({
    //   path: '/customer/addresses',
    //   methods: [ HttpMethod.POST ],
    //   integration: postCustomerAddressesIntegration,
    // });

    // // DELETE /customer/addresses
    // const deleteCustomerAddressesIntegration = new LambdaProxyIntegration({
    //   handler: deleteCustomerAddressesLamda,
    // });

    // httpApi.addRoutes({
    //   path: '/customer/addresses/{id}',
    //   methods: [ HttpMethod.DELETE ],
    //   integration: deleteCustomerAddressesIntegration,
    // });


  }
}

module.exports = { AppStack }
