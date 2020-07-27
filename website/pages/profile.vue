<template>
  <b-row class="mt-4">
    <b-col>
      <ProfileData />
    </b-col>
    <b-col>
      <OrderData />
    </b-col>
  </b-row>
</template>

<script>
import ProfileData from '../components/profile-data'
import OrderData from '../components/order-data'
export default {
  components: {
    ProfileData,
    OrderData,
  },
}
</script>
