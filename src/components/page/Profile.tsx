import { Box, CircularProgress, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getMe } from "../../api/auth";
import { getBalance, depositMoney, withdrawMoney, transferMoney } from "../../api/wallet";
import type { UserMeResponse } from "../../Interface/auth";
import { useNavigate } from "react-router";
import { getTransactionsHistory } from "../../api/transactions";
import type { TransactionItem } from "../../Interface/ITransfer";
import {Link} from "react-router"

export default function Profile() {
    const [user, setUser] = useState<UserMeResponse>();
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<TransactionItem[]>([]); // Масив транзакцій
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [activeModal, setActiveModal] = useState<"deposit" | "withdraw" | "transfer" | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    // Функція швидкого оновлення балансу та історії (пінг бекенду)
    const refreshWalletData = async () => {
        try {
            const [wallet, txHistory] = await Promise.all([
                getBalance(),
                getTransactionsHistory()
            ]);
            setBalance(wallet.balance);
            setTransactions(txHistory.transactions);
            console.log("Дані гаманця та транзакцій успішно оновлено");
        } catch (error) {
            console.error("Не вдалося синхронізувати дані:", error);
        }
    };

    // Первинне завантаження профілю при відкритті сторінки
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [me, wallet, txHistory] = await Promise.all([
                    getMe(),
                    getBalance(),
                    getTransactionsHistory()
                ]);
                setUser(me);
                setBalance(wallet.balance);
                setTransactions(txHistory.transactions);
            } catch (error) {
                console.error("Не вдалося завантажити профіль або баланс:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshWalletData();
        }, 60000);

        return () => clearInterval(interval);
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
            
            await refreshWalletData(); 
            handleCloseModal();
        } catch (error: any) {
            alert(error.message || "Операція відхилена. Перевірте баланс або дані.");
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
        <Box>
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
                <Stack spacing="12px" direction={"row"} 
                    sx={{
                        width: "100%",
                        mb: "20px",
                        mt: "40px",
                        "& .MuiButtonBase-root":{
                            height: "42px"
                        }
                    }}
                >
                    <Button variant="contained" fullWidth sx={{ borderRadius: "12px", textTransform: "none" }} onClick={() => setActiveModal("deposit")}>
                        Deposit
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ borderRadius: "12px", textTransform: "none" }} onClick={() => setActiveModal("withdraw")}>
                        Withdraw
                    </Button>
                    <Button variant="text" fullWidth sx={{ borderRadius: "12px", textTransform: "none" }} onClick={() => setActiveModal("transfer")}>
                        Transfer
                    </Button>
                </Stack>
                <Box sx={{mt: "20px"}}>
                    <Typography sx={{fontSize: "20px"}}>History</Typography>
                    <Box>
                        {
                            transactions.length == 0 ? 
                            (
                                <Box sx={{display: "flex", justifyContent: "center",}}>
                                    <Typography>No transaction</Typography>
                                </Box>
                            )
                            :
                            (
                                <Stack spacing={"10px"} 
                                    sx={{
                                        mt: "20px",
                                        maxHeight: "240px",
                                        overflowY: "auto",
                                        paddingRight: "4px",
                                        
                                        "&::-webkit-scrollbar": {
                                            width: "5px",
                                        },
                                        "&::-webkit-scrollbar-track": {
                                            background: "transparent",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            background: "#cbd5e1", 
                                            borderRadius: "10px",
                                        },
                                        "&::-webkit-scrollbar-thumb:hover": {
                                            background: "#94a3b8",
                                        },
                                        scrollbarWidth: "thin",
                                        scrollbarColor: "#cbd5e1 transparent",
                                    }}
                                >
                                    {transactions.map((item, index) => (
                                        <Box 
                                            key={index}
                                            component={Link}
                                            to={`transaction/${item.id}`}
                                            sx={{
                                                textDecoration: "none",
                                                color:"#F8FAFC",
                                                justifyContent: "space-between",
                                                display: "flex"
                                            }}
                                        >
                                            <Box>
                                                <Typography sx={{fontSize: "14px"}}>{item.type}</Typography>
                                                <Typography sx={{fontSize: "11px"}}>{item.sender?.name} {item.sender?.surname}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography>
                                                    {item.type == "DEPOSIT" || item.receiver?.email == user.email  ? "+" : "-" }{item.amount} USD
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            )
                        }
                    </Box>
                </Box>
            </Box>
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
