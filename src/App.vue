<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h3 class="ml-2">License - Tester</h3>
      </div>
      <v-spacer></v-spacer>
      <v-btn :to="{ path: '/' }" text>
        <span class="mr-1">Upload</span>
        <v-icon>mdi-file-upload-outline</v-icon>
      </v-btn>
      <v-btn :to="{ path: '/download' }" text>
        <span class="mr-1">Download</span>
        <v-icon>mdi-file-download-outline</v-icon>
      </v-btn>
      <v-btn :to="{ path: '/about' }" text>
        <span class="mr-1">About</span>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
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

export default Vue.extend({
  name: 'App',

  data: () => ({
    slogan: process.env.VUE_APP_SLOGAN,
  }),
});
</script>
