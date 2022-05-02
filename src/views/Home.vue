<template>
  <v-container>
    <v-list-item-avatar class="ma-2" size="48" rounded="0">
      <v-img src="@/assets/images/lock_icon.png"> </v-img>
    </v-list-item-avatar>
    <v-row justify="center">
      <v-col cols="2" class="row-btn" justify="center">
        <v-btn
          color="deep-orange lighten-1"
          :disabled="keyID === ''"
          @click="getKey"
          >get me a key</v-btn
        >
      </v-col>
      <v-col cols="3" class="row-btn" justify="center">
        <v-text-field
          prepend-icon="mdi-key-plus"
          v-model="keyID"
          label="Key ID"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" class="row-btn" justify="center">
        <v-text-field
          readonly
          prepend-icon="mdi-key-chain"
          v-model="publicKey"
          label="Publick Key"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-list-item-avatar class="ma-2" size="46" rounded="0">
      <v-img src="@/assets/images/document_gear_icon_blue.png"> </v-img>
    </v-list-item-avatar>
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
    </v-row>
    <v-list-item-avatar class="ma-2" size="54" rounded="0">
      <v-img src="@/assets/images/panel_icon.png"> </v-img>
    </v-list-item-avatar>
    <v-row justify="center">
      <v-col cols="8">
        <v-text-field
          readonly
          prepend-icon="mdi-card-account-details-outline"
          v-model="systemID"
          label="Sytem ID"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-for="(psn, index) in snumbers" :key="index" justify="center">
      <v-col cols="8">
        <v-text-field
          readonly
          prepend-icon="mdi-barcode-scan"
          v-model="snumbers[index]"
          label="Serial Number"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="1" class="upload-btn" justify="center">
        <v-btn
          color="green accent-4"
          dark
          class="ml-6"
          small
          fab
          @click="addPSN"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2" class="upload-btn" justify="center">
        <v-btn
          color="red darken-1"
          dark
          class="ml-6"
          small
          fab
          @click="removePSN"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2" class="upload-btn" justify="center">
        <v-btn color="cyan" dark @click="generatePSN">generate psn</v-btn>
      </v-col>
      <v-col cols="2" class="upload-btn" justify="center">
        <v-btn @click="uploadFile">upload config</v-btn>
      </v-col>
    </v-row>
    <v-list-item-avatar class="ma-2" size="48" rounded="0">
      <v-img src="@/assets/images/checkbox_icon.png"> </v-img>
    </v-list-item-avatar>
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
      <v-col cols="2">
        <v-btn class="mt-3" color="amber" @click="clearSelection">RESET</v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="4">
        <v-btn
          class="mt-3"
          color="success"
          :disabled="!canSend"
          @click="getLicensedConfig"
          >Get License-Key</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-for="(_, index) in licenseKeys" :key="index" justify="center">
      <v-col cols="10">
        <v-text-field
          readonly
          prepend-icon="mdi-file-sign"
          v-model="licenseKeys[index]"
          label="License Key"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mb-2" justify="center"> </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  CreateKeyRequest,
  CreateKeyResponse,
  SignAutroSafeLicenseRequest,
  SignAutroSafeLicenseResponse,
  createKeyPair,
  uploadASConfig,
  signAutroSafeLicense,
} from '../service/rest';
import { makeSN } from '../utility/tools';

export default Vue.extend({
  name: 'Home',
  data(): {
    keyID: string;
    publicKey: string;
    chosenFile: File | null;
    snumbers: string[];
    selfVerify: boolean;
    coverDetection: boolean;
    analogValue: boolean;
    canSend: boolean;
    systemID: string;
    licenseKeys: string[];
  } {
    return {
      keyID: '',
      publicKey: '',
      chosenFile: null,
      snumbers: ['343647193632373121003F00'],
      selfVerify: false,
      coverDetection: false,
      analogValue: false,
      canSend: true,
      systemID: '',
      licenseKeys: [],
    };
  },

  methods: {
    getKey() {
      const data: CreateKeyRequest = {
        id: this.keyID,
        description: 'Autrosafe public key',
      };
      createKeyPair(data)
        .then((response) => this.setKeyInfo(response))
        .catch((error) => {
          console.log(error);
        });
    },

    setKeyInfo(res: CreateKeyResponse) {
      this.keyID = res.keyId;
      this.publicKey = res.key;
    },

    uploadFile() {
      if (this.chosenFile === null) {
        return;
      }
      let formData = new FormData();
      formData.append('config', this.chosenFile);
      formData.append('system', this.snumbers.toString());
      formData.append('sv', this.selfVerify ? 'true' : 'false');
      formData.append('cd', this.coverDetection ? 'true' : 'false');
      formData.append('av', this.analogValue ? 'true' : 'false');

      uploadASConfig(formData)
        .then((response) => {
          this.systemID = response.systemId;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    generatePSN() {
      for (let i = 0; i < this.snumbers.length; i++) {
        Vue.set(this.snumbers, i, makeSN(24));
      }
    },

    addPSN() {
      this.snumbers = [...this.snumbers, makeSN(24)];
    },

    removePSN() {
      if (this.snumbers.length > 1) {
        this.snumbers.pop();
      }
    },

    getLicensedConfig() {
      const data: SignAutroSafeLicenseRequest = {
        keyId: this.keyID,
        systemId: this.systemID,
      };
      signAutroSafeLicense(data)
        .then((response) => this.downloadConfig(response))
        .catch((error) => {
          console.log(error);
        });
    },

    downloadConfig(res: SignAutroSafeLicenseResponse) {
      console.log(res.licenseKey);
      this.licenseKeys = res.licenseKey.split(',');
      console.log(this.licenseKeys);
    },

    clearSelection() {
      this.chosenFile = null;
      this.selfVerify = false;
      this.coverDetection = false;
      this.analogValue = false;
      this.snumbers = ['343647193632373121003F00'];
      this.canSend = true;
      this.licenseKeys = [];
    },
  },
});
</script>

<style lang="scss" scoped>
.upload-btn {
  display: flex;
  margin-top: 15px;
  align-items: center;
}

.row-btn {
  display: flex;
  margin-top: 0px;
  align-items: center;
}
</style>
