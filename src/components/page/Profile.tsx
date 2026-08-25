import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getMe } from "../../api/auth";
import type { UserMeResponse } from "../../Interface/auth";
import { useNavigate } from "react-router";

export default function Profile(){
    const [user, setUser] = useState<UserMeResponse>(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const me = await getMe();
                setUser(me);
            } catch (error) {
                console.error("Не вдалося завантажити профіль:", error);
            }
        }
        fetchUser();
    }, [])

    function Close(){
        localStorage.removeItem("token")
        navigate("/login")
    }

    return(
        <Box 
            sx={{
                border: "1px solid #F8FAFC",
                borderRadius: "20px",
                maxWidth: "350px",
                height: "600px",
                m: {lg: "50px", md: "20px", xs: 0},
                display: "flex",
                alignItems: !user ? "center" : "normal",
                justifyContent: !user ? "center" : "normal",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            {
                user ? (
                    <Box
                        sx={{width: "100%"}}
                    >   
                        <Box
                            sx={{
                                display: "flex",
                                textWrap: "nowrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack spacing={"10px"} sx={{"& .MuiTypography-root": {fontSize: "13px"}}}>
                                <Stack spacing={"5px"} direction={"row"}>
                                    <Typography>{user.name}</Typography>
                                    <Typography>{user.surname}</Typography>
                                </Stack>
                                <Stack spacing={"15px"} direction={"row"}>
                                    <Typography>{user.email}</Typography>
                                    <Typography>{user.phone}</Typography>
                                </Stack>
                            </Stack>
                            <Typography sx={{fontSize: "18px", cursor: "pointer"}} onClick={Close}>
                                Log out
                            </Typography>
                        </Box>
                        <Box sx={{
                            mt: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Typography sx={{fontSize: "40px"}}>
                                {user.balance} $
                            </Typography>
                        </Box>
                    </Box>
                )
                :
                (
                    <CircularProgress />
                )
            }
        </Box>
    )
}