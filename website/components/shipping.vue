<template>
  <div>
    <b-form-select
      v-model="selectedAddress"
      :options="getAddresses"
      placeholder="select a shipping address"
    ></b-form-select>
    <p>
      We are going to ship to this address:
    </p>
    <address-card
      v-if="selectedAddress"
      :shipping-address="selected.deliveryAddress"
      :shipping-id="selectedAddress"
    ></address-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddressCard from './address-card'
export default {
  components: {
    AddressCard,
  },
  computed: {
    ...mapGetters(['getAddresses']),
    selected() {
      return this.getAddresses.find((item) => item.id === this.selectedAddress)
    },
  },
  data() {
    return {
      selectedAddress: null,
    }
  },
}
</script>
