const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  try {
    const { request: { userAttributes: {
      "sub": id,
      name,
      phone_number,
      email,
    } } = {} } = event
    const params = {
      TableName: "webshop-backend-table",
      Item: {
        customer_email: {
          "S": email
        },
        customer_name: {
          "S": name
        },
        customer_phone_number: {
          "S": phone_number
        },
        PK: {
          "S": `#customer#${id}`
        },
        SK: {
          "S": "#profile"
        },
      }
    }
    await dynamodb.putItem(params).promise()
  } catch (error) {
    console.log(error)
  }
  return event;
};
