"use client";

import {Box, CssBaseline} from "@mui/material";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/providers/SessionProvider";
import {Session} from "next-auth";

const theme = createTheme();

export default function ClientLayout({
                                         children,
                                         session,
                                     }: {
    children: React.ReactNode;
    session: Session | null;
}) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Navbar/>
                <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                    {children}
                </Box>
            </ThemeProvider>
        </SessionProvider>
    );
}
