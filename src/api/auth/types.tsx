export type SignUpRequest = {
  username: string;
  password: string;
  passwordConfirm: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'bearer';
};

export type RefreshRequest = {
  refreshToken: string;
};
