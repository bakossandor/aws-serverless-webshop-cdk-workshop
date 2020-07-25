/* eslint-disable vue/require-prop-types */
<template>
  <b-card :title="prod.name" :img-src="prod.img" img-alt="Image" img-top>
    <b-card-text>
      {{ prod.description }}
    </b-card-text>
    <hr />
    <b-card-text class="d-inline"> $ {{ prod.price }} </b-card-text>
    <b-button variant="dark" class="d-inline float-right"
      >Add to Basket</b-button
    >
  </b-card>
</template>

<script>
export default {
  /* eslint-disable vue/require-prop-types */
  props: ['prod'],
}
</script>
