import { Auth, API } from 'aws-amplify'

export const state = () => ({
  loggedIn: false,
  profile: {
    customerName: undefined,
    customerPhone: undefined,
    customerEmail: undefined,
  },
  orders: [],
  addresses: [],
  cart: [],
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
    try {
      const orders = await API.get('shopApi', '/customer/orders')
      commit('setOrders', orders)
    } catch (error) {
      throw new Error('Something went wrong!')
    }
  },

  async postAddresses({ dispatch }, deliveryAddress) {
    try {
      await API.post('shopApi', '/customer/addresses', {
        body: {
          deliveryAddress,
        },
      })
      dispatch('fetchAddresses')
    } catch (error) {
      throw new Error('Something went wrong!')
    }
  },

  async deleteAddress({ dispatch }, id) {
    try {
      await API.del('shopApi', `/customer/addresses/${id}`)
      dispatch('fetchAddresses')
    } catch (error) {
      throw new Error('Something went wrong!')
    }
  },

  async fetchAddresses({ commit }) {
    try {
      const addresses = await API.get('shopApi', '/customer/addresses')
      addresses.forEach((address) => {
        address.text = JSON.stringify(address.deliveryAddress)
        address.value = address.id
      })
      commit('setAddresses', addresses)
    } catch (error) {
      throw new Error('Something went wrong!')
    }
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
  addToCart(state, item) {
    const foundItem = state.cart.find((cartItem) => cartItem.id === item.id)
    if (foundItem) {
      foundItem.volume += 1
    } else {
      item.volume = 1
      state.cart.push(item)
    }
    state.cart = JSON.parse(JSON.stringify(state.cart))
  },
  removeFromCart(state, itemId) {
    const foundItem = state.cart.find((cartItem) => cartItem.id === itemId)
    if (foundItem.volume === 1) {
      state.cart = state.cart.filter((item) => item.id !== itemId)
      return
    }
    foundItem.volume -= 1
    state.cart = JSON.parse(JSON.stringify(state.cart))
  },
}

export const getters = {
  getLoggedIn(state) {
    return state.loggedIn
  },
  getProfile(state) {
    return state.profile
  },
  getOrders(state) {
    return state.orders
  },
  getAddresses(state) {
    return state.addresses
  },
  getCart(state) {
    return JSON.parse(JSON.stringify(state.cart))
  },
}
