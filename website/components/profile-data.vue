<template>
  <div>
    <h3>
      Profile
    </h3>
    <b-input-group prepend="Name" class="mt-3">
      <b-form-input
        v-model="form.name.val"
        class="custom-disable"
        :disabled="!form.name.edit"
        type="text"
      ></b-form-input>
      <b-input-group-append>
        <b-button
          v-if="!form.name.edit"
          variant="outline-success"
          @click="form.name.edit = true"
          >Change</b-button
        >
        <b-button
          v-if="form.name.edit"
          variant="outline-danger"
          @click="() => cancel('name')"
          >Cancel</b-button
        >
        <b-button v-if="form.name.edit" variant="success">Submit</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-input-group prepend="Phone" class="mt-3">
      <b-form-input
        v-model="form.phonenumber.val"
        class="custom-disable"
        :disabled="!form.phonenumber.edit"
        type="tel"
      ></b-form-input>
      <b-input-group-append>
        <b-button
          v-if="!form.phonenumber.edit"
          variant="outline-success"
          @click="form.phonenumber.edit = true"
          >Change
        </b-button>
        <b-button
          v-if="form.phonenumber.edit"
          variant="outline-danger"
          @click="() => cancel('phonenumber')"
          >Cancel
        </b-button>
        <b-button v-if="form.phonenumber.edit" variant="success"
          >Submit</b-button
        >
      </b-input-group-append>
    </b-input-group>

    <b-input-group prepend="Email" class="mt-3">
      <b-form-input
        v-model="form.email.val"
        type="email"
        class="custom-disable"
        :disabled="!form.email.edit"
      ></b-form-input>
      <b-input-group-append>
        <b-button
          v-if="!form.email.edit"
          variant="outline-success"
          @click="form.email.edit = true"
          >Change</b-button
        >
        <b-button
          v-if="form.email.edit"
          variant="outline-danger"
          @click="() => cancel('email')"
          >Cancel
        </b-button>
        <b-button v-if="form.email.edit" variant="success">Submit</b-button>
      </b-input-group-append>
    </b-input-group>

    <div class="mt-3">
      <b-button
        v-if="!form.password.change"
        variant="success"
        @click="form.password.change = true"
      >
        Change Password
      </b-button>
      <b-form-input
        v-if="form.password.change"
        v-model="form.password.new"
        type="password"
        placeholder="new password"
        class="mb-3"
      ></b-form-input>
      <b-form-input
        v-if="form.password.change"
        v-model="form.password.confirm"
        type="password"
        placeholder="confirm password"
        class="mb-3"
      ></b-form-input>
      <b-button
        v-if="form.password.change"
        variant="success"
        @click="cancelPassword"
      >
        Cancel
      </b-button>
      <b-button v-if="form.password.change" variant="success">
        Submit
      </b-button>
    </div>

    <h4 class="my-3">Shipping Addresses</h4>

    <AddressCard
      v-for="address in shippingAddresses"
      :key="address.id"
      :shipping-address="address"
      class="mb-3"
    />

    <b-button
      v-if="!shippingAddressAdd"
      variant="success"
      class="mb-3"
      @click="shippingAddressAdd = true"
      >Add new Address</b-button
    >

    <div v-if="shippingAddressAdd" class="mt-3">
      <b-form-group
        label-cols-lg="3"
        label="Add Shipping Address"
        label-size="lg"
        label-class="font-weight-bold pt-0"
        class="mb-0"
      >
        <b-form-group
          label-cols-sm="3"
          label="Street:"
          label-align-sm="right"
          label-for="nested-street"
        >
          <b-form-input id="nested-street"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="City:"
          label-align-sm="right"
          label-for="nested-city"
        >
          <b-form-input id="nested-city"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Zip:"
          label-align-sm="right"
          label-for="nested-zip"
        >
          <b-form-input id="nested-zip"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="State:"
          label-align-sm="right"
          label-for="nested-state"
        >
          <b-form-input id="nested-state"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Country:"
          label-align-sm="right"
          label-for="nested-country"
        >
          <b-form-input id="nested-country"></b-form-input>
        </b-form-group>

        <div>
          <b-button
            variant="outline-danger"
            class="mb-3"
            @click="cancelShippingAdd"
            >Cancel</b-button
          >

          <b-button variant="success" class="mb-3" @click="addShippingAddress"
            >Submit</b-button
          >
        </div>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import AddressCard from './address-card'
export default {
  components: {
    AddressCard,
  },
  data() {
    return {
      form: {
        name: {
          val: 'Joe Montana',
          edit: false,
          old: 'Joe Montana',
        },
        phonenumber: {
          val: '+0089912312',
          edit: false,
          old: '+0089912312',
        },
        email: {
          val: 'Joe@montana.com',
          edit: false,
          old: 'Joe@montana.com',
        },
        password: {
          new: '',
          confirm: '',
          change: false,
        },
      },
      shippingAddresses: [
        {
          Address: 'Address 1',
          City: 'City 1',
          Zip: 'Zip 1',
          State: 'State 1',
          Country: 'Country 1',
          id: '001',
        },
        {
          Address: 'Address 2',
          City: 'City 2',
          Zip: 'Zip 2',
          State: 'State 2',
          Country: 'Country 2',
          id: '002',
        },
      ],
      shippingAddressAdd: false,
    }
  },
  methods: {
    cancel(toCancel) {
      const ref = this.form[toCancel]
      ref.val = ref.old
      ref.edit = false
    },
    cancelPassword() {
      const pw = this.form.password
      pw.new = ''
      pw.confirm = ''
      pw.change = false
    },
    addShippingAddress() {
      console.log('need to fill')
    },
    cancelShippingAdd() {
      console.log('need to fill')
    },
  },
}
</script>

<style scoped>
.custom-disable:disabled {
  background-color: unset;
}
</style>
