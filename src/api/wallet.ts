import BASE_URL from "./href";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

// 1. Отримати баланс (GET)
export const getBalance = async () => {
  const response = await fetch(`${BASE_URL}wallet/balance`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error("Помилка отримання балансу");
  
  return response.json();
};

// 2. Поповнення (POST)
export const depositMoney = async (amount: number) => {
  const response = await fetch(`${BASE_URL}wallet/deposit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  
  if (!response.ok) throw new Error("Помилка поповнення");
  
  return response.json();
};

// 3. Зняття (POST)
export const withdrawMoney = async (amount: number) => {
  const response = await fetch(`${BASE_URL}wallet/withdraw`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) throw new Error("Помилка зняття коштів");
  
  return response.json();
};

// 4. Переказ (POST)
export const transferMoney = async (amount: number, receiverEmail: string) => {
  const response = await fetch(`${BASE_URL}wallet/transfer`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ 
      amount: amount, 
      receiver_email: receiverEmail 
    }),
  });
  console.log(response);
  if (!response.ok) throw new Error("Помилка переказу коштів");
  
  return response.json();
};
