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
        <div class="blue--text mb-2">
          AS Firmware files( .elf and .version )
        </div>
        <v-row class="mt-2">
          <v-chip class="mt-4 ml-2 mr-2" color="success" outlined>
            <v-icon left> mdi-desktop-classic </v-icon>
            Computer Controller
          </v-chip>
          <v-file-input
            class="mr-2"
            accept=".elf"
            label="Click here to select the computer controller .elf file"
            v-model="ccFile"
            @click:clear="clearSelection"
          ></v-file-input>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-chip class="mt-4 ml-2 mr-2" color="primary" outlined>
            <v-icon left> mdi-wan </v-icon>
            Network Monitor
          </v-chip>
          <v-file-input
            class="mr-2"
            accept=".elf"
            label="Click here to select the network monitor .elf file"
            v-model="nmFile"
            @click:clear="clearSelection"
          ></v-file-input>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-chip class="mt-4 ml-2 mr-2" color="deep-purple accent-4" outlined>
            <v-icon left> mdi-monitor-eye </v-icon>
            System Monitor
          </v-chip>
          <v-file-input
            class="mr-2"
            accept=".elf"
            label="Click here to select the system monitor .elf file"
            v-model="smFile"
            @click:clear="clearSelection"
          ></v-file-input>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-chip class="mt-4 ml-2 mr-2" color="indigo darken-3" outlined>
            <v-icon left> mdi-tag-text-outline </v-icon>
            Firmware Version
          </v-chip>
          <v-file-input
            class="mr-2"
            accept=".version"
            label="Click here to select the autrosafe version .version file"
            v-model="versionFile"
            @click:clear="clearSelection"
          ></v-file-input>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="5">
        <v-text-field
          prepend-icon="mdi-card-account-details-outline"
          v-model="systemID"
          label="System ID"
        ></v-text-field>
      </v-col>

      <v-col cols="2" class="row-btn">
        <v-btn color="light-green darken-3" dark @click="generateSystemID"
          >generate id</v-btn
        >
      </v-col>
      <v-col cols="1" class="row-btn" justify="center">
        <v-btn color="red" :disabled="systemID === ''" @click="deleteSystem"
          >del</v-btn
        >
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-btn class="mt-3" color="amber" @click="clearSelection"
          >RESET ALL</v-btn
        >
      </v-col>
      <v-col cols="4">
        <v-btn
          class="mt-3"
          :loading="uploading"
          :disabled="
            systemID === '' ||
            ccFile === null ||
            nmFile === null ||
            smFile === null
          "
          @click="uploadFile"
          >upload and sign firmware files
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mt-3"
          color="success"
          :disabled="signedSystemID === ''"
          @click="downloadFirmwareSignature"
          >Download License</v-btn
        >
      </v-col>
    </v-row>

    <v-row justify="center"> </v-row>
    <v-row class="mb-10" justify="center"> </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  CreateKeyRequest,
  CreateKeyResponse,
  SignAutroSafeLicenseResponse,
  createKeyPair,
  getPublicKey,
  uploadASFirmware,
  uploadKeyPair,
  downloadASFirmwareSignature,
} from '../service/rest';
import { generateUUID } from '@/utility/tools';
import { EventBus, LicenseEvent } from '@/utility/eventBus';

export default Vue.extend({
  name: 'Asconfig',
  data(): {
    keyID: string;
    publicKey: string;
    ccFile: File | null;
    nmFile: File | null;
    smFile: File | null;
    versionFile: File | null;
    privateKeyFile: File | null;
    publicKeyFile: File | null;
    canSend: boolean;
    systemID: string;
    signedSystemID: string;
    licenseKeys: string[];
    uploading: boolean;
  } {
    return {
      keyID: '',
      publicKey: '',
      ccFile: null,
      nmFile: null,
      smFile: null,
      versionFile: null,
      privateKeyFile: null,
      publicKeyFile: null,
      canSend: true,
      systemID: '',
      signedSystemID: '',
      licenseKeys: [],
      uploading: false,
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
      if (
        this.ccFile === null ||
        this.nmFile === null ||
        this.smFile === null ||
        this.versionFile === null ||
        this.systemID === '' ||
        this.keyID === ''
      ) {
        return;
      }
      let formData = new FormData();
      formData.append('computerController', this.ccFile);
      formData.append('networkMonitor', this.nmFile);
      formData.append('systemMonitor', this.smFile);
      formData.append('version', this.versionFile);
      formData.append('systemId', this.systemID);
      formData.append('keyId', this.keyID);

      this.uploading = true;
      uploadASFirmware(formData)
        .then((response) => {
          this.signedSystemID = response.systemId;
          this.uploading = false;
          EventBus.$emit(
            LicenseEvent.SnackbarSuccess,
            `Firmware has been uploaded and signed.`
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

    generateSystemID() {
      this.systemID = generateUUID();
    },

    deleteSystem() {
      this.systemID = '';
    },

    downloadFirmwareSignature() {
      downloadASFirmwareSignature(this.signedSystemID)
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

    setSignedSystem(res: SignAutroSafeLicenseResponse) {
      this.signedSystemID = res.systemId;
    },

    clearUpload() {
      this.canSend = true;
      this.licenseKeys = [];
      this.systemID = '';
      this.signedSystemID = '';
      this.uploading = false;
    },

    clearSelection() {
      this.ccFile = null;
      this.nmFile = null;
      this.smFile = null;
      this.versionFile = null;
      this.privateKeyFile = null;
      this.publicKeyFile = null;
      this.publicKey = '';
      this.canSend = true;
      this.licenseKeys = [];
      this.systemID = '';
      this.signedSystemID = '';
      this.keyID = '';
      this.uploading = false;
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
