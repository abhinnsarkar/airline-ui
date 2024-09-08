"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => event.preventDefault();
    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission

        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        const requestData = {
            email,
            password,
        };

        try {
            const response = await axios.get(
                "http://localhost:8080/customer/login",
                { params: requestData }
            );
            if (response.data.success) {
                // Handle successful registration
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    mt: "2%",
                    // backgroundColor: "orange",
                    width: "50%",
                    ml: "25%",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <FormLabel sx={{ mt: "5%" }}>
                        <Typography sx={{ fontWeight: "bold" }} variant="h1">
                            Login
                        </Typography>
                    </FormLabel>

                    <TextField
                        required
                        id="email-input"
                        label="Email"
                        variant="outlined"
                        sx={{ width: "100%", mt: "5%" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        required
                        id="password-input"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        sx={{ width: "100%", mt: "5%" }}
                        onChange={handlePasswordChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: "5%" }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Page;
