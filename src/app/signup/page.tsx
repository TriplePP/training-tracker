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
  FormControlLabel,
  Checkbox,
  Alert,
  Link,
} from "@mui/material";
import { COLOURS } from "@/constants";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "student", // Default role
    csrfToken: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate CSRF token on component mount
  useEffect(() => {
    // Generate a token and set cookie using the utility function
    const token = generateAndSetCsrfToken();

    setFormData((prev) => ({
      ...prev,
      csrfToken: token,
    }));
  }, []);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.checked ? "trainer" : "student",
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": formData.csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // Redirect to login page after short delay
      setTimeout(() => router.push("/login"), 2000);
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
            Sign Up
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully! Redirecting to login...
            </Alert>
          )}
          <form onSubmit={handleSignup}>
            <input type="hidden" name="csrfToken" value={formData.csrfToken} />
            <TextField
              label="First Name"
              name="firstname"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              name="lastname"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
            <TextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.role === "trainer"}
                  onChange={handleRoleChange}
                  name="role"
                />
              }
              label="Register as a Trainer"
              sx={{ mt: 1, display: "flex", justifyContent: "flex-start" }}
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover" sx={{ cursor: "pointer" }}>
              Log In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
