# The project AWS backend implementation

## Step 0 - Configuring the AWS tools
1. Install the AWS CLI, here is the link [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

2. Install the AWS CDK (aws cdk installation)[https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html]

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
    body: JSON.stringify(responseBody)
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

### Lambda Functions
Here you can find all the functions related to the applications

[GET customer-profile](/stack/lambda/customer-profile.js)

[GET customer-orders](/stack/lambda/customer-orders.js)

[POST customer-orders](/stack/lambda/post-customer-orders.js)

[GET customer-addresses](/stack/lambda/customer-orders.js)

[POST customer-addresses](/stack/lambda/post-customer-addresses.js)

[DELETE customer-addresses](/stack/lambda/delete-customer-addresses.js)

### Creating The Cognito User Pool for the Route Authorizer

We have all the Lambda Functions ready and tested. Now we have to route those functions to an API to be accessable, but in order to have a secure API we need a Authorizer attached to the routes. 

For our luck and convenience, AWS provide the `Cognito` service, which offer a decent way to manage users and authentication/authorization to our applications.

Now, If you are not familiar with Cognito, I highly recommend to try it out in the Console. 

Using `aws-cdk`, I am going to create a new stack for this application, the same way we did with our database as well. 

- Create a new file `./lib/cognito-stack.js`.
- Have the following code in it
```js
// ./lib/cognito-stack.js

const cdk = require('@aws-cdk/core');
const { UserPool, UserPoolClient } = require('@aws-cdk/aws-cognito')
const { Function } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')

const {
  userPoolProps,
  userPoolClientProps,
  dynamoPutItemPolicyProps,
  postConfirmationFunctionProps
} = require('./cognito-props')

class CognitoStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    // The code that defines your stack goes here
    const putPolicy = new Policy(
      this,
      'CognitoWebshopDynamoPutItemPolicy',
      dynamoPutItemPolicyProps
    )

    const postConfirmationLambda = new Function(
      this, 
      'webshop-userpool-congito-post-confirmatin',
      postConfirmationFunctionProps
    )
    postConfirmationLambda.role.attachInlinePolicy(putPolicy)

    const userPool = new UserPool(this, 'webshop-userpool', userPoolProps(postConfirmationLambda));

    const userPoolClient = new UserPoolClient(
      this, 
      'webshop-userpool-client-001',
      userPoolClientProps(userPool)  
    )
  }
}

module.exports = { CognitoStack }

```
- The stack declares 4 resources
  - Cognito User Pool
  - Cognito User Pool Client
  - Lambda function to trigger a post confirmation write to DynamoDB
  - Policy attached to Lambda to be able to write to DynamoDB

- The Resources props are declared in the following `./lib/cognito-props.js` file

```js

// ./lib/cognito-props.js
const { PolicyStatement, Effect } = require('@aws-cdk/aws-iam')
const { Runtime, Code } = require("@aws-cdk/aws-lambda")
const path = require('path')

const { dynamoTableArn } = require('../.env.js')

const userPoolProps = (lambda) => {
  return {
    selfSignUpEnabled: true,
    standardAttributes: {
      fullname: {
        required: true,
        mutable: true,
      },
      phoneNumber: {
        required: true,
        mutable: true,
      }
    },
    signInAliases: {
      email: true,
    },
    userVerification: {
      emailStyle: 'LINK',
    },
    lambdaTriggers: {
      postConfirmation: lambda
    }
  }
}

const userPoolClientProps = (userPool) => {
  return {
    userPool: userPool,
    authFlows: {
      refreshToken: true,
      userSrp: true,
      userPassword: true
    },
    generateSecret: false,
  }
}

const dynamoPutItemPolicyProps = {
  policyName: 'WebshopDynamoPutItemPolicy',
  statements: [
    new PolicyStatement({
      actions: ['dynamodb:PutItem'],
      effect: Effect.ALLOW,
      resources: [dynamoTableArn],
    }),
  ],
}

const postConfirmationFunctionProps = {
  runtime: Runtime.NODEJS_12_X,
  handler: 'cognito-post-confirmation.handler',
  code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
}

module.exports = {
  userPoolProps,
  userPoolClientProps,
  postConfirmationFunctionProps,
  dynamoPutItemPolicyProps
}

```

To deploy this stack remember to change the `./bin/stack.js` file for only the duration of the deployment of the Cognito User Pool.

```js
// ./bin/stack.js

#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
// const { DynamoStack } = require('../lib/dynamo-stack');
// const { AppStack } = require('../lib/app-stack')
const { CognitoStack } = require('../lib/cognito-stack')

const app = new cdk.App();
// new DynamoStack(app, "WebshopDynamoStack")
// new AppStack(app, 'WebshopAppStack');
new CognitoStack(app, 'WebshopCognitoStack')
```

After the stack is created, it's time to test it. If you check out the AWS console freshly created Cognito User Pool, for temporary, you can add a custom domain, and use the Hosted UI, where you can sign up a test user. After confirmation, check out the database, and look after the new record! If you find it, you done everything absolutly right!.

### Creating the API Gateway HTTP API and the Routes for it.
By default, the `aws-cdk` has a really straightforward way to create an HTTP API.

You can read more about the [HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) and the [cdk api gateway2 module](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-apigatewayv2-readme.html) which defines the http-api struct

### Creating the first Route
Creating routes, here becoems a little bit tricky, unfortunately there is no higher level construct to create a route with an authorizer porperty, so we have to use the lover `cfn` level apis which for me seems equivalent to a cloudformation template.
- For all of our route we need to define an [authorizer](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigatewayv2.CfnAuthorizer.html)
- For each of our route, we need an [route](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigatewayv2.CfnRoute.html), an [integration](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigatewayv2.CfnIntegration.html), and a [permission](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.CfnPermission.html) (to invoke our lambda functions attached in the integration) cfn resources.


```js
// The HTTP API resource, The universal Authorizer and the First Route components [integration, route, permission]

// Adding the HTTP API
const httpApi = new HttpApi(this, 'HttpApi', httpApiProps);

// Adding the Authorizer
const authorizer = new CfnAuthorizer(this, 'HttpAPIAuthorizer', {
  'name': 'HttpAPIAuthorizer',
  'apiId': httpApi.httpApiId,
  'authorizerType': 'JWT',
  'identitySource': ['$request.header.Authorization'],
  'jwtConfiguration': {
    'audience': [identiyAudience],
    'issuer': identityIssuer
  }
})

const getCustomerProfileIntegration = new CfnIntegration(this, "getCustomerProfileIntegration", {
  apiId: httpApi.httpApiId,
  integrationType: "AWS_PROXY",
  integrationUri: getCustomerProfileLamda.functionArn,
  payloadFormatVersion: '2.0'
})

const getCustomerProfileRoute = new CfnRoute(this, "getCustomerProfileRoute", {
  'apiId': httpApi.httpApiId,
  'routeKey': 'GET /customer/profile',
  'target': `integrations/${getCustomerProfileIntegration.ref}`,
  'authorizerId': authorizer.ref,
})

const getCustomerPermission = new CfnPermission(this, "customerPermission", {
  action: 'lambda:InvokeFunction',
  principal: 'apigateway.amazonaws.com',
  functionName: getCustomerProfileLamda.functionArn,
  sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${httpApi.httpApiId}/*/*/customer/profile`
})
```

Now As You can see, it would be way more repetative task to declare all the routes, so I suggest to create a custom route component which creates all the neccessary component for your needs.

```js
// ./create-route.js

const { CfnRoute, CfnIntegration } = require('@aws-cdk/aws-apigatewayv2')
const { CfnPermission } = require('@aws-cdk/aws-lambda')

function createRoute({ 
  stack,
  httpApi, 
  authorizer,
  lambda,  
  integrationId,
  routeId,
  method,
  path,
  permissionId
}) {
  const integration = new CfnIntegration(stack, integrationId, {
    apiId: httpApi.httpApiId,
    integrationType: "AWS_PROXY",
    integrationUri: lambda.functionArn,
    payloadFormatVersion: '2.0'
  })

  const route = new CfnRoute(stack, routeId, {
    'apiId': httpApi.httpApiId,
    'routeKey': `${method} ${path}`,
    'target': `integrations/${integration.ref}`,
    'authorizerId': authorizer.ref,
    'authorizationType': 'JWT',
  })

  const permission = new CfnPermission(stack, permissionId, {
    action: 'lambda:InvokeFunction',
    principal: 'apigateway.amazonaws.com',
    functionName: lambda.functionArn,
    sourceArn: `arn:aws:execute-api:${stack.region}:${stack.account}:${httpApi.httpApiId}/*/*${path}`
  })
}

module.exports = createRoute
```

At the stack level you have to just provide a couple fo properties, and whoala, you have abstracted away a bunch of code.

After finishing up with the routes, the final stack would look like the following

```js
// ./lib/app-stack.js

const cdk = require('@aws-cdk/core');
const { Function, LayerVersion, CfnPermission } = require('@aws-cdk/aws-lambda')
const { Policy } = require('@aws-cdk/aws-iam')
const {
  HttpApi,
  CfnAuthorizer,
  CfnRoute,
  CfnIntegration
 } = require('@aws-cdk/aws-apigatewayv2')

const { 
  customerProfileProps, 
  customerOrdersProps, 
  customerAddressesProps,
  postCustomerAddressesProps,
  deleteCustomerAddressesProps,
  postCustomerOrderProps,
} = require('./lambda-props')

const { 
  dynamoGetItemPolicyProps, 
  dynamoQueryPolicyProps,
  dynamoPutItemPolicyProps,
  dynamoDeleteItemPolicyProps,
  dynamoBatchGetItemItemPolicyProps,
} = require('./iam-props')

const { layerProps } = require('./layer-props')
const { httpApiProps } = require('./http-api-props')
const { identityIssuer, identiyAudience } = require('../.env.js')
const createRoute = require('./create-route')

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Policy
    const getPolicy = new Policy(this, 'WebshopDynamoGetItemPolicy', dynamoGetItemPolicyProps)
    const queryPolicy = new Policy(this, 'WebshopDynamoQueryPolicy', dynamoQueryPolicyProps)
    const putPolicy = new Policy(this, 'WebshopDynamoPutItemPolicy', dynamoPutItemPolicyProps)
    const deletePolicy = new Policy(this, 'WebshopDynamoDeleteItemPolicy', dynamoDeleteItemPolicyProps)
    const batchGetItemPolicy = new Policy(this, 'WebshopDynamoBatchGetItemPolicy', dynamoBatchGetItemItemPolicyProps)

    // Lambda Layer
    const auxiliariesLayer = new LayerVersion(this, 'AuxiliariesLayer', layerProps)

    // Lambda 
    const getCustomerProfileLamda = new Function(
      this, 
      'webshop-backend-get-customer-profile-lamda', 
      customerProfileProps
    )
    getCustomerProfileLamda.role.attachInlinePolicy(getPolicy)
    
    const queryCustomerOrdersLamda = new Function(
      this, 
      'webshop-backend-get-customer-orders-lamda', 
      customerOrdersProps
    )
    queryCustomerOrdersLamda.role.attachInlinePolicy(queryPolicy)
    
    const queryCustomerAddressesLamda = new Function(
      this, 
      'webshop-backend-get-customer-addresses-lamda', 
      customerAddressesProps
    )
    queryCustomerAddressesLamda.role.attachInlinePolicy(queryPolicy)
    
    const postCustomerAddressesLamda = new Function(
      this, 
      'webshop-backend-post-customer-addresses-lamda', 
      postCustomerAddressesProps
    )
    postCustomerAddressesLamda.role.attachInlinePolicy(putPolicy)
    postCustomerAddressesLamda.addLayers(auxiliariesLayer)
    
    const deleteCustomerAddressesLamda = new Function(
      this,
      'webshop-backend-delete-customer-addresses-lamda', 
      deleteCustomerAddressesProps
    )
    deleteCustomerAddressesLamda.role.attachInlinePolicy(deletePolicy)

    const postCustomerOrderLamda = new Function(
      this, 
      'webshop-backend-post-customer-order-lamda', 
      postCustomerOrderProps
    )
    postCustomerOrderLamda.role.attachInlinePolicy(putPolicy)
    postCustomerOrderLamda.role.attachInlinePolicy(batchGetItemPolicy)
    postCustomerOrderLamda.addLayers(auxiliariesLayer)

    // Adding the HTTP API
    const httpApi = new HttpApi(this, 'HttpApi', httpApiProps);
    
    // Adding the Authorizer
    const authorizer = new CfnAuthorizer(this, 'HttpAPIAuthorizer', {
      'name': 'HttpAPIAuthorizer',
      'apiId': httpApi.httpApiId,
      'authorizerType': 'JWT',
      'identitySource': ['$request.header.Authorization'],
      'jwtConfiguration': {
        'audience': [identiyAudience],
        'issuer': identityIssuer
      }
    })

    // Routes to the API
    const getCustomerProfileIntegration = new CfnIntegration(this, "getCustomerProfileIntegration", {
      apiId: httpApi.httpApiId,
      integrationType: "AWS_PROXY",
      integrationUri: getCustomerProfileLamda.functionArn,
      payloadFormatVersion: '2.0'
    })

    const getCustomerProfileRoute = new CfnRoute(this, "getCustomerProfileRoute", {
      'apiId': httpApi.httpApiId,
      'routeKey': 'GET /customer/profile',
      'target': `integrations/${getCustomerProfileIntegration.ref}`,
      'authorizerId': authorizer.ref,
      'authorizationType': 'JWT',
    })

    const getCustomerPermission = new CfnPermission(this, "customerPermission", {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: getCustomerProfileLamda.functionArn,
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${httpApi.httpApiId}/*/*/customer/profile`
    })

    // Custom Rute Add method

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: queryCustomerOrdersLamda,
      integrationId: 'GetCustomerOrdersIntegration',
      routeId: 'GetCustomerOrdersRoute',
      permissionId: 'GetCustomerOrdersPermission',
      method: 'GET',
      path: '/customer/orders',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: queryCustomerAddressesLamda,
      integrationId: 'GetCustomerAddressesIntegration',
      routeId: 'GetCustomerAddressesRoute',
      permissionId: 'GetCustomerAddressesPermission',
      method: 'GET',
      path: '/customer/addresses',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: postCustomerOrderLamda,
      integrationId: 'PostCustomerOrderIntegration',
      routeId: 'PostCustomerOrderRoute',
      permissionId: 'PostCustomerOrderPermission',
      method: 'POST',
      path: '/customer/orders',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: postCustomerAddressesLamda,
      integrationId: 'PostCustomerAddressesIntegration',
      routeId: 'PostCustomerAddressesRoute',
      permissionId: 'PostCustomerAddressesPermission',
      method: 'POST',
      path: '/customer/addresses',
    })

    createRoute({
      stack: this,
      httpApi: httpApi,
      authorizer: authorizer,
      lambda: deleteCustomerAddressesLamda,
      integrationId: 'DeleteCustomerAddressesIntegration',
      routeId: 'DeleteCustomerAddressesRoute',
      permissionId: 'DeleteCustomerAddressesPermission',
      method: 'DELETE',
      path: '/customer/addresses',
    })
  }
}

module.exports = { AppStack }
```

## Notes
- As I fininshed the project I realized the proof of concept got bigger than I expected, in the future I would break down this project into smaller pieces as well.
