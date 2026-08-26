import { Box, Typography } from "@mui/material";
import { Route, Routes } from "react-router";
import Profile from "./Profile";
import Transaction from "./Transaction";

export default function ProfileHref(){
    return(
        <Box sx={{display: 'flex', justifyContent: "center"}}>
            <Box
                sx={{
                    border: "1px solid #F8FAFC",
                    borderRadius: "20px",
                    maxWidth: "350px",
                    width: "100%",
                    height: "600px",
                    m: { lg: "50px", md: "20px", xs: 0 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "20px",
                    boxSizing: "border-box",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                }}
            >
                <Routes>
                    <Route path="/" element={<Profile />} />
                    <Route path="/transaction/:id" element={<Transaction />} />
                    
                    <Route path="*" element={
                        <Box sx={{ 
                            display: "flex", 
                            justifyContent: "center", 
                            alignItems: "center", 
                            flexGrow: 1,
                            flexDirection: "column" 
                        }}>
                            <Typography color="error">404</Typography>
                            <Typography color="#F8FAFC" variant="body1">Page Not Found</Typography>
                        </Box>
                    } />
                </Routes>
            </Box>
        </Box>
    )
}
