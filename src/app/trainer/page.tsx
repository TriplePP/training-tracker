"use client";
import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import ClassIcon from "@mui/icons-material/Class";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRouter } from "next/navigation";
import { COLOURS } from "@/constants";

function TrainerDashboard() {
  const router = useRouter();

  const tiles = [
    {
      title: "Create New Class",
      icon: <CreateIcon fontSize="large" />,
      href: "/trainer/create",
    },
    {
      title: "My Classes",
      icon: <ClassIcon fontSize="large" />,
      href: "/trainer/classes",
    },
    {
      title: "Calendar",
      icon: <CalendarMonthIcon fontSize="large" />,
      href: "/trainer/calendar",
    },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      gap={4}
      sx={{ flexDirection: "column" }}
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
        Hi Trainer, welcome to your dashboard
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={4}
        sx={{ backgroundColor: COLOURS.primaryBackground }}
      >
        {tiles.map((tile) => (
          <Card
            key={tile.title}
            sx={{
              width: 200,
              height: 200,
              textAlign: "center",
              transition: "0.3s",
              borderRadius: 4,
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
                cursor: "pointer",
                "& .underline": {
                  width: "60%",
                },
              },
            }}
            onClick={() => router.push(tile.href)}
          >
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {tile.icon}
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  {tile.title}
                </Typography>
                <Box
                  className="underline"
                  sx={{
                    mt: 1,
                    height: "3px",
                    width: "0%",
                    backgroundColor: COLOURS.primary,
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default TrainerDashboard;
