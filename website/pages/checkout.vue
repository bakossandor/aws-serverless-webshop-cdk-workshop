<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>Basket</h3>
        <BasketItem v-for="item in cart" :key="item.id" :item="item" />
      </b-col>
      <b-col>
        <h3>Shipping Info</h3>
        <Shipping />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import BasketItem from '../components/basket-item'
import Shipping from '../components/shipping'
export default {
  components: {
    BasketItem,
    Shipping,
  },
  middleware: 'auth',
  computed: {
    ...mapGetters({
      cart: 'getCart',
    }),
  },
}
</script>
