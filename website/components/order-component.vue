<template>
  <b-card :title="'Order number: ' + order.id">
    <h4>Items:</h4>
    <b-card-text v-for="(item, idx) in order.items" :key="idx">
      <strong>ID:</strong> {{ item.id }} <strong>Name:</strong> {{ item.name }}
      <strong>Price:</strong> {{ item.price }} <strong>Volume:</strong>
      {{ item.volume }}
    </b-card-text>
    <b-card-text>
      Total Price: <strong>$ {{ order.totalPrice }}</strong>
    </b-card-text>
    <hr />
    <b-card-text> Name: {{ order.deliveryName }} </b-card-text>
    <b-card-text> Phone: {{ order.deliveryPhone }} </b-card-text>
    <b-card-text> Delivery Address: {{ order.deliveryAddress }} </b-card-text>
  </b-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['order'],
}
</script>
