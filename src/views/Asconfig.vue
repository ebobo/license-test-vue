<template>
  <v-container>
    <v-list-item-avatar class="ma-1" size="48" rounded="0">
      <v-img src="@/assets/images/lock_icon.png"> </v-img>
    </v-list-item-avatar>

    <v-row justify="center">
      <v-col cols="8" class="row-btn" justify="center">
        <v-tabs fixed-tabs background-color="transparent">
          <v-tab href="#create"> Create Key </v-tab>
          <v-tab-item class="tab-item" value="create">
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
          <v-tab-item class="tab-item" value="import">
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
                    publicKeyFile === null ||
                    privateKeyFile === null ||
                    keyID === ''
                  "
                  @click="uploadKeyPair"
                  >import key</v-btn
                >
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab href="#existing"> Existing Key </v-tab>
          <v-tab-item class="tab-item" value="existing">
            <v-row class="mt-2" justify="center">
              <v-col cols="4" class="row-btn" justify="center">
                <v-text-field
                  prepend-icon="mdi-key"
                  v-model="keyID"
                  label="Key ID"
                ></v-text-field>
              </v-col>
              <v-col cols="4" class="row-btn">
                <v-spacer />
                <v-btn
                  color="deep-orange lighten-1"
                  :disabled="keyID === ''"
                  @click="useKey"
                  >use key</v-btn
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
          label="Publick Key (Base64)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-list-item-avatar class="ma-2" size="54" rounded="0">
      <v-img src="@/assets/images/panel_icon.png"> </v-img>
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
    <v-row justify="center">
      <v-col cols="5">
        <v-text-field
          :append-icon="systemID === '' ? '' : 'mdi-content-copy'"
          prepend-icon="mdi-card-account-details-outline"
          v-model="systemID"
          label="System ID"
          @click:append="copySystemId"
        ></v-text-field>
      </v-col>

      <v-col cols="2" class="row-btn">
        <v-btn color="light-green darken-3" dark @click="generateSystemID"
          >generate id</v-btn
        >
      </v-col>
      <v-col cols="1" class="row-btn" justify="center">
        <v-btn color="red" :disabled="systemID === ''" @click="deleteSystem">
          <v-icon> mdi-trash-can </v-icon></v-btn
        >
      </v-col>
    </v-row>

    <v-row v-for="(psn, index) in snumbers" :key="index" justify="center">
      <v-col cols="8">
        <v-text-field
          prepend-icon="mdi-barcode-scan"
          v-model="snumbers[index]"
          label="Panel Serial Number"
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
        <v-btn
          :loading="uploading"
          :disabled="systemID === '' || chosenFile === null"
          @click="uploadFile"
          >upload config
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-list-item-avatar class="ma-2" size="48" rounded="0">
      <v-img src="@/assets/images/document_gear_icon_blue.png"> </v-img>
    </v-list-item-avatar>

    <v-row justify="center" class="mini-row">
      <v-col cols="2">
        <v-checkbox v-model="demo" label="Demo"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="selfVerify" label="Self Verify"></v-checkbox>
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
    <v-row justify="center" class="mt-0">
      <v-col cols="2">
        <v-checkbox
          v-model="opticalIntegrity"
          label="Optical Integrity"
        ></v-checkbox>
      </v-col>
      <v-col cols="3">
        <v-checkbox
          v-model="requireSignedConfiguration"
          label="Require Signed Configurations"
        ></v-checkbox>
      </v-col>
      <v-col cols="3">
        <v-checkbox
          v-model="allowDowngrades"
          label="Allow Downgrades"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6">
        <v-text-field
          readonly
          prepend-icon="mdi-card-account-details-outline"
          v-model="featureSystemID"
          label="System ID"
        ></v-text-field>
      </v-col>

      <v-col cols="2" class="row-btn">
        <v-btn
          color="purple lighten-1"
          :disabled="featureSystemID === ''"
          @click="setSystemFeatures"
          >Set features</v-btn
        >
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="2">
        <v-btn class="mt-3" color="amber" @click="clearSelection">RESET</v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn
          class="mt-3"
          color="indigo lighten-2"
          :loading="signing"
          :disabled="featureSystemID === ''"
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
          >Download Signed Config</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mb-10" justify="center"> </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  CreateKeyRequest,
  CreateKeyResponse,
  SetAutroSafeFeaturesRequest,
  SignAutroSafeLicenseRequest,
  SignAutroSafeLicenseResponse,
  createKeyPair,
  getPublicKey,
  uploadASConfig,
  uploadKeyPair,
  updateAutroSafeFeatures,
  downloadASConfig,
  signAutroSafeLicense,
  deleteAutroSafeSystem,
} from '../service/rest';
import { makeSN, generateUUID } from '@/utility/tools';
import { EventBus, LicenseEvent } from '@/utility/eventBus';

export default Vue.extend({
  name: 'Asconfig',
  data(): {
    keyID: string;
    publicKey: string;
    chosenFile: File | null;
    privateKeyFile: File | null;
    publicKeyFile: File | null;
    snumbers: string[];
    demo: boolean;
    selfVerify: boolean;
    coverDetection: boolean;
    opticalIntegrity: boolean;
    analogValue: boolean;
    requireSignedConfiguration: boolean;
    allowDowngrades: boolean;
    canSend: boolean;
    systemID: string;
    featureSystemID: string;
    signedSystemID: string;
    uploading: boolean;
    signing: boolean;
  } {
    return {
      keyID: '',
      publicKey: '',
      chosenFile: null,
      privateKeyFile: null,
      publicKeyFile: null,
      snumbers: ['00A7000730980000'],
      demo: false,
      selfVerify: false,
      coverDetection: false,
      opticalIntegrity: false,
      analogValue: false,
      requireSignedConfiguration: false,
      allowDowngrades: false,
      canSend: true,
      systemID: '',
      featureSystemID: '',
      signedSystemID: '',
      uploading: false,
      signing: false,
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
          EventBus.$emit(
            LicenseEvent.SnackbarFail,
            `Failed to create new key.`
          );
          console.log(error);
        });
    },

    useKey() {
      if (this.keyID === '') {
        return;
      }
      getPublicKey(this.keyID)
        .then((response) => this.setKeyInfo(response))
        .catch((error) => {
          EventBus.$emit(LicenseEvent.SnackbarFail, `Failed to retrieve key.`);
          console.log(error);
        });
    },

    uploadKeyPair() {
      if (
        this.keyID === '' ||
        this.privateKeyFile === null ||
        this.publicKeyFile === null
      ) {
        return;
      }
      let formData = new FormData();
      formData.append('private', this.privateKeyFile);
      formData.append('public', this.publicKeyFile);
      formData.append('id', this.keyID);

      uploadKeyPair(formData)
        .then((response) => this.setKeyInfo(response))
        .catch((error) => {
          EventBus.$emit(
            LicenseEvent.SnackbarFail,
            `Failed to upload key pair.`
          );
          console.log(error);
        });
    },

    setKeyInfo(res: CreateKeyResponse) {
      this.keyID = res.keyId;
      this.publicKey = res.key;
    },

    uploadFile() {
      if (this.chosenFile === null || this.systemID === '') {
        return;
      }
      let formData = new FormData();
      formData.append('config', this.chosenFile);
      formData.append('id', this.systemID);
      formData.append('psn', this.snumbers.toString());

      this.uploading = true;
      uploadASConfig(formData)
        .then((response) => {
          this.featureSystemID = response.systemId;
          this.uploading = false;
          EventBus.$emit(
            LicenseEvent.SnackbarSuccess,
            `Config has been uploaded.`
          );
        })
        .catch((error) => {
          EventBus.$emit(
            LicenseEvent.SnackbarError,
            `Error during upload file.`
          );
          this.uploading = false;
          console.log(error);
        });
    },

    generatePSN() {
      for (let i = 0; i < this.snumbers.length; i++) {
        Vue.set(this.snumbers, i, makeSN(16));
      }
    },

    generateSystemID() {
      this.systemID = generateUUID();
    },

    addPSN() {
      this.snumbers = [...this.snumbers, makeSN(16)];
    },

    removePSN() {
      if (this.snumbers.length > 1) {
        this.snumbers.pop();
      }
    },

    deleteSystem() {
      if (this.systemID === '') {
        return;
      }
      deleteAutroSafeSystem(this.systemID)
        .then((response) => {
          console.log(response);
          this.systemID = '';
          EventBus.$emit(
            LicenseEvent.SnackbarSuccess,
            `System has been delete from db.`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setSystemFeatures() {
      const data: SetAutroSafeFeaturesRequest = {
        systemId: this.featureSystemID,
        demo: this.demo,
        selfVerify: this.selfVerify,
        coverDetection: this.coverDetection,
        opticalIntegrity: this.opticalIntegrity,
        analogValue: this.analogValue,
        requireSignedConfig: this.requireSignedConfiguration,
        allowDowngrades: this.allowDowngrades,
      };
      updateAutroSafeFeatures(data)
        .then(() => {
          EventBus.$emit(
            LicenseEvent.SnackbarSuccess,
            `System features been set.`
          );
        })
        .catch(() => {
          EventBus.$emit(
            LicenseEvent.SnackbarFail,
            `Failed to set system features.`
          );
        });
    },

    signSystemConfig() {
      const data: SignAutroSafeLicenseRequest = {
        keyId: this.keyID,
        systemId: this.featureSystemID,
      };
      this.signing = true;
      signAutroSafeLicense(data)
        .then((response) => {
          this.setSignedSystem(response);
          this.signing = false;
          EventBus.$emit(
            LicenseEvent.SnackbarSuccess,
            `Config has been signed.`
          );
        })
        .catch(() => {
          this.signing = false;
          EventBus.$emit(LicenseEvent.SnackbarFail, `Failed to sign license`);
        });
    },

    downloadConfig() {
      downloadASConfig(this.signedSystemID)
        .then(() => {
          this.clearUpload();
        })
        .catch((error) => {
          EventBus.$emit(
            LicenseEvent.SnackbarFail,
            `Failed to download config file.`
          );
          console.log(error);
        });
    },

    async copySystemId() {
      await navigator.clipboard.writeText(this.systemID);
      EventBus.$emit(
        LicenseEvent.SnackbarNormal,
        `sysstem ID has been copied.`
      );
    },

    setSignedSystem(res: SignAutroSafeLicenseResponse) {
      this.signedSystemID = res.systemId;
    },

    clearUpload() {
      this.chosenFile = null;
      this.demo = false;
      this.selfVerify = false;
      this.coverDetection = false;
      this.opticalIntegrity = false;
      this.analogValue = false;
      this.requireSignedConfiguration = false;
      this.allowDowngrades = false;
      this.snumbers = ['00A7000730980000'];
      this.canSend = true;
      this.systemID = '';
      this.featureSystemID = '';
      this.signedSystemID = '';
      this.uploading = false;
      this.signing = false;
    },

    clearSelection() {
      this.chosenFile = null;
      this.privateKeyFile = null;
      this.publicKeyFile = null;
      this.publicKey = '';
      this.demo = false;
      this.selfVerify = false;
      this.coverDetection = false;
      this.opticalIntegrity = false;
      this.analogValue = false;
      this.requireSignedConfiguration = false;
      this.allowDowngrades = false;
      this.snumbers = ['00A7000730980000'];
      this.canSend = true;
      this.systemID = '';
      this.featureSystemID = '';
      this.signedSystemID = '';
      this.keyID = '';
      this.uploading = false;
      this.signing = false;
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

.tab-item {
  background-color: #e3f2fd;
}

.mini-row {
  height: 40px;
}
</style>
