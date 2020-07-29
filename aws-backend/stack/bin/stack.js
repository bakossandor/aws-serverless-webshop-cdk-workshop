#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DynamoStack } = require('../lib/dynamo-stack');

const app = new cdk.App();
new DynamoStack(app, 'StackStack');
