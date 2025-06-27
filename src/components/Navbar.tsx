"use client";

import * as React from "react";
import {COLOURS} from "../constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import Link from "next/link";
import {signOut} from "next-auth/react";
import {useAuth} from "../hooks/useAuth";
import DashboardIcon from "@mui/icons-material/Dashboard";

const navButtonStyle = {
    color: COLOURS.textPrimary,
    transition: "all 0.3s ease",
    borderBottom: `2px solid transparent`,
    "&:hover": {
        backgroundColor: "transparent",
        borderBottom: `2px solid ${COLOURS.textPrimary}`,
        borderRadius: 0,
    },
};

export default function Navbar() {
    const {isAuthenticated, user} = useAuth();

    const handleSignOut = async () => {
        await signOut({callbackUrl: "/login"});
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        component={Link}
                        href={
                            isAuthenticated
                                ? user?.role === "trainer"
                                    ? "/trainer"
                                    : "/student"
                                : "/"
                        }
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{mr: 2, color: COLOURS.textPrimary}}
                    >
                        <CastForEducationIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontFamily: "monospace",
                            letterSpacing: "5px",
                        }}
                    >
                        TrainingTracker
                    </Typography>
                    {isAuthenticated ? (
                        <>
                            <Button
                                component={Link}
                                href={user?.role === "trainer" ? "/trainer" : "/student"}
                                color="inherit"
                                sx={navButtonStyle}
                                startIcon={<DashboardIcon/>}
                            >
                                Dashboard
                            </Button>
                            <Button
                                component={Link}
                                href={
                                    user?.role === "trainer"
                                        ? "/trainer/classes"
                                        : "/student/training"
                                }
                                color="inherit"
                                sx={navButtonStyle}
                            >
                                {user?.role === "trainer" ? "My Classes" : "My Training"}
                            </Button>
                            <Button
                                component={Link}
                                href={
                                    user?.role === "trainer"
                                        ? "/trainer/calendar"
                                        : "/student/calendar"
                                }
                                color="inherit"
                                sx={navButtonStyle}
                            >
                                Calendar
                            </Button>
                            <Button
                                onClick={handleSignOut}
                                color="inherit"
                                sx={navButtonStyle}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Button
                            component={Link}
                            href="/login"
                            color="inherit"
                            sx={navButtonStyle}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
