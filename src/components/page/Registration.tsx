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

        // Список обязательных полей для проверки
        const requiredFields = ["name", "surname", "email", "phone", "password"];

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
            const full_data : RegisterInput = Object.fromEntries(data)
            const register = await registerUser(full_data);

            if (register.token) {
                navigate("/");
            }

        }
        catch (error: any) {
            console.error(error.message || "Произошла непредвиденная ошибка");
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
                    "& .MuiFormLabel-root, & *": { color: "#F8FAFC" }, 
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'gray', borderWidth: '1px' }, 
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey', color: "#F8FAFC"  }, 
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'purple', borderWidth: '2px', color: "#F8FAFC" }, 
                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'red' },
                    '& .MuiFormHelperText-root.Mui-error': { color: 'red' },
                    '& .MuiOutlinedInput-:roothover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey', color: "#F8FAFC",},
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend': {backgroundColor: '#141e34', },
                    "& .MuiOutlinedInput-root": {backgroundColor: "#141e34",},
                    "& input:-webkit-autofill": {
                        color: "#F8FAFC",
                        WebkitBoxShadow: "0 0 0 1000px #141e34 inset",
                        WebkitTextFillColor: "#F8FAFC",
                        caretColor: "#F8FAFC",
                        transition: "background-color 5000s ease-in-out 0s",
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
