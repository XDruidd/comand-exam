import { useEffect, useState } from "react";
import type { TransactionItem } from "../../Interface/ITransfer";
import { getTransactionDetails } from "../../api/transactions";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router";

type LoadingStatus = "PENDING" | "COMPLETE" | "REGECT";

export default function Transaction(){
    const [transaction, setTransaction] = useState<TransactionItem>();
    const [loading, setLoading] = useState<LoadingStatus>("PENDING");

    const { id } = useParams<{ id: string }>(); 
    
    useEffect(() => {
        if (!id || Number.isNaN(Number(id))) {
            setLoading("REGECT")
            return;
        }

        const fetchInitialData = async () => {
            try{
                const data = await getTransactionDetails(Number(id));
                setTransaction(data)
                setLoading("COMPLETE")
            }
            catch{
                setLoading("REGECT")
            }
        }
        
        fetchInitialData()
        console.log(transaction)
    }, [id])
    
    if(loading == "PENDING"){
        return(
            <Box 
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>
        )
    }
    if(loading == 'REGECT'){
        return(
            <Box 
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography>This not you transaction</Typography>
                <Typography 
                    component={Link}
                    to={"/"}
                    sx={{
                        textDecoration: "underline",
                        color: "#95859a",
                        fontSize: "12px",
                    }} 
                >
                        ← Back to menu
                    </Typography>
            </Box>
        )
    }
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        
        // Перевіряємо, чи дата валідна
        if (isNaN(date.getTime())) return ""; 

        return date.toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return(
        <Stack spacing={"25px"}>
            <Typography 
                component={Link}
                to={"/"}
                sx={{
                    textDecoration: "none",
                    color: "#95859a",
                    fontSize: "15px",
                }} 
            >
                ← Back
            </Typography>
            <Stack spacing={"10px"}>
                <Typography>Id - {transaction?.id}</Typography>
                {
                    transaction?.sender &&
                    <Typography>Sender: {transaction?.sender?.email} - {transaction?.sender?.name} {transaction?.sender?.surname}</Typography>
                }
                {
                    transaction?.receiver &&
                    <Typography>Receiver: {transaction?.receiver?.email} - {transaction?.receiver?.name} {transaction?.receiver?.surname}</Typography>
                }
                <Typography>Amaunt: {transaction?.amount} USD</Typography>
                <Typography>Date: {formatDate(transaction?.createdAt)}</Typography>
                <Typography>Type: {transaction?.type}</Typography>
                <Typography>Status: {transaction?.status}</Typography>
            
            </Stack>
        </Stack>
    )
}