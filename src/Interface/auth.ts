export interface RegisterInput {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  phone?: string;
}

export interface UserResponseData {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  balance: number;
}

export interface RegisterResponse {
  message?: string;
  token?: string;
  user?: UserResponseData;
  error?: string;
}

export interface LoginResponse {
  message?: string;
  token?: string;
  user?: UserResponseData;
  error?: string;
}

export interface UserMeResponse {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  balance: number;
}
