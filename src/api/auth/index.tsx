import instance from "@/utils/axios";
import { LoginRequest, RefreshRequest, LoginResponse } from "./types";

export const login = async (loginRequest: LoginRequest) => {
  const response = await instance.post("/users/login", loginRequest);
  const loginResponse: LoginResponse = response.data;
  localStorage.setItem("accessToken", loginResponse.accessToken);
  localStorage.setItem("refreshToken", loginResponse.refreshToken);
};

export const refresh = async (refreshRequest: RefreshRequest) => {
  const response = await instance.post("users/refresh", refreshRequest);
  const refreshResponse: LoginResponse = response.data;
  localStorage.setItem("accessToken", refreshResponse.accessToken);
  return refreshResponse.accessToken;
};
