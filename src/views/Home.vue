<template>
  <v-container>
    <h3 class="ma-4 primary--text">Config :</h3>
    <v-row justify="center">
      <v-col cols="8">
        <div class="blue--text mb-2">AS config file ( .bz2 )</div>
        <v-file-input
          accept=".bz2"
          label="Click here to select a file"
          v-model="chosenFile"
          @click:clear="clearSelection"
        ></v-file-input>
      </v-col>
      <v-col cols="1" class="upload-btn" justify="center">
        <v-btn @click="uploadFile">upload</v-btn>
      </v-col>
    </v-row>

    <h3 class="ma-4 primary--text">System :</h3>

    <v-row justify="center">
      <v-col cols="8">
        <v-text-field
          prepend-icon="mdi-barcode-scan"
          v-model="snumber"
          label="Serial Number"
        ></v-text-field>
      </v-col>
    </v-row>
    <h3 class="ma-4 primary--text">Features :</h3>
    <v-row justify="center">
      <v-col cols="2">
        <v-checkbox v-model="selfVerify" label="Self-Verify"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="coverDetection"
          label="Cover Detection"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="analogValue" label="Analog Values"></v-checkbox>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-btn color="success" @click="send">Get License-Key</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { uploadASConfig } from '../service/rest';

export default Vue.extend({
  name: 'Home',
  data(): {
    chosenFile: File | null;
    snumber: string;
    selfVerify: boolean;
    coverDetection: boolean;
    analogValue: boolean;
  } {
    return {
      chosenFile: null,
      snumber: '343647193632373121003F00',
      selfVerify: false,
      coverDetection: false,
      analogValue: false,
    };
  },

  methods: {
    uploadFile() {
      if (this.chosenFile === null) {
        return;
      }
      let formData = new FormData();
      formData.append('config', this.chosenFile);

      uploadASConfig(formData)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      this.clearSelection();
    },

    clearSelection() {
      this.chosenFile = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.upload-btn {
  display: flex;
  margin-top: 20px;
  align-items: center;
}
</style>
