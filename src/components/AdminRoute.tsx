import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthApiError, getMe } from "../api/auth";

type AccessState =
  | { status: "loading" }
  | { status: "allowed" }
  | { status: "forbidden" }
  | { status: "unauthorized" }
  | { status: "error"; message: string };

export default function AdminRoute() {
  const [accessState, setAccessState] = useState<AccessState>({ status: "loading" });
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getMe(controller.signal)
      .then((user) => {
        setAccessState({ status: user.role === "ADMIN" ? "allowed" : "forbidden" });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof AuthApiError && error.status === 401) {
          localStorage.removeItem("token");
          setAccessState({ status: "unauthorized" });
          return;
        }

        setAccessState({
          status: "error",
          message: error instanceof Error ? error.message : "Не удалось проверить права доступа",
        });
      });

    return () => controller.abort();
  }, [requestKey]);

  if (accessState.status === "loading") {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (accessState.status === "forbidden") {
    return <Navigate to="/" replace />;
  }

  if (accessState.status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (accessState.status === "error") {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setAccessState({ status: "loading" });
                setRequestKey((value) => value + 1);
              }}
            >
              Повторить
            </Button>
          }
        >
          {accessState.message}
        </Alert>
      </Box>
    );
  }

  return <Outlet />;
}
