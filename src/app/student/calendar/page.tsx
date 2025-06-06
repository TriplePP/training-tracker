"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { COLOURS } from "@/constants";

function CalendarPage() {
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
        Training Calendar
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
          Your Upcoming Training Sessions
        </Typography>
        <Typography variant="body1" paragraph>
          This page will display your scheduled training sessions and important
          dates.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No scheduled sessions at the moment. Check back later or book a new
          training session.
        </Typography>
      </Paper>
    </Box>
  );
}

export default CalendarPage;
