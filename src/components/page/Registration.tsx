import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material"; 
import { Link, useNavigate } from "react-router"; 
import { registerUser } from "../../api/auth";
import type { RegisterInput } from "../../Interface/auth";

export default function Registration() {
    // Состояние для хранения ошибок полей
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        const newErrors: { [key: string]: string } = {};

        const requiredFields = ["name", "surname", "email", "phone", "password"];

        requiredFields.forEach((field) => {
            const value = data.get(field) as string;
            if (!value || !value.trim()) {
                newErrors[field] = "Importman Data";
            }
        });

        const email = (data.get("email") as string || "").trim();
        const phone = (data.get("phone") as string || "").trim();

        if (email && !newErrors.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = "not corect email";
            }
        }

        if (phone && !newErrors.phone) {
            const phoneRegex = /^\+?[0-9]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                newErrors.phone = "not valid number (example - +380XXXXXXXXX)";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const full_data : RegisterInput = Object.fromEntries(data) as any;
            const register = await registerUser(full_data);

            if (register.token) {
                navigate("/");
            }
        }
        catch (error: any) {
            console.error(error.message || "eror");
            setErrors({ server: error.message || "eror register" });
        } 
        finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}> 
            <Box sx={{ border: "1px solid #F8FAFC", borderRadius: "20px", padding: "25px", maxWidth: "1200px", width: "100%" }}> 
                <Typography variant="h5" sx={{ color: "#F8FAFC", mb: 2, textAlign: "center" }}>
                REGISTER
                </Typography> 

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
                    }}
                > 
                
                    <Grid size={{ xs: 12, sm: 6 }}> 
                    <TextField 
                        autoComplete="given-name" 
                        name="name" 
                        required 
                        fullWidth 
                        id="name" 
                        label="Имя" 
                        autoFocus 
                        error={!!errors.name}
                        helperText={errors.name}
                    /> 
                    </Grid> 
                    <Grid size={{ xs: 12, sm: 6 }}> 
                    <TextField 
                        required 
                        fullWidth 
                        id="surname" 
                        label="Фамилия" 
                        name="surname" 
                        autoComplete="family-name" 
                        error={!!errors.surname}
                        helperText={errors.surname}
                    /> 
                    </Grid> 
                    <Grid size={12}> 
                    <TextField 
                        required 
                        fullWidth 
                        id="email" 
                        label="Email адрес" 
                        name="email" 
                        autoComplete="email" 
                        error={!!errors.email}
                        helperText={errors.email}
                    /> 
                    </Grid> 
                    <Grid size={12}> 
                    <TextField 
                        required 
                        fullWidth 
                        id="phone" 
                        label="Номер телефона" 
                        name="phone" 
                        autoComplete="phone" 
                        error={!!errors.phone}
                        helperText={errors.phone}
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
                        autoComplete="new-password" 
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
                    {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
                </Button> 

                <Grid container sx={{ justifyContent: "flex-end" }}> 
                    <Grid sx={{ textDecoration: "none" }}> 
                        <Box component={Link} to={"/login"} sx={{ textDecoration: "none", color: "#F8FAFC" }}> 
                            Уже есть аккаунт? Войти 
                        </Box> 
                    </Grid> 
                </Grid> 
                </Box> 
            </Box> 
        </Box> 
  );
}
