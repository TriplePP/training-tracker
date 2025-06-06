"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { COLOURS } from "@/constants";

function TrainerCalendarPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={4}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          letterSpacing: "1px",
          color: COLOURS.textSecondary,
        }}
      >
        Training Schedule
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "80%",
          maxWidth: 800,
          borderRadius: 2,
          backgroundColor: COLOURS.primaryBackground,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Your Training Schedule
        </Typography>
        <Typography variant="body1" paragraph>
          This page will display your scheduled training sessions and classes
          that you will be teaching.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No scheduled sessions at the moment. Create a new class to add it to
          your calendar.
        </Typography>
      </Paper>
    </Box>
  );
}

export default TrainerCalendarPage;
