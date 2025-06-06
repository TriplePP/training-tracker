"use client";
import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { useRouter } from "next/navigation";
import { COLOURS } from "@/constants";

function Page() {
  const router = useRouter();

  const tiles = [
    {
      title: "My Training",
      icon: <SchoolIcon fontSize="large" />,
      href: "/student/training",
    },
    {
      title: "Calendar",
      icon: <CalendarMonthIcon fontSize="large" />,
      href: "/student/calendar",
    },
    {
      title: "Book Training",
      icon: <BookOnlineIcon fontSize="large" />,
      href: "/student/book",
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
        Hi Student, welcome to your dashboard
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

export default Page;
