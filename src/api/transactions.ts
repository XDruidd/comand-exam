import type { TransactionItem, TransactionsHistoryResponse } from "../Interface/ITransfer";
import BASE_URL from "./href";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

export const getTransactionsHistory = async (): Promise<TransactionsHistoryResponse> => {
  const response = await fetch(`${BASE_URL}transactions`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Не вдалося завантажити історію транзакцій");
  }

  return response.json();
};

export const getTransactionDetails = async (transactionId: number): Promise<TransactionItem> => {
  const response = await fetch(`${BASE_URL}transactions/${transactionId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Не вдалося завантажити деталі транзакції №${transactionId}`);
  }

  return response.json();
};
