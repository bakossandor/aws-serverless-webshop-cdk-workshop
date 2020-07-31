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

  const queryParams = {
    "TableName": "webshop-backend-table",
    "KeyConditionExpression": "PK = :vpk AND begins_with(SK, :vsk)",
    "ExpressionAttributeValues": {
      ":vpk": {"S": `#customer#${userId}`},
      ":vsk": {"S": "#delivery_address#"}
    }
  }
  const queryResponse = await dynamodb.query(queryParams).promise()

  const responseItems = queryResponse.Items.map((item) => {
    return {
      id: item.SK.S.split("#delivery_address#")[1],
      deliveryAddress: item.delivery_address.S
    }
  })
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(responseItems)
  };
};
