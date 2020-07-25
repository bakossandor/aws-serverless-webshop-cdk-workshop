<template>
  <b-card-group columns class="mt-3">
    <Card v-for="prod in products" :key="prod.id" :prod="prod" />
  </b-card-group>
</template>
<script>
import Card from './product-card'
export default {
  components: {
    Card,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['products'],
}
</script>
