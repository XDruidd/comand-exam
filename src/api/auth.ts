import type { LoginResponse, RegisterInput, RegisterResponse, UserMeResponse } from "../Interface/auth";
import BASE_URL from "./href";

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

function getErrorMessage(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  if ("error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  if ("detail" in payload && typeof payload.detail === "string") {
    return payload.detail;
  }

  return undefined;
}

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

export async function getMe(signal?: AbortSignal): Promise<UserMeResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new AuthApiError("Требуется авторизация", 401);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new AuthApiError("Не удалось подключиться к серверу", 0);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AuthApiError(
      getErrorMessage(payload) ?? `Не удалось получить профиль: ${response.status}`,
      response.status,
    );
  }

  return payload as UserMeResponse;
}
