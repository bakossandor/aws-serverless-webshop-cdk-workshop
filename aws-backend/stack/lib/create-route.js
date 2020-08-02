// This is a helper module to create routes for an API
// It includes, attaching authorizer, and integration from lambda

const { CfnRoute, CfnIntegration } = require('@aws-cdk/aws-apigatewayv2')
const { CfnPermission } = require('@aws-cdk/aws-lambda')

function createRoute({ 
  stack,
  httpApi, 
  authorizer,
  lambda,  
  integrationId,
  routeId,
  method,
  path,
  permissionId
}) {
  const integration = new CfnIntegration(stack, integrationId, {
    apiId: httpApi.httpApiId,
    integrationType: "AWS_PROXY",
    integrationUri: lambda.functionArn,
    payloadFormatVersion: '2.0'
  })

  const route = new CfnRoute(stack, routeId, {
    'apiId': httpApi.httpApiId,
    'routeKey': `${method} ${path}`,
    'target': `integrations/${integration.ref}`,
    'authorizerId': authorizer.ref,
    'authorizationType': 'JWT',
  })

  const permission = new CfnPermission(stack, permissionId, {
    action: 'lambda:InvokeFunction',
    principal: 'apigateway.amazonaws.com',
    functionName: lambda.functionArn,
    sourceArn: `arn:aws:execute-api:${stack.region}:${stack.account}:${httpApi.httpApiId}/*/*${path}`
  })
}

module.exports = createRoute
