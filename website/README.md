## Extending The Website with amplify
`npm install aws-amplify`

## Using the `aws-amplify` package
The project heavily relies on the Amplify build in `Auth` and `API` class methods.
With Auth we have the `signup`, `signin` and `logout` provided (for our porpuses, this api is much more bigger), and with the API we can call the API gateway resources with the required methods.

## Configuring `aws-amplify`
We use NUXT as our framework and in the NUXT context there is a option to have different plugins, and we need to add and configure amlify as a plugin.
(There are multiple way to do it, I like to have seperate config files, and import them into the file where I need them)

1. Crete a new file `./plugins/amplify.js`

```js
// `./plugins/amplify.js`
import Vue from 'vue'
import Amplify from 'aws-amplify'
import amplifyConfing from '../config/cognito'
import apiConfig from '../config/api-conf'

Amplify.configure({ ...amplifyConfing, ...apiConfig })
Vue.use(Amplify)

```

2. crete the config files
```js
// `./config/api-config.js
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
```
```js
// `./config/cognito.js
import { Auth } from 'aws-amplify'

export default {
export default {
  Auth: {
    mandatorySignIn: true,
    region: process.env.NUXT_ENV_COGNITO_REGION,
    userPoolId: process.env.NUXT_ENV_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NUXT_ENV_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
}

```
You can see that the config files relies on the env variables.
Using nuxt will pick up these values from a `.env` file with a `NUXT_ENV_` prefix,

## Using the Auth class methods
In the application `store`, the amplify methods are used. For example the signup method

```js
async signUp({ dispatch }, { name, email, phone, password }) {
  try {
    await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        phone_number: phone,
        name,
      },
    })
  } catch (error) {
    throw new Error(error)
  }
},
```

and one of the API call method
```js
async fetchProfile({ commit }) {
  try {
    const profile = await API.get('shopApi', '/customer/profile')
    commit('setProfile', profile)
    commit('setLoggedIn', true)
  } catch (error) {
    throw new Error('Something went wrong!')
  }
},
```

## Notes
My focus with the Proof of concept was to have a website to showcase the capabilities of the aws backend, so I know it has some flaws, like (not the most optimized error handling and missing input validation, in the future I would take care of it).


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
