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

## Step 3