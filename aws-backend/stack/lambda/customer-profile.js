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
  } } = event;

  const getParams = {
    "TableName": "webshop-backend-table",
    "Key": {
      "PK": {
        "S": `#customer#${userId}`
      },
      "SK": {
        "S": "#profile"
      },
    }
  }
  const { Item } = await dynamodb.getItem(getParams).promise()
  
  const responseBody = {
      customerName: Item.customer_name.S,
      customerPhone: Item.customer_phone_number.S,
      customerEmail: Item.customer_email.S,
  }
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(responseBody)
  };
};