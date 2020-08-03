<template>
  <b-row class="justify-content-md-center my-4">
    <b-col col md="6">
      <b-card
        bg-variant="dark"
        text-variant="white"
        :title="!signedUp ? 'Sign Up!' : 'Confirm your sign up!'"
        class="mb-2"
      >
        <b-card-text v-if="!signedUp">
          You need to Sign Up in order to get these unbelivable products!
        </b-card-text>
        <b-card-text v-if="signedUp">
          Check out your email address, for the confirmation mail
        </b-card-text>
      </b-card>
      <router-link v-if="signedUp" to="/signin">
        <b-button variant="primary">Login</b-button>
      </router-link>
      <b-form v-if="!signedUp" @submit="onSubmit">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
          description="We'll never share your email with anyone else."
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            required
            placeholder="Enter name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-3"
          label="Your Phone Number:"
          label-for="input-3"
        >
          <b-form-input
            id="input-3"
            v-model="form.phone"
            required
            placeholder="Enter phone number"
            type="tel"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" label="Password:" label-for="input-4">
          <b-form-input
            id="input-4"
            v-model="form.password"
            required
            placeholder="Enter your Password"
            type="password"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-5"
          label="Repeat Password:"
          label-for="input-5"
        >
          <b-form-input
            id="input-5"
            v-model="form.repassword"
            required
            placeholder="Repeat your Password"
            type="password"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Sign Up</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        email: '',
        name: '',
        phone: '',
        password: '',
        repassword: '',
      },
      signedUp: false,
    }
  },
  methods: {
    ...mapActions(['signUp']),
    onSubmit(evt) {
      evt.preventDefault()
      this.signUp({
        email: this.form.email,
        name: this.form.name,
        phone: this.form.phone,
        password: this.form.password,
      })
        .then(() => (this.signedUp = true))
        .catch(console.error)
    },
  },
}
</script>
