"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Button } from "@mui/material";

interface SeatBookingAllocationInfo {
    seatAllocationId: string;
    flightScheduleId: string;
    modelSeatId: string;
    available: boolean;
    seatNumber: string;
    seatClass: string;
    flightModelNameKey: string;
}

interface FlightScheduleDTO {
    flightScheduleId: string;
    flightId: string;
    departureDate: string;
    flightNumber: string;
    flightModelNameKey: string;
    routeId: string;
    originAirportCode: string;
    departureLocation: string;
    destinationAirportCode: string;
    destinationLocation: string;
    seats: SeatBookingAllocationInfo[];
}

interface ApiResponse {
    data: FlightScheduleDTO[];
    messages: string[];
    returnCode: number;
}

const Page = () => {
    const currYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    const currentDay = new Date().getDate();

    const [month, setMonth] = useState(currentMonth.toString());
    const [availableMonths, setAvailableMonths] = useState<number[]>([]);
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
        12: "Decemeber",
    };

    const [day, setDay] = useState(currentDay.toString());
    const [year, setYear] = useState(currYear.toString());
    const [currentYear, setCurrentYear] = useState(currYear.toString());
    const [years, setYears] = useState<number[]>([]);
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const futureYears: number[] = [];
        for (let i = 0; i <= 5; i++) {
            futureYears.push(parseInt(currentYear) + i);
        }
        setYears(futureYears);
    }, [currentYear]);

    const handleYearChange = (event: SelectChangeEvent) => {
        setYear(event.target.value as string);

        const getDaysInMonth = (year: number, month: number) => {
            return new Date(year, month, 0).getDate();
        };

        setAvailableMonths(
            Array.from(
                { length: Object.keys(monthsDictionary).length },
                (_, i) => i + 1
            )
        );

        const days = getDaysInMonth(parseInt(year), parseInt(month));
        setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));

        setError("");
    };

    const handleMonthChange = (event: SelectChangeEvent) => {
        setMonth(event.target.value as string);
        setError("");
    };

    const handleDayChange = (event: SelectChangeEvent) => {
        setDay(event.target.value as string);
        setError("");
    };

    useEffect(() => {
        if (year && month) {
            const getDaysInMonth = (year: number, month: number) => {
                return new Date(year, month, 0).getDate();
            };

            const days = getDaysInMonth(parseInt(year), parseInt(month));

            const tempDaysInMonth = Array.from(
                { length: days },
                (_, i) => i + 1
            );

            if (year === currentYear) {
                const lastAvailableMonth = 12;

                const monthsFromCurrentMonth = Array.from(
                    { length: lastAvailableMonth - (currentMonth - 1) }, // Adjusting for 1-based index
                    (_, index) => currentMonth + index
                );

                setAvailableMonths(monthsFromCurrentMonth);
            }

            if (year === currentYear && parseInt(month) === currentMonth) {
                const daysFromCurrentDay = Array.from(
                    { length: tempDaysInMonth.length - (currentDay - 1) }, // Adjusting for 1-based index
                    (_, index) => currentDay + index
                );

                setDaysInMonth(daysFromCurrentDay);
            } else {
                setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
            }

            // Validate the selected day
            if (parseInt(day) > days) {
                setError("Invalid day for the selected month and year.");
                setDay("");
            } else {
                setError("");
            }
        }
    }, [year, month, day, currentDay, currentMonth, currentYear]);

    const [leaveFrom, setLeaveFrom] = useState("");
    const [destination, setDestination] = useState("");

    const handleLeaveFromChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setLeaveFrom(event.target.value);
    };

    const handleDestinationChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDestination(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Construct the request body
        const requestData = {
            departureLocation: leaveFrom,
            destinationLocation: destination,
            departureMonth: month,
            departureDay: day,
            departureYear: year,
        };

        console.log(requestData);

        axios
            .get<ApiResponse>("http://localhost:8080/flight-schedule", {
                params: requestData,
            })
            .then((response) => {
                console.log(response); // Log or process the response data
                console.log(response.data); // Log or process the response data
                console.log(response.data.data); // Log or process the response data
            })
            .catch((error) => {
                console.error("Error fetching flights schedules:", error); // Handle errors
            });
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Box>
                    <FormControl sx={{ width: "10%", ml: "2%" }}>
                        <InputLabel id="year-select-label">Year</InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={year}
                            label="Year"
                            onChange={handleYearChange}
                        >
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: "10%", ml: "2%" }}>
                        <InputLabel id="month-select-label">Month</InputLabel>
                        <Select
                            labelId="month-select-label"
                            id="month-select"
                            value={month}
                            label="Month"
                            onChange={handleMonthChange}
                        >
                            {availableMonths.map((month, index) => (
                                <MenuItem key={month} value={month}>
                                    {monthsDictionary[month]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl
                        sx={{ width: "10%", ml: "2%" }}
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
                            {daysInMonth.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {day}
                                </MenuItem>
                            ))}
                        </Select>
                        {error && <FormHelperText>{error}</FormHelperText>}
                    </FormControl>
                </Box>

                <Box sx={{ mt: "2%" }}>
                    <TextField
                        required
                        id="leave-from-input"
                        label="Leave From"
                        variant="outlined"
                        sx={{ width: "10%", ml: "2%" }}
                        value={leaveFrom}
                        onChange={handleLeaveFromChange}
                    />
                    <TextField
                        required
                        id="destination-input"
                        label="Destination"
                        variant="outlined"
                        sx={{ width: "10%", ml: "2%" }}
                        value={destination}
                        onChange={handleDestinationChange}
                    />
                </Box>

                <Box sx={{ mt: "2%" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: "10%", ml: "2%" }}
                    >
                        Search
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Page;
