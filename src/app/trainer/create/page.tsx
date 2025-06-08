"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { generateAndSetCsrfToken } from "@/lib/csrf";
import { COLOURS } from "@/constants";

// Material UI Icons for selection
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CodeIcon from "@mui/icons-material/Code";
import ComputerIcon from "@mui/icons-material/Computer";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LanguageIcon from "@mui/icons-material/Language";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ScienceIcon from "@mui/icons-material/Science";
import CreateIcon from "@mui/icons-material/Create";

// Define the icons available for selection
const AVAILABLE_ICONS = [
  { name: "School", component: <SchoolIcon fontSize="large" /> },
  { name: "MenuBook", component: <MenuBookIcon fontSize="large" /> },
  { name: "Code", component: <CodeIcon fontSize="large" /> },
  { name: "Computer", component: <ComputerIcon fontSize="large" /> },
  { name: "SportsEsports", component: <SportsEsportsIcon fontSize="large" /> },
  { name: "FitnessCenter", component: <FitnessCenterIcon fontSize="large" /> },
  {
    name: "BusinessCenter",
    component: <BusinessCenterIcon fontSize="large" />,
  },
  { name: "Language", component: <LanguageIcon fontSize="large" /> },
  { name: "Psychology", component: <PsychologyIcon fontSize="large" /> },
  { name: "Science", component: <ScienceIcon fontSize="large" /> },
];

function CreateClass() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedIcon, setSelectedIcon] = useState("School");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const router = useRouter();

  const handleBack = () => {
    router.push("/trainer");
  };

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = generateAndSetCsrfToken();
    setCsrfToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !description || !date || !selectedIcon) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // TODO again, replace this later with next auth
      const trainerId = 1;

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date: date?.toISOString(),
          icon: selectedIcon,
          trainerId,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create course");
        setLoading(false);
        return;
      }

      setSuccess("Course created successfully!");
      setLoading(false);

      // Reset form
      setTitle("");
      setDescription("");
      setDate(new Date());
      setSelectedIcon("School");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/trainer/classes");
      }, 2000);
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mt: 10,
        p: 4,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <CreateIcon fontSize="large" sx={{ mb: 2, color: COLOURS.primary }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: COLOURS.textSecondary,
              letterSpacing: "1px",
              pb: 1,
              borderBottom: `3px solid ${COLOURS.primary}`,
            }}
          >
            Create Training
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="csrfToken" value={csrfToken} />

          {/* Course Title and Date on the same row */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Course Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Course Date"
                value={date}
                onChange={(newDate: Date | null) => setDate(newDate)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Box>

          {/* Description on its own row */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Box>

          {/* Icon selector and Confirm button on the same row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="icon-select-label">Icon</InputLabel>
              <Select
                labelId="icon-select-label"
                id="icon-select"
                value={selectedIcon}
                label="Icon"
                onChange={(e) => setSelectedIcon(e.target.value)}
                required
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <MenuItem key={icon.name} value={icon.name}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {icon.component}
                      <Typography sx={{ ml: 1 }}>{icon.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: COLOURS.primary,
                "&:hover": { backgroundColor: COLOURS.secondary },
              }}
            >
              {loading ? "Creating..." : "Confirm"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateClass;
