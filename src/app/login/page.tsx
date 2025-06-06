"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  generateCsrfToken,
  setCsrfCookie,
  generateAndSetCsrfToken,
} from "@/lib/csrf";
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
import { COLOURS } from "../../constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Generate CSRF token on component mount
  useEffect(() => {
    // Generate a token and set cookie using the utility function
    const token = generateAndSetCsrfToken();
    setCsrfToken(token);
  }, []);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          email,
          password,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect based on user role
      if (data.role === "student") {
        router.push("/student");
      } else {
        router.push("/trainer");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log(error);
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
            sx={{ fontFamily: "monospace", letterSpacing: 2 }}
          >
            Log In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <input type="hidden" name="csrfToken" value={csrfToken} />
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
                "&:hover": { backgroundColor: COLOURS.secondary },
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" underline="hover" sx={{ cursor: "pointer" }}>
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
