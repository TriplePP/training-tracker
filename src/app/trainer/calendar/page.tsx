"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { COLOURS } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Calendar, { CalendarCourse } from "@/components/Calendar";
import { addMonths, subMonths } from "date-fns";

// Define the Course interface
interface Course {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
  trainer: {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
  };
}

function TrainerCalendarPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Fetch courses for the logged-in trainer
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        const response = await fetch(`/api/courses?trainerId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError("Error fetching courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchCourses();
    }
  }, [user, isAuthenticated, isLoading]);

  // Handle course click
  const handleCourseClick = (courseId: number) => {
    router.push(`/trainer/classes/${courseId}`);
  };

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Convert courses to calendar courses
  const calendarCourses: CalendarCourse[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    date: course.date,
  }));

  // Show loading state
  if (isLoading || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          letterSpacing: "1px",
          color: COLOURS.textSecondary,
          mb: 4,
        }}
      >
        Training Schedule
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: COLOURS.primaryBackground,
          width: "100%",
        }}
      >
        <Calendar
          courses={calendarCourses}
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onCourseClick={handleCourseClick}
          emptyStateMessage="You haven't created any training sessions yet."
          emptyStateAction={{
            label: "Create New Training",
            onClick: () => router.push("/trainer/create"),
          }}
        />
      </Paper>
    </Box>
  );
}

export default TrainerCalendarPage;
