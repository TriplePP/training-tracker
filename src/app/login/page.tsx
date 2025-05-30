'use client';

import * as React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Link } from '@mui/material';
import { COLOURS } from '../../constants';

export default function LoginPage() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOURS.primaryBackground,
                padding: 2,
            }}
        >
            <Card
                sx={{
                    width: 320,
                    padding: 3,
                    textAlign: 'center',
                    boxShadow: 3
                }}
            >
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                        Log In
                    </Typography>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete="email"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete="current-password"
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, backgroundColor: COLOURS.primary, '&:hover': { backgroundColor: COLOURS.secondary } }}
                    >
                        Sign In
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" underline="hover" sx={{ cursor: 'pointer' }}>
                            Sign Up
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}