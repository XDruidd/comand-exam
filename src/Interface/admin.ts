import type { UserRole } from "./auth";

export interface AdminStats {
  users_count: number;
  transactions_count: number;
  total_balance: number;
}

export interface AdminUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  role: UserRole;
  balance: number;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
}
