<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>Basket</h3>
        <BasketItem v-for="item in order.items" :key="item.id" :item="item" />
      </b-col>
      <b-col>
        <h3>Shipping Info</h3>
        <Shipping />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BasketItem from '../components/basket-item'
import Shipping from '../components/shipping'
export default {
  components: {
    BasketItem,
    Shipping,
  },
  data() {
    return {
      order: {
        items: [
          {
            name: 'Small Cat Food',
            id: '001',
            price: 18.19,
            volume: 1,
            img:
              'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1',
          },
        ],
      },
    }
  },
}
</script>
