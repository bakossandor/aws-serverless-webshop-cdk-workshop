#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
// const { DynamoStack } = require('../lib/dynamo-stack');
const { AppStack } = require('../lib/app-stack')

const app = new cdk.App();
// new DynamoStack(app, "WebshopDynamoStack")
new AppStack(app, 'WebshopAppStack');
