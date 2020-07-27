<template>
  <b-card>
    <b-card-text> Address: {{ shippingAddress.address }} </b-card-text>
    <b-card-text> City: {{ shippingAddress.city }} </b-card-text>
    <b-card-text> ZIP: {{ shippingAddress.zip }} </b-card-text>
    <b-card-text> State: {{ shippingAddress.state }} </b-card-text>
    <b-card-text> Country: {{ shippingAddress.country }} </b-card-text>
  </b-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['shippingAddress'],
}
</script>
