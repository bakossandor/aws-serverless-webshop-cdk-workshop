const { HttpMethod } = require('@aws-cdk/aws-apigatewayv2')

const httpApiProps = {
  corsPreflight: {
    allowHeaders: ['Authorization'],
    allowMethods: [HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS, HttpMethod.POST],
    allowOrigins: ['*'],
  },
  createDefaultStage: true,
}

module.exports = { httpApiProps }