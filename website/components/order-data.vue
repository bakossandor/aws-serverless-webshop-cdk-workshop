<template>
  <div>
    <h3>
      Open Orders
    </h3>
    <Order v-for="order in openOrders" :key="order.id" :order="order" />
    <h3>
      Finished orders
    </h3>
  </div>
</template>

<script>
import Order from './order-component'
export default {
  components: {
    Order,
  },
  data() {
    return {
      openOrdersTableFields: ['id', 'totalPrice', 'orderDate'],
      openOrders: [
        {
          id: '001',
          deliveryName: 'Joe Montana',
          deliveryAddress: 'Best address',
          deliveryPhone: '00112423425',
          totalPrice: 999.99,
          orderDate: new Date(),
          items: [
            {
              id: '0001',
              name: 'Best Item',
              price: 99.99,
              volume: 1,
            },
            {
              id: '0002',
              name: 'Best Item 2',
              price: 9.99,
              volume: 2,
            },
          ],
        },
      ],
    }
  },
}
</script>
