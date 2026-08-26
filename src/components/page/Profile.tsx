import { Box, CircularProgress, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getMe } from "../../api/auth";
import { getBalance, depositMoney, withdrawMoney, transferMoney } from "../../api/wallet";
import type { UserMeResponse } from "../../Interface/auth";
import { useNavigate } from "react-router";

export default function Profile() {
    const [user, setUser] = useState<UserMeResponse>();
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [activeModal, setActiveModal] = useState<"deposit" | "withdraw" | "transfer" | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const refreshBalance = async () => {
        try {
            const data = await getBalance();
            setBalance(data.balance);
        } catch (error) {
            console.error("Не вдалося оновити баланс:", error);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [me, wallet] = await Promise.all([getMe(), getBalance()]);
                setUser(me);
                setBalance(wallet.balance);
            } catch (error) {
                console.error("Не вдалося завантажити профіль або баланс:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    function Close() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const handleCloseModal = () => {
        setActiveModal(null);
        setAmount("");
        setEmail("");
    };

    // Опрацювання фінансових операцій
    const handleAction = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return alert("Введіть коректну суму");

        try {
            if (activeModal === "deposit") {
                await depositMoney(numAmount);
            } else if (activeModal === "withdraw") {
                await withdrawMoney(numAmount);
            } else if (activeModal === "transfer") {
                if (!email) return alert("Введіть email отримувача");
                await transferMoney(numAmount, email);
            }
            await refreshBalance(); // Оновлюємо цифру балансу на екрані
            handleCloseModal();
        } catch (error) {
            alert("Операція відхилена. Перевірте баланс або дані.");
        }
    };

    if (loading || !user) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "600px", maxWidth: "350px", m: { lg: "50px", md: "20px", xs: 0 } }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box 
            sx={{
                border: "1px solid #F8FAFC",
                borderRadius: "20px",
                maxWidth: "350px",
                height: "600px",
                m: { lg: "50px", md: "20px", xs: 0 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                boxSizing: "border-box",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
            }}
        >
            <Box sx={{ width: "100%" }}>   
                <Box sx={{ display: "flex", textWrap: "nowrap", alignItems: "center", justifyContent: "space-between" }}>
                    <Stack spacing={"10px"} sx={{ "& .MuiTypography-root": { fontSize: "13px" }}}>
                        <Stack spacing={"5px"} direction={"row"}>
                            <Typography>{user.name}</Typography>
                            <Typography>{user.surname}</Typography>
                        </Stack>
                        <Stack sx={{flexWrap: "wrap"}}>
                            <Typography>{user.email}</Typography>
                            <Typography>{user.phone}</Typography>
                        </Stack>
                    </Stack>
                    <Typography sx={{ fontSize: "14px", cursor: "pointer", color: "#ef4444", fontWeight: "bold" }} onClick={Close}>
                        Log out
                    </Typography>
                </Box>

                <Box sx={{ mt: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
                        {balance} $
                    </Typography>
                </Box>
            </Box>

            <Stack spacing="12px" sx={{ width: "100%", mb: "20px" }}>
                <Button variant="contained" fullWidth sx={{ borderRadius: "12px", textTransform: "none" }} onClick={() => setActiveModal("deposit")}>
                    Deposit
                </Button>
                <Button variant="outlined" fullWidth sx={{ borderRadius: "12px", textTransform: "none" }} onClick={() => setActiveModal("withdraw")}>
                    Withdraw
                </Button>
                <Button variant="text" fullWidth sx={{ borderRadius: "12px", textTransform: "none" }} onClick={() => setActiveModal("transfer")}>
                    Transfer money
                </Button>
            </Stack>

            <Dialog open={activeModal !== null} onClose={handleCloseModal} fullWidth maxWidth="xs" >
                <DialogTitle sx={{ pb: 1 }}>
                    {activeModal === "deposit" && "Поповнити баланс"}
                    {activeModal === "withdraw" && "Зняти кошти"}
                    {activeModal === "transfer" && "Переказ коштів"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing="15px" sx={{ mt: 1 }}>
                        {activeModal === "transfer" && (
                            <TextField 
                                label="Email отримувача" 
                                type="email" 
                                fullWidth 
                                variant="outlined" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        )}
                        <TextField 
                            label="Сума ($)" 
                            type="number" 
                            fullWidth 
                            variant="outlined" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseModal} color="inherit" sx={{ textTransform: "none" }}>Скасувати</Button>
                    <Button onClick={handleAction} variant="contained" sx={{ textTransform: "none", borderRadius: "8px" }}>Підтвердити</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
