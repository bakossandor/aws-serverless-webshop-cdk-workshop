/* eslint-disable vue/require-prop-types */
<template>
  <b-card :title="prod.name" :img-src="prod.img" img-alt="Image" img-top>
    <b-card-text>
      {{ prod.description }}
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  /* eslint-disable vue/require-prop-types */
  props: ['prod'],
}
</script>
