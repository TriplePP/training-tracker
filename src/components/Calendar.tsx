"use client";
import React from "react";
import {Box, Typography, Button} from "@mui/material";
import {COLOURS} from "@/constants";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    getDay,
    isToday,
} from "date-fns";

// Define the Course interface
export interface CalendarCourse {
    id: number;
    title: string;
    date: string;
}

interface CalendarProps {
    courses: CalendarCourse[];
    currentMonth: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onCourseClick: (courseId: number) => void;
    emptyStateMessage?: string;
    emptyStateAction?: {
        label: string;
        onClick: () => void;
    };
}

function Calendar({
                      courses,
                      currentMonth,
                      onPrevMonth,
                      onNextMonth,
                      onCourseClick,
                      emptyStateMessage,
                      emptyStateAction,
                  }: CalendarProps) {
    // Get courses for a specific date
    const getCoursesForDate = (date: Date) => {
        return courses.filter((course) => isSameDay(new Date(course.date), date));
    };

    // Calendar header - days of the week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get all days in the current month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = monthStart;
    const endDate = monthEnd;

    // Get all days in the interval
    const days = eachDayOfInterval({start: startDate, end: endDate});

    // Calculate the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(monthStart);

    return (
        <>
            {/* Calendar Navigation */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Button onClick={onPrevMonth} variant="outlined">
                    Previous
                </Button>
                <Typography variant="h5">
                    {format(currentMonth, "MMMM yyyy")}
                </Typography>
                <Button onClick={onNextMonth} variant="outlined">
                    Next
                </Button>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{width: "100%"}}>
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
                        <Box key={day} sx={{textAlign: "center"}}>
                            <Typography
                                variant="subtitle1"
                                sx={{fontWeight: "bold", color: COLOURS.textSecondary}}
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
                    {Array.from({length: startDay}).map((_, index) => (
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
                                        onClick={() => onCourseClick(course.id)}
                                    >
                                        {course.title}
                                    </Button>
                                ))}
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Empty state message */}
            {courses.length === 0 && emptyStateMessage && (
                <Box sx={{mt: 4, textAlign: "center"}}>
                    <Typography variant="body1" color="textSecondary">
                        {emptyStateMessage}
                    </Typography>
                    {emptyStateAction && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{mt: 2}}
                            onClick={emptyStateAction.onClick}
                        >
                            {emptyStateAction.label}
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
}

export default Calendar;
