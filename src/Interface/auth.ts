export interface RegisterInput {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  phone?: string;
}

// Замените эти поля на те, которые реально возвращает ваш auth_service.register в переменной result
export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string; 
}

// Замените эти поля на те, которые реально возвращает ваш auth_service.login (например, token)
export interface LoginResponse {
  token?: string;
  message?: string;
}

export interface UserMeResponse {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  balance: number;
}