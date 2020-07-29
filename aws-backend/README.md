# The project AWS backend implementation

## Step 0 - Configuring the AWS tools

## Step 1 - Init a CDK project
- create a new empty folder
- run the `cdk init app --language javascript` command from the newly created folder, and as you can see you can select different programming languages, now we will stick with `JavaScript`

If you the operation was successfull you can see the previous command created a skeleton for the app. Here you should write your "code" in the `lib` directory.

If you have created a directory called "app" the stack name will be "AppStack" and in the `./lib` folder you will find the file called `app-stack.js` file where you can easily start writing your code

If you check the `./bin` directory, you can see a file called `stack.js`, this is the entry point for deploying our stack, and its import the different constructs. At the moment its import the default construct that was created by the project generator.

## Step 2 - Creating DynamoDB database
The DynamoDB is going to be a seperate stack from the application

- We are going to stick with the default settings
  - No secondary indexes
  - 5 read and 5 write capacity units
- The Primary Key type is string and called `PK`
- The Sort Key type is string and called `SK`

- Install the cdk dynamo library - `npm install @aws-cdk/aws-dynamodb`
- create a new file for the dynmaodb properties (I like to seperate things to different modules, later when you have a construct with different not default values, its easier to oversee and maintain) I suggest something like `dynamo-webshop-properties.js`, and let's see the code that we need in this file

Here is the [cdk dynamo table docs](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-dynamodb.Table.html)

```js
const { AttributeType } = require('@aws-cdk/aws-dynamodb')

const dynamoProperties = {
    partitionKey: { name: 'PK', type: AttributeType.STRING },
    sortKey: { name: 'SK', type: AttributeType.STRING },
    tableName: 'webshop-backend-table'
}

module.exports = dynamoProperties
```
First we need to import the `AttributeType` object from the cdk, then we need to fill the minimum required properties, By default only the Partition Key is required, but in our case we have a Sort Key that we want to add and we want to name our table as well.

- I have renamed the original `*-stack.js` file to `dynamo-stack.js`, I suggest you shoud do the same, (later we are going to create another construct for the lambda, rest-api and cognito resources). So in this file, import the recently created `dynamoProperties` module. The finished file should look something like that:

```js
// dynamo-stack.js

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
```

- To complete the file, you need to import the `Table` class from the cdk, and instantiate it, providing the `this` to refer to this construct, the `id` and the `properties`

Final Steps to deploy the `webshop-backend-table` DynamoDB resource
- open the `./bin/stack.js` file, and slightly modify to reflect the current changes

```js
// `./bin/stack.js`

#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DynamoStack } = require('../lib/dynamo-stack');

const app = new cdk.App();
new DynamoStack(app, 'StackStack');
```

We are ready to deploy, you can check what the CloudFormation would it be, by running the `cdk synth` command.

Deploy the stack running `cdk deploy`

You can see from your command line that it's creating the resources, (In my humble opinion the tool developers did a great job to notifying the users about the running process)

You can also monitor the process from the `AWS web console` CloudFormation Tab.

When it say ready, check DynamoDB from the console and verify its existence.

## Step 3 - Adding Lambda functions to serve data to and from DynamoDB

Here is the [cdk lambda module](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html)

### First Lambda Function

With the first function, I am going to explain the low level details

So our first function is going to do one thing, its going to retrive the customer profile impormation, the API Gateway `/customer/profile` function going to use this endpoint.
The query this function has to do regarding the DynamoDB is `Query Where PK = #customer#{id} AND SK = #profile`, and yes from the request we need to extraxt the customer ID.

- Create a folder called `lambda` in the root of the folder of the stack, the same level as `lib` or `bin`
- Create a file called `customer-profile.js` inside the `lambda` folder, this file is going to be our first lambda handler

```js
// customer-profile.js

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
    body: responseBody
  };
};
```

Above, the `customer-profile.js` file has a simple thing, proxy the request between the API Gateway and DynamoDB in a controlled way. Again, the purpose of this function is the get the customer profile information, the first thing we do is to get the customer ID from the request `event.requestContext` object. With our setup, using `Cognito` will provide this certain object. We can use this key to get the item from the database. Using the `getItem` method to retrive the customer information, and mapping the `responseBody` based on the DynamoDB response is going to get the job done, before we finish with sending a response back.

- Next step, setting up the cdk with lambda
- Run `npm install @aws-cdk/aws-lambda`
- Create a new file `./lib/lambda-props.js` (The plan is to store all of the Lambda properties here)

```js
// ./lib/lambda-props.js
const { Runtime, Code } = require("@aws-cdk/aws-lambda")
const path = require('path')

const customerProfile = {
    runtime: Runtime.NODEJS_12_X,
    handler: 'customer-profile.handler',
    code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
}

module.exports = {
  customerProfile,
}
```
- Well, there are multiple way to add permission to our lambda function to be able to query DynamoDB, By default, `cdk` will add the `service-role/AWSLambdaBasicExecutionRole` to the function, here the easiest method we can do is to dynamically attach the required policy to this defaut role.
- First, create the policy,
  - create a new file `./iam-props`
```js
// ./lib/iam-props.js

const { PolicyStatement, Effect } = require('@aws-cdk/aws-iam')

const { dynamoTableArn } = require('../.env.js')

const dynamoGetItemPolicyProps = {
  policyName: 'WebshopDynamoGetItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:GetItem'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}

module.exports = {
  dynamoGetItemPolicyProps,
}
```
Here we define the policy, PAY ATTENTION!! here is might not be the best practice, but for now the `dynamoTableArn` value is provided from an envirent file called `.env.js`

```js
// .env.js
module.exports = {
  dynamoTableArn: {{ arn:aws:dynamodb:<region>:<id>:table/<tble-name> }}
}
```

- duplicate the `dynamo-stack.js` file, and call the new file to `app-stack.js` and modify it

```js
// ./lib/app-stack.js

const cdk = require('@aws-cdk/core');
const { Function } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')

const { customerProfileProps } = require('./lambda-props')
const { dynamoGetItemPolicyProps } = require('./iam-props')

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Policy
    const getPolicy = new Policy(this, 'WebshopDynamoGetItemPolicy', dynamoGetItemPolicyProps)

    // Lambda 
    const getCustomerProfileLamda = new Function(
      this, 
      'webshop-backend-get-customer-profile-lamda', 
      customerProfileProps
    )
    getCustomerProfileLamda.role.attachInlinePolicy(getPolicy)

  }
}

module.exports = { AppStack }
```

- Modify the `./bin/stack.js` file, the idea behind having multiple stacks is to seperate the Datalayer from the Logic, but for the demo purpuses it would have been fine if we keep them together.

```js
// ./bin/stack.js
#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
// const { DynamoStack } = require('../lib/dynamo-stack');
const { AppStack } = require('../lib/app-stack')

const app = new cdk.App();
// new DynamoStack(app, "WebshopDynamoStack")
new AppStack(app, 'WebshopAppStack');
```

Finally, run `cdk-deploy`.
Check out the console, and look after the created Lambda resource.
You can test it by populate the DynamoDB with a single item with the appropriate field names

```sh
aws dynamodb put-item \
    --table-name webshop-backend-table \
    --item '{"PK": {"S": "#customer#test1"}, "SK": {"S": "#profile"}, "customer_email": {"S": "whatever"}, "customer_name": {"S": "whatever"}, "customer_phone_number": {"S": "whatever"}}'
```
If you can't make it run in windows try to escape the -> " <- character
```sh
aws dynamodb put-item --table-name webshop-backend-table --item
'{\"PK\": {\"S\": \"#customer#test1\"}, \"SK\": {\"S\": \"#profile\"}, \"customer_email\": {\"S\": \"whatever\"}, \"customer_name\": {\"S\": \"whatever\"}, \"customer_phone_number\": {\"S\": \"whatever\"}}'
```

Add a new test to the latest and best Lambda function, have the body the following JSON
```json
{
  "requestContext": {
    "authorizer": {
      "jwt": {
        "claims": {
          "sub": "test1" --it suppose to match with the inserted item primary key
        }
      }
    }
  }
}
```
And if you have done everything correctly you should see the following response:
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "customerName": "whatever name",
    "customerPhone": "whatever number",
    "customerEmail": "whatever email"
  }
}
```