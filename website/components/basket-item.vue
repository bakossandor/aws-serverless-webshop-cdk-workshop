<template>
  <b-card>
    <b-container>
      <b-row>
        <b-col md="auto">
          <b-img left :src="item.img" alt="item.name" width="100"></b-img>
        </b-col>
        <b-col>
          <p class="thiner-p">
            <strong>Name: </strong>
            <span>{{ item.name }}</span>
          </p>
          <p class="thiner-p">
            <strong>Volume: </strong>
            <span>{{ item.volume }}</span>
          </p>
          <p class="thiner-p">
            <strong>Price: </strong>
            <span>{{ item.price }}</span>
          </p>
          <b-button @click="() => removeItem()">remove</b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['item'],
  methods: {
    removeItem(item) {
      console.log(item)
    },
  },
}
</script>

<style scoped>
.thiner-p {
  margin-bottom: 0.2rem;
}
</style>
