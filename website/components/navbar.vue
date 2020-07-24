<template>
  <b-navbar toggleable="lg" type="light" variant="light" sticky>
    <b-navbar-brand to="/">Best Local PetFood</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav v-if="loggedin" class="ml-auto">
        <b-nav-item to="/profile">Profile</b-nav-item>
        <b-nav-item>Sign Out</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-else class="ml-auto">
        <b-nav-item to="/signin">Sign In</b-nav-item>
        <b-nav-item to="/signup">Sign Up</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      loggedin: true,
    }
  },
}
</script>
