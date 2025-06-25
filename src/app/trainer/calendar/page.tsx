"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { COLOURS } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns";

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

  // Get courses for a specific date
  const getCoursesForDate = (date: Date) => {
    return courses.filter((course) => isSameDay(new Date(course.date), date));
  };

  // Handle course click
  const handleCourseClick = (courseId: number) => {
    router.push(`/trainer/classes/${courseId}`);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

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

  // Calendar header - days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;

  // Get all days in the interval
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Calculate the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);

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
        {/* Calendar Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button onClick={prevMonth} variant="outlined">
            Previous
          </Button>
          <Typography variant="h5">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <Button onClick={nextMonth} variant="outlined">
            Next
          </Button>
        </Box>

        {/* Calendar Grid */}
        <Box sx={{ width: "100%" }}>
          {/* Days of Week Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mb: 1,
            }}
          >
            {daysOfWeek.map((day) => (
              <Box key={day} sx={{ textAlign: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: COLOURS.textSecondary }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: startDay }).map((_, index) => (
              <Box
                key={`empty-${index}`}
                sx={{
                  height: 120,
                  border: "1px solid #eee",
                  borderRadius: 1,
                  backgroundColor: "#f5f5f5",
                }}
              />
            ))}

            {/* Actual days of the month */}
            {days.map((day) => {
              const coursesOnDay = getCoursesForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <Box
                  key={day.toString()}
                  sx={{
                    height: 120,
                    border: "1px solid #eee",
                    borderRadius: 1,
                    p: 1,
                    backgroundColor: isToday(day)
                      ? "#e3f2fd"
                      : isCurrentMonth
                      ? "white"
                      : "#f5f5f5",
                    position: "relative",
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday(day) ? "bold" : "normal",
                      mb: 1,
                    }}
                  >
                    {format(day, "d")}
                  </Typography>

                  {/* Course buttons */}
                  {coursesOnDay.map((course) => (
                    <Button
                      key={course.id}
                      variant="contained"
                      size="small"
                      color="primary"
                      fullWidth
                      sx={{
                        mb: 0.5,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        fontSize: "0.75rem",
                        py: 0.5,
                        px: 1,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onClick={() => handleCourseClick(course.id)}
                    >
                      {course.title}
                    </Button>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default TrainerCalendarPage;
