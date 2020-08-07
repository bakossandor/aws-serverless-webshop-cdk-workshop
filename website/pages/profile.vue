<template>
  <b-row class="mt-4">
    <b-col>
      <ProfileData />
    </b-col>
    <b-col>
      <OrderData />
    </b-col>
  </b-row>
</template>

<script>
import { mapActions } from 'vuex'
import ProfileData from '../components/profile-data'
import OrderData from '../components/order-data'
export default {
  middleware: 'auth',
  components: {
    ProfileData,
    OrderData,
  },
  created() {
    try {
      this.fetchOrders()
      this.fetchAddresses()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    ...mapActions(['fetchOrders', 'fetchAddresses']),
  },
}
</script>
