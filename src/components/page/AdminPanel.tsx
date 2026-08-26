import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AdminApiError,
  getAdminStats,
  getAdminTransactions,
  getAdminUser,
  getAdminUsers,
} from "../../api/admin";
import type { AdminStats, AdminUser } from "../../Interface/admin";
import type { TransactionItem } from "../../Interface/ITransfer";

interface SectionState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function formatTransactionUser(user: TransactionItem["sender"]): string {
  return user ? `${user.name} ${user.surname} (${user.email})` : "—";
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function getErrorText(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [statsState, setStatsState] = useState<SectionState<AdminStats>>({
    data: null,
    loading: true,
    error: null,
  });
  const [usersState, setUsersState] = useState<SectionState<AdminUser[]>>({
    data: null,
    loading: true,
    error: null,
  });
  const [transactionsState, setTransactionsState] = useState<SectionState<TransactionItem[]>>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userDetailsState, setUserDetailsState] = useState<SectionState<AdminUser>>({
    data: null,
    loading: false,
    error: null,
  });
  const [detailsRequestKey, setDetailsRequestKey] = useState(0);

  const handleAuthorizationError = useCallback(
    (error: unknown): boolean => {
      if (!(error instanceof AdminApiError)) {
        return false;
      }

      if (error.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return true;
      }

      if (error.status === 403) {
        navigate("/", { replace: true });
        return true;
      }

      return false;
    },
    [navigate],
  );

  useEffect(() => {
    const controller = new AbortController();

    getAdminStats(controller.signal)
      .then((data) => setStatsState({ data, loading: false, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error) || handleAuthorizationError(error)) {
          return;
        }
        setStatsState({ data: null, loading: false, error: getErrorText(error, "Не удалось загрузить статистику") });
      });

    getAdminUsers(controller.signal)
      .then((data) => setUsersState({ data: data.users, loading: false, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error) || handleAuthorizationError(error)) {
          return;
        }
        setUsersState({ data: null, loading: false, error: getErrorText(error, "Не удалось загрузить пользователей") });
      });

    getAdminTransactions(controller.signal)
      .then((data) => setTransactionsState({ data: data.transactions, loading: false, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error) || handleAuthorizationError(error)) {
          return;
        }
        setTransactionsState({ data: null, loading: false, error: getErrorText(error, "Не удалось загрузить транзакции") });
      });

    return () => controller.abort();
  }, [handleAuthorizationError, reloadKey]);

  useEffect(() => {
    if (selectedUserId === null) {
      return;
    }

    const controller = new AbortController();

    getAdminUser(selectedUserId, controller.signal)
      .then((data) => setUserDetailsState({ data, loading: false, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error) || handleAuthorizationError(error)) {
          return;
        }
        setUserDetailsState({ data: null, loading: false, error: getErrorText(error, "Не удалось загрузить пользователя") });
      });

    return () => controller.abort();
  }, [detailsRequestKey, handleAuthorizationError, selectedUserId]);

  const reloadAll = () => {
    setStatsState((state) => ({ ...state, loading: true, error: null }));
    setUsersState((state) => ({ ...state, loading: true, error: null }));
    setTransactionsState((state) => ({ ...state, loading: true, error: null }));
    setReloadKey((value) => value + 1);
  };

  const openUserDetails = (userId: number) => {
    setSelectedUserId(userId);
    setUserDetailsState({ data: null, loading: true, error: null });
  };

  const closeUserDetails = () => {
    setSelectedUserId(null);
    setUserDetailsState({ data: null, loading: false, error: null });
  };

  const retryUserDetails = () => {
    setUserDetailsState({ data: null, loading: true, error: null });
    setDetailsRequestKey((value) => value + 1);
  };

  const tableSx = {
    bgcolor: "#18243d",
    color: "#F8FAFC",
    border: "1px solid rgba(248, 250, 252, 0.16)",
    borderRadius: "16px",
    backgroundImage: "none",
    "& .MuiTableCell-root": {
      color: "#F8FAFC",
      borderColor: "rgba(248, 250, 252, 0.12)",
      whiteSpace: "nowrap",
    },
    "& .MuiTableCell-head": {
      bgcolor: "#202f4d",
      fontWeight: 700,
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#141e34", p: { xs: 2, md: 4 } }}>
      <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "3rem" } }}>
              Admin Panel
            </Typography>
            <Typography sx={{ color: "rgba(248, 250, 252, 0.7)", mt: 0.5 }}>
              Пользователи, транзакции и общая статистика
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/" variant="outlined" color="inherit">
              В профиль
            </Button>
            <Button variant="contained" onClick={reloadAll}>
              Обновить
            </Button>
          </Stack>
        </Stack>

        <Box component="section" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Статистика</Typography>
            {statsState.loading && <CircularProgress size={20} />}
          </Stack>
          {statsState.error && (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={reloadAll}>Повторить</Button>}>
              {statsState.error}
            </Alert>
          )}
          {statsState.data && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                gap: 2,
              }}
            >
              {[
                { label: "Пользователи", value: statsState.data.users_count },
                { label: "Транзакции", value: statsState.data.transactions_count },
                { label: "Общий баланс", value: formatCurrency(statsState.data.total_balance) },
              ].map((item) => (
                <Paper
                  key={item.label}
                  sx={{
                    p: 2.5,
                    bgcolor: "#18243d",
                    color: "#F8FAFC",
                    border: "1px solid rgba(248, 250, 252, 0.16)",
                    borderRadius: "16px",
                    backgroundImage: "none",
                  }}
                >
                  <Typography sx={{ color: "rgba(248, 250, 252, 0.68)", mb: 1 }}>{item.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        <Box component="section" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Пользователи</Typography>
            {usersState.loading && <CircularProgress size={20} />}
          </Stack>
          {usersState.error && (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={reloadAll}>Повторить</Button>}>
              {usersState.error}
            </Alert>
          )}
          {usersState.data && usersState.data.length === 0 && <Alert severity="info">Пользователей нет</Alert>}
          {usersState.data && usersState.data.length > 0 && (
            <TableContainer component={Paper} sx={tableSx}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Пользователь</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Телефон</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell align="right">Баланс</TableCell>
                    <TableCell>Создан</TableCell>
                    <TableCell align="right">Действие</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersState.data.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name} {user.surname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color={user.role === "ADMIN" ? "warning" : "default"}
                          variant={user.role === "ADMIN" ? "filled" : "outlined"}
                          sx={user.role === "USER" ? { color: "#F8FAFC", borderColor: "rgba(248, 250, 252, 0.4)" } : undefined}
                        />
                      </TableCell>
                      <TableCell align="right">{formatCurrency(user.balance)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" onClick={() => openUserDetails(user.id)}>
                          Детали
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box component="section">
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Транзакции</Typography>
            {transactionsState.loading && <CircularProgress size={20} />}
          </Stack>
          {transactionsState.error && (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={reloadAll}>Повторить</Button>}>
              {transactionsState.error}
            </Alert>
          )}
          {transactionsState.data && transactionsState.data.length === 0 && <Alert severity="info">Транзакций нет</Alert>}
          {transactionsState.data && transactionsState.data.length > 0 && (
            <TableContainer component={Paper} sx={tableSx}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    <TableCell>Отправитель</TableCell>
                    <TableCell>Получатель</TableCell>
                    <TableCell>Дата</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionsState.data.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={
                            transaction.status === "COMPLETED"
                              ? "success"
                              : transaction.status === "FAILED"
                                ? "error"
                                : "warning"
                          }
                        />
                      </TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{formatTransactionUser(transaction.sender)}</TableCell>
                      <TableCell>{formatTransactionUser(transaction.receiver)}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Dialog
        open={selectedUserId !== null}
        onClose={closeUserDetails}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "#18243d",
            color: "#F8FAFC",
            backgroundImage: "none",
            border: "1px solid rgba(248, 250, 252, 0.16)",
          },
        }}
      >
        <DialogTitle>Детали пользователя</DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(248, 250, 252, 0.12)" }}>
          {userDetailsState.loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {userDetailsState.error && (
            <Alert
              severity="error"
              action={<Button color="inherit" size="small" onClick={retryUserDetails}>Повторить</Button>}
            >
              {userDetailsState.error}
            </Alert>
          )}
          {userDetailsState.data && (
            <Stack spacing={2}>
              {[
                ["ID", userDetailsState.data.id],
                ["Имя", `${userDetailsState.data.name} ${userDetailsState.data.surname}`],
                ["Email", userDetailsState.data.email],
                ["Телефон", userDetailsState.data.phone || "—"],
                ["Роль", userDetailsState.data.role],
                ["Баланс", formatCurrency(userDetailsState.data.balance)],
                ["Дата создания", formatDate(userDetailsState.data.createdAt)],
              ].map(([label, value]) => (
                <Box key={label} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" }, gap: 1 }}>
                  <Typography sx={{ color: "rgba(248, 250, 252, 0.65)" }}>{label}</Typography>
                  <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUserDetails} color="inherit">Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
