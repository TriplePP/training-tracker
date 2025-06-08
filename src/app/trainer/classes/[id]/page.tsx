"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import { COLOURS } from "@/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import { format } from "date-fns";

// Import all the icons we might need to display
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

// Map of icon names to their components
const ICON_MAP: { [key: string]: React.ReactNode } = {
  School: <SchoolIcon fontSize="large" />,
  MenuBook: <MenuBookIcon fontSize="large" />,
  Code: <CodeIcon fontSize="large" />,
  Computer: <ComputerIcon fontSize="large" />,
  SportsEsports: <SportsEsportsIcon fontSize="large" />,
  FitnessCenter: <FitnessCenterIcon fontSize="large" />,
  BusinessCenter: <BusinessCenterIcon fontSize="large" />,
  Language: <LanguageIcon fontSize="large" />,
  Psychology: <PsychologyIcon fontSize="large" />,
  Science: <ScienceIcon fontSize="large" />,
};

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  status: string;
  user: User;
}

interface Course {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
  trainerId: number;
  trainer: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
  };
  enrollments: Enrollment[];
}

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/courses?id=${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError("Error fetching course details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [params.id]);

  const handleBack = () => {
    router.push("/trainer/classes");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mt: 10,
          p: 4,
          mx: "auto",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Classes
          </Button>
          <Typography color="error" align="center">
            {error || "Course not found"}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Format the date
  const formattedDate = format(new Date(course.date), "MMMM d, yyyy");

  // Get the icon component
  const iconComponent = ICON_MAP[course.icon] || (
    <SchoolIcon fontSize="large" />
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mt: 10,
        p: 4,
        mx: "auto",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Classes
        </Button>

        {/* Course Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ color: COLOURS.primary, mb: 2, fontSize: "3rem" }}>
            {iconComponent}
          </Box>

          <Typography
            variant="h4"
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
            {course.title}
          </Typography>
        </Box>

        {/* Course Details */}
        <Card sx={{ mb: 4, backgroundColor: COLOURS.primaryBackground }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Date:</strong> {formattedDate}
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <strong>Trainer:</strong> {course.trainer.firstname}{" "}
              {course.trainer.lastname}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
              Description
            </Typography>

            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </CardContent>
        </Card>

        {/* Enrolled Students */}
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: COLOURS.textSecondary,
          }}
        >
          Enrolled Students
        </Typography>

        {course.enrollments.length === 0 ? (
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>
            No students enrolled yet.
          </Typography>
        ) : (
          <List>
            {course.enrollments.map((enrollment) => (
              <ListItem
                key={enrollment.id}
                sx={{
                  mb: 1,
                  backgroundColor: "white",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${enrollment.user.firstname} ${enrollment.user.lastname}`}
                  secondary={enrollment.user.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
