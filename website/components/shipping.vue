<template>
  <div>
    <b-form-select
      v-model="selectedAddress"
      :options="shippingAdresses"
      placeholder="select a shipping address"
    ></b-form-select>
    We are going to ship to this address:
    <p>
      {{ selectedAddress }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedAddress: null,
      shippingAdresses: [
        {
          text:
            'ASSDDDDDDDDDDDDDDAAAAAAAAAAAAAAasssssssssssssssssssssAAAAAAASSSSSSSSSSSSSSSSSSSDDD',
          value: 'awd',
          Address: 'Address 1',
          City: 'City 1',
          Zip: 'Zip 1',
          State: 'State 1',
          Country: 'Country 1',
          id: '001',
        },
      ],
    }
  },
}
</script>
