export default {
  Auth: {
    mandatorySignIn: true,
    region: process.env.NUXT_ENV_COGNITO_REGION,
    userPoolId: process.env.NUXT_ENV_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NUXT_ENV_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
}
