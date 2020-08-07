<template>
  <b-card>
    <b-card-text> Address: {{ shippingAddress.street }} </b-card-text>
    <b-card-text> City: {{ shippingAddress.city }} </b-card-text>
    <b-card-text> ZIP: {{ shippingAddress.zip }} </b-card-text>
    <b-card-text> State: {{ shippingAddress.state }} </b-card-text>
    <b-card-text> Country: {{ shippingAddress.country }} </b-card-text>
    <b-button @click="() => deleteShippingAddress(shippingId)">Delete</b-button>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['shippingAddress', 'shippingId'],
  methods: {
    ...mapActions(['deleteAddress']),
    deleteShippingAddress(id) {
      try {
        this.deleteAddress(id)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
