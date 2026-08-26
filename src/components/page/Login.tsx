import { useState } from "react";
import { Box, Button, Grid, TextField, Typography, Alert } from "@mui/material"; 
import { Link, useNavigate } from "react-router"; 
import { loginUser } from "../../api/auth";

export default function Login() {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const navigate = useNavigate();
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setServerError(null);

        const data = new FormData(event.currentTarget);
        const newErrors: { [key: string]: string } = {};

        const requiredFields = ["email", "password"];

        requiredFields.forEach((field) => {
            const value = data.get(field) as string;
            if (!value || !value.trim()) {
                newErrors[field] = "Это поле обязательно для заполнения";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const loginData = Object.fromEntries(data) as { email?: string; password?: string };
            
            const loginResult = await loginUser(loginData);     

            if (loginResult.token) {
                navigate("/");
            }
            
        } catch (error: any) {
            console.error(error.message || "Произошла непредвиденная ошибка");
            setServerError(error.message || "Неверный email или пароль");
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}> 
            <Box sx={{ border: "1px solid #F8FAFC", borderRadius: "20px", padding: "25px", maxWidth: "450px", width: "100%" }}> 
                <Typography variant="h5" sx={{ color: "#F8FAFC", mb: 2, textAlign: "center" }}>
                    LOGIN
                </Typography> 

                {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {serverError}
                    </Alert>
                )}

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}> 
                    <Grid container spacing={2} sx={{ 
                        "& .MuiFormLabel-root, & *": { color: "#F8FAFC !important" }, 
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#F8FAFC !important', borderWidth: '1px !important' }, 
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#F8FAFC !important', color: "#F8FAFC !important" }, 
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F8FAFC !important', borderWidth: '2px !important', color: "#F8FAFC !important" }, 
                        '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'red !important' }, 
                        '& .MuiFormHelperText-root.Mui-error': { color: 'red !important' }, 
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend': { backgroundColor: '#141e34 !important' }, 
                        "& input:-webkit-autofill": { 
                            color: "#F8FAFC !important", 
                            WebkitBoxShadow: "0 0 0 1000px #141e34 inset !important", 
                            WebkitTextFillColor: "#F8FAFC !important", 
                            caretColor: "#F8FAFC !important", 
                            transition: "background-color 5000s ease-in-out 0s !important" 
                        },


                    }}> 
                        
                        <Grid size={12}> 
                            <TextField 
                                required 
                                fullWidth 
                                id="email" 
                                label="Email адрес" 
                                name="email" 
                                autoComplete="email" 
                                autoFocus
                                error={!!errors.email}
                                helperText={errors.email}
                            /> 
                        </Grid> 
                        <Grid size={12}> 
                            <TextField 
                                required 
                                fullWidth 
                                name="password" 
                                label="Пароль" 
                                type="password" 
                                id="password" 
                                autoComplete="current-password" 
                                error={!!errors.password}
                                helperText={errors.password}
                            /> 
                        </Grid> 
                    </Grid> 

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        disabled={isSubmitting}
                        sx={{ mt: 3, mb: 2, bgcolor: "#322ca2" }}
                    > 
                        {isSubmitting ? "Вход..." : "Войти"}
                    </Button> 

                    <Grid container sx={{ justifyContent: "flex-end" }}> 
                        <Grid> 
                            <Box component={Link} to={"/registration"} sx={{ textDecoration: "none", color: "#F8FAFC" }}> 
                                Нет аккаунта? Зарегистрироваться
                            </Box> 
                        </Grid> 
                    </Grid> 
                </Box> 
            </Box> 
        </Box> 
    );
}