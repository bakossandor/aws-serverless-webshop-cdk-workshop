<template>
  <b-navbar toggleable="lg" type="light" variant="light" sticky>
    <b-navbar-brand to="/">Best Local PetFood</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/checkout">
          <b-icon class="h4" icon="cart-4"></b-icon>
          <span style="color: #28a745; font-weight: bold;">
            {{ cart.length }}
          </span>
        </b-nav-item>
        <b-nav-item v-if="loggedIn" to="/profile">Profile</b-nav-item>
        <b-nav-item v-if="loggedIn">Sign Out</b-nav-item>
        <b-nav-item v-if="!loggedIn" to="/signin">Sign In</b-nav-item>
        <b-nav-item v-if="!loggedIn" to="/signup">Sign Up</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      loggedIn: 'getLoggedIn',
      cart: 'getCart',
    }),
  },
}
</script>
