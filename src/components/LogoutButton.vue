<template>
  <v-btn text v-if="$auth.isAuthenticated" @click="logout">
    <span class="mr-1">Log out</span>
    <v-icon>mdi-logout-variant</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'LogoutButton',
  methods: {
    logout() {
      this.$auth.logout();
      this.$router.push({ path: '/' });
    },
  },
};
</script>
