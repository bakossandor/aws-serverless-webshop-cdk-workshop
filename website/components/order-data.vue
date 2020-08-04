<template>
  <div>
    <h3>
      Orders
    </h3>
    <Order v-for="order in getOrders" :key="order.id" :order="order" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Order from './order-component'
export default {
  components: {
    Order,
  },
  computed: {
    ...mapGetters(['getOrders']),
  },
}
</script>
