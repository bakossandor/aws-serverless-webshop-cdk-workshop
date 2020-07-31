const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async function(event) {
  const { 'requestContext': {
    'authorizer': {
      'jwt': {
        'claims': {
          sub: userId
        }
      }
    }
  }, 
  'pathParameters': {
    id: addressId
  } 
} = event;

  const deleteParams = {
    "TableName": "webshop-backend-table",
    "Key": {
      "PK": {
        "S": `#customer#${userId}`
      },
      "SK": {
        "S": `#delivery_address#${addressId}}`
      }
    }
  }

  await dynamodb.deleteItem(deleteParams).promise()
  
  return {
    statusCode: 201,
  };
};
