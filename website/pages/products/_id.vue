<template>
  <b-card no-body class="overflow-hidden mt-3">
    <b-row no-gutters>
      <b-col md="6">
        <b-card-img
          :src="product.img"
          alt="Image"
          class="rounded-0"
        ></b-card-img>
      </b-col>
      <b-col md="6">
        <b-card-body :title="product.name">
          <b-card-text>{{ product.description }}</b-card-text>
          <hr />
          <b-card-text class="d-inline">$ {{ product.price }}</b-card-text>
          <b-button variant="dark" class="d-inline float-right"
            >Add to Basket</b-button
          >
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  async asyncData({ $content, params: { id }, error }) {
    const [products] = await $content('products').fetch()
    const product = products.products.find((prod) => prod.id === id)
    if (!product) error({ statusCode: 404, message: 'Page not found' })
    return { product }
  },
}
</script>

<style></style>
