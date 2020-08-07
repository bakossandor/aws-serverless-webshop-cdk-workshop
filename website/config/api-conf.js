import { Auth } from 'aws-amplify'

export default {
  API: {
    endpoints: [
      {
        name: 'shopApi',
        endpoint: process.env.NUXT_ENV_API_URL,
        custom_header: async () => {
          return {
            Authorization: `${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          }
        },
      },
    ],
  },
}
