'use client';

import * as React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { COLOURS } from '../../constants';

export default function SignUpPage() {
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
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                        Sign Up
                    </Typography>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete="firstname"
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete="lastname"
                    />
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete="username"
                    />
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
                        autoComplete="new-password"
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, backgroundColor: COLOURS.primary, '&:hover': { backgroundColor: COLOURS.secondary } }}
                    >
                        Create Account
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
