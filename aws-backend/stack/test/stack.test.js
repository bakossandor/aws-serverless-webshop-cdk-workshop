const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Stack = require('../lib/stack-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Stack.StackStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
