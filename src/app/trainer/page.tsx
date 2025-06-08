"use client";
import React, { useState, useEffect } from "react";
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

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

function TrainerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we'll fetch a trainer user with id=1
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const users = await response.json();
        // Find a user with role "trainer"
        const trainerUser = users.find((u: User) => u.role === "trainer");

        if (trainerUser) {
          setUser(trainerUser);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
      {/* Main Heading */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontWeight: "bold",
            color: COLOURS.textSecondary,
            letterSpacing: "1px",
            pb: 1,
            borderBottom: `3px solid ${COLOURS.primary}`,
          }}
        >
          Trainer Dashboard
        </Typography>
      </Box>

      {/* Welcome Message */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          letterSpacing: "0.5px",
          color: COLOURS.textSecondary,
          mb: 4,
        }}
      >
        Hi {user ? user.firstname : "Trainer"}, welcome to your dashboard
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
