// "use client";
// import React from "react";
// import { usePathname } from "next/navigation";

// import HomeIcon from "@mui/icons-material/Home";
// import Person2Icon from "@mui/icons-material/Person2";
// import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
// import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
// import { pink } from "@mui/material/colors";

// export default function Header() {
//     const pages = [
//         { name: `Home`, url: "/", icon: <HomeIcon /> },
//         { name: "Profile", url: "/profile", icon: <Person2Icon /> },
//         { name: "Flights", url: "/flights", icon: <AirplanemodeActiveIcon /> },
//         {
//             name: "Book a Flight",
//             url: "/flights-schedules-book",
//             icon: <AirplaneTicketIcon />,
//         },
//     ];

//     const path = usePathname();
//     console.log(path);

//     return (
//         <header
//             className="bg-red-800 w-full font-serif"
//             style={{ height: "10vh" }}
//         >
//             <nav className="flex justify-between items-center h-full w-full">
//                 <div className="w-1/3">
//                     <h1
//                         style={{ marginLeft: "5%" }}
//                         className="text-3xl text-zinc-50"
//                     >
//                         ASARK Airlines
//                     </h1>
//                 </div>
//                 <ul
//                     className="flex items-center h-full"
//                     style={{ width: "34%" }}
//                 >
//                     {pages.map((page) => (
//                         <li
//                             style={{ height: "50%" }}
//                             className={` flex items-center justify-center px-4 cursor-pointer transition-transform duration-300 ${
//                                 path === page.url
//                                     ? "text-zinc-400"
//                                     : "text-zinc-50"
//                             }  hover:text-lg`}
//                             key={page.url}
//                         >
//                             <a className="flex items-center" href={page.url}>
//                                 {page.name}
//                                 {page.icon}
//                             </a>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//         </header>
//     );
// }

"use client";
import React from "react";
import { usePathname } from "next/navigation";

import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { pink } from "@mui/material/colors";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Header() {
    const pages = [
        { name: `Home`, url: "/", icon: <HomeIcon /> },
        { name: "Profile", url: "/profile", icon: <Person2Icon /> },
        { name: "Flights", url: "/flights", icon: <AirplanemodeActiveIcon /> },
        {
            name: "Book a Flight",
            url: "/flights-schedules-book",
            icon: <AirplaneTicketIcon />,
        },
    ];

    const path = usePathname();
    console.log(path);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        // onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", sm: "block" },
                        }}
                    >
                        MUI
                    </Typography>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        {pages.map((page) => (
                            <Button key={page.url} sx={{ color: "#fff" }}>
                                <a
                                    href={page.url}
                                    className={`flex items-center justify-center px-4 cursor-pointer transition-transform duration-300 ${
                                        path === page.url
                                            ? "text-zinc-400"
                                            : "text-zinc-50"
                                    }  hover:text-zinc-600`}
                                >
                                    {page.name}
                                    {page.icon}
                                </a>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav></nav>
            <Box component="main" sx={{ p: 3 }}>
                <Toolbar />
            </Box>
        </Box>
    );
}
