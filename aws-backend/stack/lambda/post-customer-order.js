const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const { v4: uuidv4 } = require('uuid');

const processOrders = require('./process-orders')

exports.handler = async function(event) {
  const { 
    'requestContext': {
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
  const { orderDeliveryAddress } = JSON.parse(body)
  const batchGetItemsParams = {
    "RequestItems": {
      "webshop-backend-table": {
        "Keys": [
          {
            "PK": {"S": `#customer#${userId}`},
            "SK": {"S": `#delivery_address#${orderDeliveryAddress}`}
          },
          {
            "PK": {"S": `#customer#${userId}`},
            "SK": {"S": '#profile'}
          }
        ]
      }
    }
  }
  const { Responses: {
    "webshop-backend-table": batchResponseItems
  }} = await dynamodb.batchGetItem(batchGetItemsParams).promise()
  
  const { 
    'delivery_address': { 'S': deliveryAddress}
  } = batchResponseItems.find((item) => item.SK.S.startsWith("#delivery_address#"))

  const {
    'customer_name': { 'S': customerName }, 
    'customer_phone_number': { 'S': customerPhoneNumber}
  } = batchResponseItems.find((item) => item.SK.S === "#profile")

  const { mappedItems, 'orderTotalPrice': orderTotalPrice } = processOrders(items)
    
  const putParams = {
    "TableName": "webshop-backend-table",
    "Item": {
      "PK": {
        "S": `#customer#${userId}`
      },
      "SK": {
        "S": `#order#${uuidv4()}`
      },
      "order_delivery_address": {
        "S": deliveryAddress
      },
      "order_total_price": {
        "S": String(orderTotalPrice),
      },
      "order_delivery_name": {
        "S": customerName,
      },
      "order_delivery_phone_number": {
        "S": customerPhoneNumber,
      },
      "order_status": {
        "S": "processing"
      },
      "order_datetime": {
        "N": String(Date.now())
      },
      "order_items": {
        "L": mappedItems.map((item) => {
          return {
            "M": {
              "ordered_volume": {
                "N": String(item.volume)
              },
              "product_id": {
                "S": item.id
              },
              "product_name": {
                "S": item.name
              },
              "product_price": {
                "N": String(item.price)
              }
            }
          }
        })
      }
    }
  }

  await dynamodb.putItem(putParams).promise()
  
  return {
    statusCode: 201,
  };
};
