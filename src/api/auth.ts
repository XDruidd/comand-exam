import { useNavigate } from "react-router";
import type { LoginResponse, RegisterInput, RegisterResponse, UserMeResponse } from "../Interface/auth";
import BASE_URL from "./href";

/**
 * Регистрация нового пользователя
 */
export async function registerUser(userData: RegisterInput): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${BASE_URL}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result: RegisterResponse = await response.json();

    if (!response.ok || !result.token) {
      throw new Error(result.error || `Ошибка регистрации: ${response.status}`);
    }

    localStorage.setItem("token", result.token)

    return result;
  } catch (error) {
    console.error("Ошибка в registerUser API:", error);
    throw error;
  }
}

/**
 * Авторизация пользователя
 */
export async function loginUser(loginData: { email?: string; password?: string }): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const result: LoginResponse = await response.json();

    if (!response.ok || !result.token) {
      throw new Error(result.error || `Ошибка авторизации: ${response.status}`);
    }

    localStorage.setItem("token", result.token)
    
    return result;
  } catch (error) {
    console.error("Ошибка в loginUser API:", error);
    throw error;
  }
}

export async function getMe(): Promise<UserMeResponse> {
  try {
    const token = localStorage.getItem("token") 

    const response = await fetch(`${BASE_URL}auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if(response.status == 401){
      const navigate = useNavigate();
      navigate("/registration")
    }

    if (!response.ok) {
      throw new Error(`Не удалось получить профиль: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка в getMe API:", error);
    throw error;
  }
}
