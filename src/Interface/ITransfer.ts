export interface TransactionUser {
  id: number;
  email: string;
  name: string;
  surname: string;
}

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface TransactionItem {
  id: number;
  sender: TransactionUser | null;
  receiver: TransactionUser | null;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionsHistoryResponse {
  transactions: TransactionItem[];
}
