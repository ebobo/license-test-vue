<template>
  <v-container>
    <v-list-item-avatar class="ma-1" size="48" rounded="0">
      <v-img src="@/assets/images/people_icon.png"> </v-img>
    </v-list-item-avatar>
    <v-row justify="center">
      <v-col cols="8">
        <div class="blue--text mb-2">Operators List ( .xlsx )</div>
        <v-file-input
          accept=".xlsx"
          label="Click here to select a file"
          v-model="chosenFile"
          @click:clear="clearSelection"
        ></v-file-input>
      </v-col>
      <v-col cols="1" class="test" align-self="center">
        <v-btn @click="readFile">Read</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="operators.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Operators
            <v-spacer></v-spacer>
            <v-text-field
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="operators"
            :items-per-page="10"
            class="elevation-1 blue--text text--accent-3"
          >
            <template v-slot:[`item.Valid`]="{ item }">
              <v-chip :color="item.Valid === 'TRUE' ? 'green' : 'red'" dark>
                {{ item.Valid === 'TRUE' ? 'Valid' : 'Invalid' }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
interface operator {
  Name: string;
  ID?: string;
  Company?: string;
  Valid: boolean;
}
interface headerItem {
  text: string;
  value: string;
  align?: string;
  sortable?: boolean;
}

import Vue from 'vue';
import xlsxParser from 'xlsx-parse-json';
export default Vue.extend({
  name: 'Certificate',
  data(): {
    chosenFile: File | null;
    operators: operator[];
    headers: headerItem[];
  } {
    return {
      chosenFile: null,
      operators: [],
      headers: [
        {
          text: 'Name',
          sortable: false,
          value: 'Name',
        },
        {
          text: 'ID',
          sortable: true,
          value: 'ID',
        },
        { text: 'Valid', value: 'Valid', sortable: true },
        { text: 'Company', value: 'Company', sortable: false },
      ],
    };
  },
  methods: {
    clearSelection() {
      this.chosenFile = null;
    },
    readFile() {
      if (this.chosenFile) {
        xlsxParser.onFileSelection(this.chosenFile).then((data: any) => {
          this.operators = data.Sheet1;
        });
      }
    },
  },
  computed: {},
});
</script>
