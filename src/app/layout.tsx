'use client';

import {CssBaseline} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Navbar from "@/app/components/Navbar";

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
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
