<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Autronica Logo"
          class="shrink mr-2"
          contain
          src="./assets/images/autronica_logo.png"
          transition="scale-transition"
          width="70"
        />
        <h3 class="ml-2">License - Tester</h3>
      </div>
      <v-spacer></v-spacer>
      <v-btn :to="{ path: '/' }" text>
        <span class="mr-1">AS-conf</span>
        <v-icon>mdi-ballot-outline</v-icon>
      </v-btn>
      <v-btn :to="{ path: '/asfw' }" text>
        <span class="mr-1">AS-FW</span>
        <v-icon>mdi-file-upload-outline</v-icon>
      </v-btn>
      <v-btn :to="{ path: '/certificate' }" text>
        <span class="mr-1">Cert</span>
        <v-icon>mdi-certificate-outline</v-icon>
      </v-btn>
      <v-btn :to="{ path: '/about' }" text>
        <span class="mr-1">About</span>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-snackbar
      class="snackbar"
      :color="snackbarColor"
      v-model="snackbar"
      timeout="2000"
      auto-height
      top
    >
      <v-icon class="pr-3" dark large>{{ snackbarIcon }}</v-icon>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

    <v-main class="main-view">
      <router-view />
    </v-main>

    <v-footer fixed color="primary" dark>
      <h4 class="ml-2">{{ slogan }}</h4>
      <v-spacer></v-spacer>
      <v-btn
        small
        href="https://www.autronicafire.com/en/"
        target="_blank"
        text
      >
        <span class="mr-2">Find us</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus, LicenseEvent } from '@/utility/eventBus';

export default Vue.extend({
  name: 'App',
  created() {
    EventBus.$on(LicenseEvent.SnackbarError, this.handleSnackbarError);
    EventBus.$on(LicenseEvent.SnackbarFail, this.handleSnackbarFail);
    EventBus.$on(LicenseEvent.SnackbarNormal, this.handleSnackbarNormal);
    EventBus.$on(LicenseEvent.SnackbarSuccess, this.handleSnackbarSuccess);
  },
  data: () => ({
    slogan: process.env.VUE_APP_SLOGAN,
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'grey darken-4',
    snackbarIcon: 'mdi-information-outline',
  }),
  methods: {
    handleSnackbarError(snackbarText = '') {
      this.snackbarText = snackbarText;
      this.snackbarColor = 'red darken-1';
      this.snackbarIcon = 'mdi-alert-circle-outline';
      this.snackbar = true;
    },
    handleSnackbarFail(snackbarText = '') {
      this.snackbarText = snackbarText;
      this.snackbarColor = 'orange darken-4';
      this.snackbarIcon = 'mdi-alert-outline';
      this.snackbar = true;
    },
    handleSnackbarNormal(snackbarText = '') {
      this.snackbarText = snackbarText;
      this.snackbarColor = 'grey darken-4';
      this.snackbarIcon = 'mdi-information-outline';
      this.snackbar = true;
    },
    handleSnackbarSuccess(snackbarText = '') {
      this.snackbarText = snackbarText;
      this.snackbarColor = 'green darken-1';
      this.snackbarIcon = 'mdi-check-circle-outline';
      this.snackbar = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.main-view {
  background-color: #e3f2fd;
}

.snackbar {
  margin-top: 50px;
}
</style>
