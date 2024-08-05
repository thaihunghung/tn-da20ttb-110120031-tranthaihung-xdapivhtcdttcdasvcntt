import { AxiosClient } from '../../../../../service/AxiosClient';
import { getCookie, setCookie } from './cookieUtils';

export async function refreshAccessToken() {
  try {
      console.log("refresh nha")
        const refreshToken = getCookie('refreshToken');
        const response = await AxiosClient.post('/refresh-token', { refreshToken });

        if (response.data.accessToken) {
            setCookie('accessToken', response.data.accessToken, 7); // Assuming the access token expires in 7 days
            return response.data.accessToken;
      }
      console.log("ok2")
    } catch (error) {
        console.error('Failed to refresh access token', error);
        return null;
    }
}
