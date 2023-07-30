// auth.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });

    if (response.status === 200) {
      const accessToken = response.data.access_token;
      localStorage.setItem("access_token", accessToken);
      console.log(accessToken);
      return true;
    }
  } catch (error) {
    console.error("Ошибка аутентификации", error);
    return false;
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};
