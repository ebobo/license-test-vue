<template>
  <v-container>
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',
  data(): {
    chosenFile: File | null;
  } {
    return {
      chosenFile: null,
    };
  },

  methods: {
    uploadFile() {
      this.clearSelection();
      if (this.chosenFile === null) {
        return;
      }
      console.log('update');
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
