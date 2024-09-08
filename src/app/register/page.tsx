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

enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

const Page = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState<Gender | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
    const [day, setDay] = useState(new Date().getDate().toString());
    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [error, setError] = useState("");

    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString();

    const availableYears = Array.from(
        { length: 151 },
        (_, index) => parseInt(currentYear) - index
    );
    const monthsDictionary: { [key: number]: string } = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };
    const availableMonths = Array.from({ length: 12 }, (_, index) => index + 1);

    useEffect(() => {
        const daysInMonth = new Date(
            parseInt(year),
            parseInt(month),
            0
        ).getDate();
        const daysArray = Array.from(
            { length: daysInMonth },
            (_, index) => index + 1
        );
        setAvailableDays(daysArray);

        if (parseInt(day) > daysInMonth) {
            setDay(""); // Clear the day if it exceeds the available days
        }
    }, [year, month]);

    const handleYearChange = (event: SelectChangeEvent) => {
        setYear(event.target.value as string);

        if (
            parseInt(month) > parseInt(currentMonth) &&
            event.target.value === currentYear
        ) {
            setMonth(currentMonth);
        }
    };

    const handleMonthChange = (event: SelectChangeEvent) => {
        setMonth(event.target.value as string);
    };

    const handleDayChange = (event: SelectChangeEvent) => {
        setDay(event.target.value as string);
    };

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

        if (
            !fname ||
            !lname ||
            !email ||
            !phone ||
            !password ||
            !gender ||
            !year ||
            !month ||
            !day
        ) {
            setError("All fields are required.");
            return;
        }

        const requestData = {
            fname,
            lname,
            email,
            phone,
            password,
            gender,
            birthMonth: month,
            birthDay: day,
            birthYear: year,
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/customer/register",
                requestData
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
                            Register
                        </Typography>
                    </FormLabel>

                    <TextField
                        required
                        id="fname-input"
                        label="First Name"
                        variant="outlined"
                        sx={{ width: "100%", mt: "5%" }}
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                    />
                    <TextField
                        required
                        id="lname-input"
                        label="Last Name"
                        variant="outlined"
                        sx={{ width: "100%", mt: "5%" }}
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                    />
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
                        id="phone-input"
                        label="Phone"
                        variant="outlined"
                        sx={{ width: "100%", mt: "5%" }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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

                    <FormControl sx={{ width: "100%", mt: "5%" }}>
                        <InputLabel id="gender-select-label">Gender</InputLabel>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            value={gender}
                            label="Gender"
                            onChange={(event) =>
                                setGender(event.target.value as Gender)
                            }
                        >
                            <MenuItem value={Gender.MALE}>Male</MenuItem>
                            <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                            <MenuItem value={Gender.OTHER}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: "flex", width: "100%", mt: "5%" }}>
                        <FormControl sx={{ width: "30%", mr: "2%" }}>
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={year}
                                label="Year"
                                onChange={handleYearChange}
                            >
                                {availableYears.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: "30%", mr: "2%" }}>
                            <InputLabel id="month-select-label">
                                Month
                            </InputLabel>
                            <Select
                                labelId="month-select-label"
                                id="month-select"
                                value={month}
                                label="Month"
                                onChange={handleMonthChange}
                            >
                                {availableMonths.map((month) => (
                                    <MenuItem
                                        key={month}
                                        value={month.toString()}
                                    >
                                        {monthsDictionary[month]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{ width: "30%" }}
                            error={Boolean(error)}
                        >
                            <InputLabel id="day-select-label">Day</InputLabel>
                            <Select
                                labelId="day-select-label"
                                id="day-select"
                                value={day}
                                label="Day"
                                onChange={handleDayChange}
                            >
                                {availableDays.map((day) => (
                                    <MenuItem key={day} value={day.toString()}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && <FormHelperText>{error}</FormHelperText>}
                        </FormControl>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: "5%" }}
                    >
                        Register
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Page;
