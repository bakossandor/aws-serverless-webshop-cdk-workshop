const cdk = require('@aws-cdk/core');
const { Table } = require('@aws-cdk/aws-dynamodb')

const dynamoWebshopProps = require('./dynamo-webshop-properties')

class DynamoStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const webshopBackendTable = new Table(this, 'webshop-backend-table', dynamoWebshopProps)
  }
}

module.exports = { DynamoStack }
