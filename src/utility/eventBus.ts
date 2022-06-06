import Vue from 'vue';

export enum LicenseEvent {
  SnackbarError = 'snackbar:error',
  SnackbarFail = 'snackbar:fail',
  SnackbarNormal = 'snackbar:normal',
  SnackbarSuccess = 'snackbar:success',
}

export const EventBus = new Vue();
