import { Auth, API } from 'aws-amplify'

export const state = () => ({
  loggedIn: false,
  profile: {
    customerName: undefined,
    customerPhone: undefined,
    customerEmail: undefined,
  },
  basket: [],
  orders: [],
  addresses: [],
})

export const actions = {
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
  async signIn({ dispatch }, { email, password }) {
    try {
      await Auth.signIn({ username: email, password })
      dispatch('fetchProfile')
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        throw new Error('Wrong Password or Username!')
      }
      throw new Error('Something went wrong!')
    }
  },
  async fetchProfile({ commit }) {
    try {
      const profile = await API.get('shopApi', '/customer/profile')
      commit('setProfile', profile)
      commit('setLoggedIn', true)
    } catch (error) {
      throw new Error('Something went wrong!')
    }
  },
  async fetchOrders({ commit }) {
    const orders = await API.get('shopApi', '/customer/orders')
    commit('setOrders', orders)
  },
  async fetchAddresses({ commit }) {
    const addresses = await API.get('shopApi', '/customer/addresses')
    commit('setAddresses', addresses)
  },
}

export const mutations = {
  setLoggedIn(state, currentStatus) {
    state.loggedIn = currentStatus
  },
  setProfile(state, { customerName, customerPhone, customerEmail }) {
    state.profile.customerName = customerName
    state.profile.customerEmail = customerEmail
    state.profile.customerPhone = customerPhone
  },
  setOrders(state, orders) {
    state.orders = orders
  },
  setAddresses(state, addresses) {
    state.addresses = addresses
  },
}

export const getters = {
  getLoggedIn(state) {
    return state.loggedIn
  },
  getProfile(state) {
    return state.profile
  },
  getBasket(state) {
    return state.basket
  },
  getOrders(state) {
    return state.orders
  },
  getAddresses(state) {
    return state.addresses
  },
}
