<template>
  <div>
    <Card :prod="product" />
  </div>
</template>

<script>
import Card from '../../components/product-card'
export default {
  components: {
    Card,
  },
  async asyncData({ $content, params: { id }, error }) {
    const [products] = await $content('products').fetch()
    const product = products.products.find((prod) => prod.id === id)
    if (!product) error({ statusCode: 404, message: 'Page not found' })
    return { product }
  },
}
</script>

<style></style>
