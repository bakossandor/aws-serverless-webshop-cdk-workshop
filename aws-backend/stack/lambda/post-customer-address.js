const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const { v4: uuidv4 } = require('uuid');

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
  body
} = event;
  const { deliveryAddress } = JSON.parse(body)
  const putParams = {
    "TableName": "webshop-backend-table",
    "Item": {
      "PK": {
        "S": `#customer#${userId}`
      },
      "SK": {
        "S": `#delivery_address#${uuidv4()}`
      },
      "delivery_address": {
        "S": JSON.stringify(deliveryAddress)
      }
    }
  }

  await dynamodb.putItem(putParams).promise()
  
  return {
    statusCode: 201,
  };
};
