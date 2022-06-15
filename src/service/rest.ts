import Axios from 'axios';

const http = Axios.create({
  baseURL: process.env.VUE_APP_API_BASE_PATH,
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      console.log('Logging the error', error);
    }

    throw error;
  }
);

export interface CreateKeyRequest {
  id: string;
  description: string;
}

export interface CreateKeyResponse {
  keyId: string;
  description: string;
  key: string;
  created: string;
  retired: string;
}

export interface SignAutroSafeLicenseRequest {
  keyId: string;
  systemId: string;
}

export interface DownloadSignedAutroSafeConfigRequest {
  systemId: string;
}

export interface SignAutroSafeLicenseResponse {
  systemId: string;
}

export interface ASConfigFile {
  name: string;
  contentType: string;
}

export interface CongfigUploadResponse {
  systemId: string;
}

export interface FirmwareUploadResponse {
  systemId: string;
}

export interface SetAutroSafeFeaturesRequest {
  systemId: string;
  demo: boolean;
  selfVerify: boolean;
  coverDetection: boolean;
  opticalIntegrity: boolean;
  analogValue: boolean;
  requireSignedConfig: boolean;
  allowDowngrades: boolean;
}

export async function uploadKeyPair(
  data: FormData
): Promise<CreateKeyResponse> {
  return http
    .post<CreateKeyResponse>(`/keys/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
}

export async function uploadASConfig(
  data: FormData
): Promise<CongfigUploadResponse> {
  return http
    .post<CongfigUploadResponse>(`/asconfig/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
}

export async function uploadASFirmware(
  data: FormData
): Promise<FirmwareUploadResponse> {
  return http
    .post<FirmwareUploadResponse>(`/asfirmware`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
}

export async function downloadASConfig(systemId: string): Promise<any> {
  let filename: string;
  return http
    .get(`/asconfig/download/${systemId}`, {
      responseType: 'blob',
    })
    .then((response) => {
      filename = response.headers['content-type'].split(';')[1];
      return response.data;
    })
    .then((data) => {
      const downloadLink = window.document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob([data]));
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
}

export async function downloadASFirmwareSignature(
  systemId: string
): Promise<any> {
  let filename: string;
  return http
    .get(`/asfirmware/download/${systemId}`, {
      responseType: 'blob',
    })
    .then((response) => {
      filename = response.headers['content-type'].split(';')[1];
      return response.data;
    })
    .then((data) => {
      const downloadLink = window.document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob([data]));
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
}

export async function createKeyPair(
  data: CreateKeyRequest
): Promise<CreateKeyResponse> {
  return http
    .post<CreateKeyResponse>(`/keys`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data;
    });
}

export async function getPublicKey(keyId: string): Promise<CreateKeyResponse> {
  return http.get(`/keys/${keyId}`).then((response) => {
    return response.data;
  });
}

export async function signAutroSafeLicense(
  data: SignAutroSafeLicenseRequest
): Promise<SignAutroSafeLicenseResponse> {
  return http
    .post<SignAutroSafeLicenseResponse>(`/autrosafe/license`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data;
    });
}

export async function updateAutroSafeFeatures(
  data: SetAutroSafeFeaturesRequest
): Promise<any> {
  return http
    .put<SetAutroSafeFeaturesRequest>(
      `/autrosafe/system/features/${data.systemId}`,
      data
    )
    .then((response) => {
      return response.data;
    });
}

export async function deleteAutroSafeSystem(id: string): Promise<void> {
  return http.delete(`/autrosafe/system/${id}`).then((response) => {
    return response.data;
  });
}
