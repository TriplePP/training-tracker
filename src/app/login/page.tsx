"use client";

import * as React from "react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {
    hasExceededLoginAttempts,
    recordFailedLoginAttempt,
    resetLoginAttempts,
} from "@/lib/passwordUtils";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
} from "@mui/material";
import {COLOURS} from "../../constants";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Check if user has exceeded login attempts
        if (hasExceededLoginAttempts(email)) {
            setError(`Too many failed login attempts. Please try again later.`);
            setLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                // Record failed attempt and get remaining attempts
                const remaining = recordFailedLoginAttempt(email);

                if (remaining <= 0) {
                    setError(`Too many failed login attempts. Please try again later.`);
                } else {
                    setError(
                        `Invalid email or password. ${remaining} attempt${
                            remaining !== 1 ? "s" : ""
                        } remaining.`
                    );
                }

                setLoading(false);
                return;
            }

            // Reset login attempts on successful login
            resetLoginAttempts(email);

            // Fetch user data to determine role for redirection
            const response = await fetch("/api/users/me");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const userData = await response.json();

            // Redirect based on user role
            if (userData.role === "student") {
                router.push("/student");
            } else {
                router.push("/trainer");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            console.error(error);
            setLoading(false);
        }
    };
    return (
        <Box
            sx={{
                height: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLOURS.primaryBackground,
                padding: 2,
            }}
        >
            <Card
                sx={{
                    width: 320,
                    padding: 3,
                    textAlign: "center",
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{fontFamily: "monospace", letterSpacing: 2}}
                    >
                        Log In
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 2,
                                backgroundColor: COLOURS.primary,
                                "&:hover": {backgroundColor: COLOURS.secondary},
                            }}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{mt: 2}}>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" underline="hover" sx={{cursor: "pointer"}}>
                            Sign Up
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
