<template>
  <div>
    <Navbar />
    <b-container fluid="md">
      <Nuxt />
    </b-container>
  </div>
</template>
<script>
import Navbar from '../components/navbar'
export default {
  components: {
    Navbar,
  },
}
</script>
<style></style>
