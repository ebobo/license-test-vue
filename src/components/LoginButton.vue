<template>
  <v-btn text v-if="!$auth.isAuthenticated" @click="login">
    <span class="mr-1">Log in</span>
    <v-icon>mdi-login-variant</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'LoginButton',
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
  },
};
</script>
