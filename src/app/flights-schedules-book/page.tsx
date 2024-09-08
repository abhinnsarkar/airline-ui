"use client";
import axios from "axios";
import ReactImageMagnify from "react-image-magnify";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "react-medium-image-zoom";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Alert, Button, Card, DialogContent, FormLabel } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";

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
    planeMapImgUrl: string;
    seats: SeatBookingAllocationInfo[];
}

interface ApiResponse {
    data: FlightScheduleDTO[];
    messages: string[];
    returnCode: string;
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

    const [fullFetchData, setFullFetchData] = useState<ApiResponse>();

    const [flightSchedulesFetchError, setFlightSchedulesFetchError] =
        useState("");

    const [searchClicked, setSearchClicked] = useState<Boolean>(false);

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

        var reqUrl =
            `http://localhost:8080/flight-schedule?` +
            `departureLocation=${requestData.departureLocation}` +
            `&destinationLocation=${requestData.destinationLocation}` +
            `&departureMonth=${requestData.departureMonth}` +
            `&departureDay=${requestData.departureDay}` +
            `&departureYear=${requestData.departureYear}`;

        console.log(reqUrl);

        var retrievedFlightSchedulesData;

        var info = await axios
            .get<ApiResponse>(reqUrl)
            .then((response) => {
                setFullFetchData(response.data);
                console.log(response.data.data);

                retrievedFlightSchedulesData = response.data.data;

                setRetrievedFlightSchedules(retrievedFlightSchedulesData);
            })
            .catch((error) => {
                setFlightSchedulesFetchError(error); // handle
                console.error("Error fetching flights schedules:", error); // Handle errors
            });

        console.log("info ", retrievedFlightSchedulesData);

        setSearchClicked(true);
    };

    const [retrievedFlightSchedules, setRetrievedFlightSchedules] = useState<
        FlightScheduleDTO[]
    >([]);

    const [seatsMenuOpen, setSeatsMenuOpen] = React.useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
        null
    );
    const [currentPlaneMapImgUrl, setCurrentPlaneMapImgUrl] = useState<
        string | null
    >(null);
    const [seatsData, setSeatsData] = useState<{
        [key: string]: SeatBookingAllocationInfo[];
    }>({});

    const handleSeatsMenuOpen = (
        flightScheduleId: string,
        planeMapImgUrl: string
    ) => {
        setSelectedScheduleId(flightScheduleId);
        const selectedSeats =
            retrievedFlightSchedules.find(
                (schedule) => schedule.flightScheduleId === flightScheduleId
            )?.seats ?? [];
        setSeatsData({ [flightScheduleId]: selectedSeats });
        setSeatsMenuOpen(true);

        setCurrentPlaneMapImgUrl(planeMapImgUrl);
        console.log("planeMapImgUrl: ", planeMapImgUrl);
    };

    const handleSeatsMenuClose = () => {
        setSeatsMenuOpen(false);
    };

    const [selectedSeat, setSelectedSeat] =
        useState<SeatBookingAllocationInfo | null>();

    function handleSeatClick(seatInfo: SeatBookingAllocationInfo): void {
        setSelectedSeat(seatInfo);
        console.log("seatInfo: ", seatInfo);
    }

    const [isZoomed, setIsZoomed] = useState(false);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const bookSeat = (seatAllocationId: string) => {
        console.log("Booking seat: ", seatAllocationId);
        // var reqUrl =
        //     `http://localhost:8080/flight-schedule?` +
        //     `departureLocation=${requestData.departureLocation}` +
        //     `&destinationLocation=${requestData.destinationLocation}` +
        //     `&departureMonth=${requestData.departureMonth}` +
        //     `&departureDay=${requestData.departureDay}` +
        //     `&departureYear=${requestData.departureYear}`;
    };

    return (
        <>
            <Box>
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            // backgroundColor: "orange",
                            width: "50%",
                            ml: "25%",
                        }}
                    >
                        <FormLabel>
                            <Typography>Register</Typography>
                            <Typography>Create an account</Typography>
                        </FormLabel>

                        <FormControl
                            sx={{
                                width: "20%",
                                // ml: "2%",
                            }}
                        >
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

                        <FormControl sx={{ width: "20%", ml: "2%" }}>
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
                                {availableMonths.map((month, index) => (
                                    <MenuItem key={month} value={month}>
                                        {monthsDictionary[month]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{ width: "20%", ml: "2%" }}
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

                    <Box
                        sx={{
                            mt: "2%",
                            // backgroundColor: "orange",
                            width: "50%",
                            ml: "25%",
                        }}
                    >
                        <TextField
                            required
                            id="leave-from-input"
                            label="Leave From"
                            variant="outlined"
                            sx={{ width: "20%" }}
                            value={leaveFrom}
                            onChange={handleLeaveFromChange}
                        />
                        <TextField
                            required
                            id="destination-input"
                            label="Destination"
                            variant="outlined"
                            sx={{ width: "20%", ml: "2%" }}
                            value={destination}
                            onChange={handleDestinationChange}
                        />
                    </Box>

                    <Box
                        sx={{
                            mt: "2%",
                            // backgroundColor: "orange",
                            width: "50%",
                            ml: "25%",
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ width: "20%" }}
                        >
                            Search
                        </Button>
                    </Box>
                </form>

                <Box
                    sx={{
                        width: "50%",
                        height: "70vh",
                        ml: "25%",
                        mt: "2%",
                        // backgroundColor: "red",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {retrievedFlightSchedules.length === 0 && searchClicked ? (
                        <Alert severity="error">
                            {flightSchedulesFetchError
                                ? flightSchedulesFetchError
                                : fullFetchData?.messages?.[0]}
                        </Alert>
                    ) : (
                        retrievedFlightSchedules.map(
                            (flightSchedule: FlightScheduleDTO) => (
                                <Card
                                    variant="outlined"
                                    key={flightSchedule.flightScheduleId}
                                >
                                    <CardContent
                                        sx={{
                                            alignContent: "center",
                                            // backgroundColor: "violet",
                                            width: "20%",
                                            height: "100%",
                                            float: "left",
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            // sx={{ fontSize: 20 }}
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            {flightSchedule.departureLocation}{" "}
                                            to{" "}
                                            {flightSchedule.destinationLocation}
                                        </Typography>
                                    </CardContent>

                                    <CardContent
                                        sx={{
                                            width: "20%",
                                            ml: "20%",
                                            // backgroundColor: "blue",
                                            height: "100%",
                                            float: "left",
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            component="div"
                                        >
                                            Flight {flightSchedule.flightNumber}
                                        </Typography>

                                        <Typography
                                            sx={{ fontSize: 12 }}
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            {flightSchedule.originAirportCode}{" "}
                                            to{" "}
                                            {
                                                flightSchedule.destinationAirportCode
                                            }
                                        </Typography>

                                        <Typography
                                            sx={{ mb: 1.5, fontSize: 10 }}
                                            color="text.secondary"
                                        >
                                            {flightSchedule.flightModelNameKey}
                                        </Typography>
                                    </CardContent>

                                    <CardContent
                                        sx={{
                                            alignContent: "center",
                                            // backgroundColor: "green",
                                            width: "20%",
                                            height: "100%",
                                            mt: "0%",
                                            float: "right",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx={{ float: "right" }}
                                            onClick={() =>
                                                handleSeatsMenuOpen(
                                                    flightSchedule.flightScheduleId,
                                                    flightSchedule.planeMapImgUrl
                                                )
                                            }
                                        >
                                            View Seats
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        )
                    )}
                </Box>
            </Box>

            <Dialog
                fullScreen
                onClose={handleSeatsMenuClose}
                open={seatsMenuOpen}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                }}
            >
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 0,
                        margin: 0,
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                    {/* Container for Seat List */}
                    <div
                        style={{
                            flex: "1 1 50%", // Take up half of the dialog width
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "auto",
                            borderRight: "1px solid #ddd", // Optional: border between the two sections
                            height: "100%",
                        }}
                    >
                        <List sx={{ width: "100%", height: "100%" }}>
                            {selectedScheduleId &&
                                seatsData[selectedScheduleId]?.map(
                                    (seatInfo) => (
                                        <ListItem
                                            disableGutters
                                            key={seatInfo.seatAllocationId}
                                            sx={{
                                                border: "1px solid black",
                                            }}
                                        >
                                            <ListItemButton
                                                onClick={() =>
                                                    handleSeatClick(seatInfo)
                                                }
                                            >
                                                <ListItemText
                                                    primary={`Seat Number: ${seatInfo.seatNumber}`}
                                                    secondary={`Class: ${seatInfo.seatClass}`}
                                                />
                                                <Typography
                                                    color={
                                                        seatInfo.available
                                                            ? "green"
                                                            : "red"
                                                    }
                                                >
                                                    {seatInfo.available
                                                        ? "AVAILABLE"
                                                        : "UNAVAILABLE"}
                                                </Typography>

                                                {seatInfo.available ? (
                                                    <Button
                                                        sx={{
                                                            marginLeft: "2%",
                                                        }}
                                                        variant="contained"
                                                        onClick={() =>
                                                            bookSeat(
                                                                seatInfo.seatAllocationId /*customer id*/
                                                            )
                                                        }
                                                    >
                                                        Book
                                                    </Button>
                                                ) : null}
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                )}
                        </List>
                    </div>

                    {/* Container for Image */}
                    <div
                        style={{
                            flex: "1 1 50%", // Take up half of the dialog width
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "auto",
                            height: "100%",
                        }}
                    >
                        {currentPlaneMapImgUrl && (
                            <>
                                <div
                                    style={{
                                        position: "relative",
                                        width: "80%", // Adjust width as needed
                                        height: "80%", // Adjust height as needed
                                        overflowY: "scroll",
                                    }}
                                >
                                    <img
                                        src={currentPlaneMapImgUrl}
                                        alt="Descriptive Alt Text"
                                        style={{
                                            // width: isZoomed ? "100vw" : "100%",
                                            // height: isZoomed ? "100vh" : "",
                                            cursor: "pointer",
                                            overflowY: "scroll",
                                        }}
                                        // onClick={() => toggleZoom}
                                    />
                                </div>
                                <Button onClick={handleSeatsMenuClose}>
                                    Close
                                    <CloseIcon />
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Page;
