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

export interface ASConfigFile {
  name: string;
  contentType: string;
}

export interface CongfigUploadResponse {
  ID: number;
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
      return response.data;
    });
}
