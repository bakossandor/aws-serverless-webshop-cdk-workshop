import Vue from 'vue'
import Amplify from 'aws-amplify'
import amplifyConfing from '../config/cognito'
import apiConfig from '../config/api-conf'

Amplify.configure({ ...amplifyConfing, ...apiConfig })
Vue.use(Amplify)
