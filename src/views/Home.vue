<template>
  <v-container>
    <div v-if="$auth.isAuthenticated">
      <v-list-item-avatar class="ma-1" size="48" rounded="0">
        <v-img src="@/assets/images/lock_icon.png"> </v-img>
      </v-list-item-avatar>

      <v-row justify="center">
        <v-col cols="8" class="row-btn" justify="center">
          <v-tabs fixed-tabs background-color="transparent">
            <v-tab href="#create"> Create Key </v-tab>
            <v-tab-item value="create">
              <v-row class="mt-2" justify="center">
                <v-col cols="4" class="row-btn" justify="center">
                  <v-btn
                    color="deep-orange lighten-1"
                    :disabled="keyID === ''"
                    @click="getKey"
                    >create key</v-btn
                  >
                </v-col>
                <v-col cols="4" class="row-btn" justify="center">
                  <v-text-field
                    prepend-icon="mdi-key-plus"
                    v-model="keyID"
                    label="Key ID"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab href="#import"> Import Key </v-tab>
            <v-tab-item value="import">
              <v-row class="mt-2" justify="center">
                <v-col cols="3" class="row-btn" justify="center">
                  <v-text-field
                    prepend-icon="mdi-key-plus"
                    v-model="keyID"
                    label="Key ID"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" justify="center">
                  <v-file-input
                    label="Private key file"
                    v-model="privateKeyFile"
                    @click:clear="clearSelection"
                  ></v-file-input>
                </v-col>
                <v-col cols="3" justify="center">
                  <v-file-input
                    label="Public key file"
                    v-model="publicKeyFile"
                    @click:clear="clearSelection"
                  ></v-file-input>
                </v-col>
                <v-col cols="3" class="row-btn" justify="center">
                  <v-btn
                    color="deep-orange lighten-1"
                    :disabled="
                      publicKeyFile === null && privateKeyFile === null
                    "
                    @click="uploadKeyPair"
                    >import key</v-btn
                  >
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row class="mt-2" justify="center">
        <v-col cols="8" class="row-btn" justify="center">
          <v-text-field
            readonly
            prepend-icon="mdi-key-chain"
            v-model="publicKey"
            label="Publick Key (base64)"
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
          <v-btn class="mt-3" color="amber" @click="clearSelection"
            >RESET</v-btn
          >
        </v-col>
      </v-row>
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
      <v-row justify="center">
        <v-col cols="3">
          <v-btn
            class="mt-3"
            color="indigo darken-3"
            dark
            :disabled="!canSend"
            @click="signSystemConfig"
            >Sign System Config</v-btn
          >
        </v-col>
        <v-col cols="3">
          <v-btn
            class="mt-3"
            color="success"
            :disabled="signedSystemID === ''"
            @click="downloadConfig"
            >Download Config</v-btn
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
    </div>
    <div v-if="!$auth.isAuthenticated">
      <v-row class="mt-4" justify="center">
        <v-alert
          color="primary"
          dark
          icon="mdi-account-outline"
          border="left"
          prominent
        >
          Please log in with your username and password to use the autronica
          license service
        </v-alert>
      </v-row>
    </div>
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
  uploadKeyPair,
  downloadASConfig,
  signAutroSafeLicense,
} from '../service/rest';
import { makeSN } from '../utility/tools';
import { useAuth0 } from '@/auth/auth0-plugin';

export default Vue.extend({
  name: 'Home',
  data(): {
    keyID: string;
    publicKey: string;
    chosenFile: File | null;
    privateKeyFile: File | null;
    publicKeyFile: File | null;
    snumbers: string[];
    selfVerify: boolean;
    coverDetection: boolean;
    analogValue: boolean;
    canSend: boolean;
    systemID: string;
    signedSystemID: string;
    licenseKeys: string[];
  } {
    return {
      keyID: '',
      publicKey: '',
      chosenFile: null,
      privateKeyFile: null,
      publicKeyFile: null,
      snumbers: ['343647193632373121003F00'],
      selfVerify: false,
      coverDetection: false,
      analogValue: false,
      canSend: true,
      systemID: '',
      signedSystemID: '6ba296b3-3624-41cc-81fb-753e8c55d495',
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

    uploadKeyPair() {
      console.log('upload key');
      if (this.privateKeyFile === null || this.publicKeyFile === null) {
        return;
      }
      let formData = new FormData();
      formData.append('private', this.privateKeyFile);
      formData.append('public', this.publicKeyFile);
      formData.append('id', this.keyID);

      uploadKeyPair(formData)
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

    signSystemConfig() {
      const data: SignAutroSafeLicenseRequest = {
        keyId: this.keyID,
        systemId: this.systemID,
      };
      signAutroSafeLicense(data)
        .then((response) => this.setSignedSystem(response))
        .catch((error) => {
          console.log(error);
        });
    },

    downloadConfig() {
      downloadASConfig(this.signedSystemID)
        .then((response) => console.log('download'))
        .catch((error) => {
          console.log(error);
        });
    },

    setSignedSystem(res: SignAutroSafeLicenseResponse) {
      this.signedSystemID = res.systemId;
    },

    clearSelection() {
      this.chosenFile = null;
      this.privateKeyFile = null;
      this.publicKeyFile = null;
      this.selfVerify = false;
      this.coverDetection = false;
      this.analogValue = false;
      this.snumbers = ['343647193632373121003F00'];
      this.canSend = true;
      this.licenseKeys = [];
      this.systemID = '';
      this.signedSystemID = '';
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
