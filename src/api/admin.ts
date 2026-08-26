import type { AdminStats, AdminUser, AdminUsersResponse } from "../Interface/admin";
import type { TransactionsHistoryResponse } from "../Interface/ITransfer";
import BASE_URL from "./href";

export class AdminApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
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

async function getAdminResource<T>(path: string, signal?: AbortSignal): Promise<T> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new AdminApiError("Требуется авторизация", 401);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}admin/${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new AdminApiError("Не удалось подключиться к серверу", 0);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AdminApiError(
      getErrorMessage(payload) ?? `Ошибка запроса: ${response.status}`,
      response.status,
    );
  }

  return payload as T;
}

export function getAdminStats(signal?: AbortSignal): Promise<AdminStats> {
  return getAdminResource<AdminStats>("stats", signal);
}

export function getAdminUsers(signal?: AbortSignal): Promise<AdminUsersResponse> {
  return getAdminResource<AdminUsersResponse>("users", signal);
}

export function getAdminUser(userId: number, signal?: AbortSignal): Promise<AdminUser> {
  return getAdminResource<AdminUser>(`users/${userId}`, signal);
}

export function getAdminTransactions(signal?: AbortSignal): Promise<TransactionsHistoryResponse> {
  return getAdminResource<TransactionsHistoryResponse>("transactions", signal);
}
