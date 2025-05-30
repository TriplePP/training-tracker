'use client';

import {Box, CssBaseline} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Navbar from "@/components/Navbar";

const theme = createTheme();

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Navbar/>
            <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                {children}
            </Box>
        </ThemeProvider>
        </body>
        </html>
    );
}
