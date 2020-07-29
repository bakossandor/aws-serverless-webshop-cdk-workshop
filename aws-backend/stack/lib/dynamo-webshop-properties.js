const { AttributeType } = require('@aws-cdk/aws-dynamodb')

const dynamoProperties = {
    partitionKey: { name: 'PK', type: AttributeType.STRING },
    sortKey: { name: 'SK', type: AttributeType.STRING },
    tableName: 'webshop-backend-table'
}

module.exports = dynamoProperties