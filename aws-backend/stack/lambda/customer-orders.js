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
      ":vsk": {"S": "#order#"}
    }
  }
  const queryResponse = await dynamodb.query(queryParams).promise()
  const responseItems = queryResponse.Items.map((item) => {
    return {
      id: item.SK.S.split("#order#")[1],
      orderDeliveryAddress: item.order_delivery_address.S,
      orderDeliveryName: item.order_delivery_name.S,
      orderDeliveryPhone: item.order_delivery_phone_number.S,
      orderStatus: item.order_status.S,
      orderDatetime: item.order_datetime.N,
      orderItems: item.order_items.L.map((orderItem) => {
        return {
          orderedVolume: orderItem.M.ordered_volume.N,
          productPrice: orderItem.M.product_price.N,
          productName: orderItem.M.product_name.S,
          productId: orderItem.M.product_id.S,
        }
      })
    }
  })
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(responseItems)
  };
};
