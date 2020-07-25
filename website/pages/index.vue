<template>
  <div>
    <Products :products="products" />
  </div>
</template>

<script>
import Products from '../components/products'
export default {
  components: {
    Products,
  },
  async asyncData({ $content }) {
    const [products] = await $content('products').fetch()
    return { products: products.products }
  },
}
</script>

<style></style>
