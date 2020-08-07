<template>
  <div>
    <h3>
      Profile
    </h3>
    <b-input-group prepend="Name" class="mt-3">
      <b-form-input
        v-model="getProfile.customerName"
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
        v-model="getProfile.customerPhone"
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
        v-model="getProfile.customerEmail"
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
      v-for="address in getAddresses"
      :key="address.id"
      :shipping-address="address.deliveryAddress"
      :shipping-id="address.id"
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
          <b-form-input
            id="nested-street"
            v-model="form.newStreet"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="City:"
          label-align-sm="right"
          label-for="nested-city"
        >
          <b-form-input id="nested-city" v-model="form.newCity"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Zip:"
          label-align-sm="right"
          label-for="nested-zip"
        >
          <b-form-input id="nested-zip" v-model="form.newZip"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="State:"
          label-align-sm="right"
          label-for="nested-state"
        >
          <b-form-input
            id="nested-state"
            v-model="form.newState"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Country:"
          label-align-sm="right"
          label-for="nested-country"
        >
          <b-form-input
            id="nested-country"
            v-model="form.newCountry"
          ></b-form-input>
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
import { mapGetters, mapActions } from 'vuex'
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
        newStreet: '',
        newCity: '',
        newZip: '',
        newState: '',
        newCountry: '',
      },
      shippingAddressAdd: false,
    }
  },
  computed: {
    ...mapGetters(['getProfile', 'getAddresses']),
  },
  methods: {
    ...mapActions(['postAddresses']),
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
      try {
        this.postAddresses({
          street: this.form.newStreet,
          city: this.form.newCity,
          zip: this.form.newZip,
          state: this.form.newState,
          country: this.form.newCountry,
        }).then(() => this.cancelShippingAdd())
      } catch (error) {
        console.error(error)
      }
    },
    cancelShippingAdd() {
      this.shippingAddressAdd = false
      this.form.newStreet = ''
      this.form.newCity = ''
      this.form.newZip = ''
      this.form.newState = ''
      this.form.newCountry = ''
    },
  },
}
</script>

<style scoped>
.custom-disable:disabled {
  background-color: unset;
}
</style>
