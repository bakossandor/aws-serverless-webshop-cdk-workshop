<template>
  <b-card :title="'Order number: ' + order.id">
    <h4>Items:</h4>
    <b-card-text v-for="(item, idx) in order.orderItems" :key="idx">
      <strong>ID:</strong> {{ item.productId }} <strong>Name:</strong>
      {{ item.productName }} <strong>Price:</strong> {{ item.productPrice }}
      <strong>Volume:</strong>
      {{ item.orderedVolume }}
    </b-card-text>
    <b-card-text>
      Total Price: <strong>$ {{ order.orderTotalPrice }}</strong>
    </b-card-text>
    <hr />
    <b-card-text> Name: {{ order.orderDeliveryName }} </b-card-text>
    <b-card-text> Phone: {{ order.orderDeliveryPhone }} </b-card-text>
    <b-card-text>
      Delivery Address: {{ order.orderDeliveryAddress }}
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['order'],
}
</script>
