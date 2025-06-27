"use client";

import React, {useState, useEffect} from "react";
import {useRouter, useParams} from "next/navigation";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Button,
    Divider,
    Chip,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {COLOURS} from "@/constants";
import {format} from "date-fns";

interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
}

interface Enrollment {
    id: number;
    userId: string;
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
    trainer: {
        id: string;
        username: string;
        firstname: string;
        lastname: string;
    };
    enrollments: Enrollment[];
}

export default function CourseDetail() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
    const [bookingStatus, setBookingStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [csrfToken, setCsrfToken] = useState("");

    // Fetch CSRF token
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await fetch("/api/csrf");
                if (response.ok) {
                    const data = await response.json();
                    setCsrfToken(data.csrfToken);
                }
            } catch (error) {
                console.error("Failed to fetch CSRF token:", error);
            }
        };

        getCsrfToken();
    }, []);

    // Fetch course and current user data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch course details
                const courseResponse = await fetch(`/api/courses?id=${params.id}`);
                if (!courseResponse.ok) {
                    throw new Error("Failed to fetch course details");
                }
                const courseData = await courseResponse.json();
                setCourse(courseData);

                // Fetch current user
                const userResponse = await fetch("/api/users/me");
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await userResponse.json();
                setCurrentUser(userData);

                // Check if user is enrolled
                if (courseData.enrollments && userData) {
                    const enrollment = courseData.enrollments.find(
                        (e: Enrollment) => e.userId === userData.id
                    );
                    if (enrollment) {
                        setIsEnrolled(true);
                        setEnrollmentId(enrollment.id);
                    }
                }
            } catch (err) {
                setError("Error fetching data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleBack = () => {
        router.push("/student/book");
    };

    const handleBookCourse = async () => {
        if (!currentUser || !course || !csrfToken) return;

        setBookingStatus("loading");
        try {
            const response = await fetch("/api/enrollments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    courseId: course.id,
                    csrfToken,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to book training");
            }

            const data = await response.json();
            setIsEnrolled(true);
            setEnrollmentId(data.id);
            setBookingStatus("success");

            // Refresh course data to update enrollments
            const courseResponse = await fetch(`/api/courses?id=${params.id}`);
            if (courseResponse.ok) {
                const courseData = await courseResponse.json();
                setCourse(courseData);
            }
        } catch (err) {
            console.error(err);
            setBookingStatus("error");
        }
    };

    const handleCancelBooking = async () => {
        if (!enrollmentId || !csrfToken) return;

        setBookingStatus("loading");
        try {
            const response = await fetch(`/api/enrollments?id=${enrollmentId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-Token": csrfToken,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to cancel booking");
            }

            setIsEnrolled(false);
            setEnrollmentId(null);
            setBookingStatus("success");

            // Refresh course data to update enrollments
            const courseResponse = await fetch(`/api/courses?id=${params.id}`);
            if (courseResponse.ok) {
                const courseData = await courseResponse.json();
                setCourse(courseData);
            }
        } catch (err) {
            console.error(err);
            setBookingStatus("error");
        }
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
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !course) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                }}
            >
                <Typography color="error" variant="h6" sx={{mb: 2}}>
                    {error || "Course not found"}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBack}
                >
                    Back to Available Training
                </Button>
            </Box>
        );
    }

    // Format the date
    const formattedDate = format(new Date(course.date), "EEEE, MMMM d, yyyy");

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
            <Paper elevation={3} sx={{p: 4, borderRadius: 2}}>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBack}
                    sx={{mb: 3}}
                >
                    Back to Available Training
                </Button>

                {/* Course Title */}
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: COLOURS.textSecondary,
                    }}
                >
                    {course.title}
                </Typography>

                <Divider sx={{mb: 3}}/>

                {/* Course Details */}
                <Box sx={{mb: 4}}>
                    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                        <PersonIcon sx={{mr: 1, color: COLOURS.primary}}/>
                        <Typography variant="body1">
                            Trainer: {course.trainer.firstname} {course.trainer.lastname}
                        </Typography>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
                        <CalendarTodayIcon sx={{mr: 1, color: COLOURS.primary}}/>
                        <Typography variant="body1">Date: {formattedDate}</Typography>
                    </Box>

                    <Typography variant="h6" sx={{mb: 1}}>
                        Description:
                    </Typography>
                    <Typography variant="body1" sx={{mb: 3}}>
                        {course.description}
                    </Typography>
                </Box>

                {/* Booking Status Messages */}
                {bookingStatus === "success" && (
                    <Alert severity="success" sx={{mb: 3}}>
                        {isEnrolled
                            ? "You have successfully booked this training!"
                            : "You have successfully cancelled your booking."}
                    </Alert>
                )}

                {bookingStatus === "error" && (
                    <Alert severity="error" sx={{mb: 3}}>
                        There was an error processing your request. Please try again.
                    </Alert>
                )}

                {/* Booking Action */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                    }}
                >
                    {isEnrolled ? (
                        <Button
                            variant="outlined"
                            color="error"
                            size="large"
                            onClick={handleCancelBooking}
                            disabled={bookingStatus === "loading"}
                            sx={{minWidth: 200}}
                        >
                            {bookingStatus === "loading" ? (
                                <CircularProgress size={24}/>
                            ) : (
                                "Cancel Booking"
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleBookCourse}
                            disabled={bookingStatus === "loading"}
                            sx={{minWidth: 200}}
                        >
                            {bookingStatus === "loading" ? (
                                <CircularProgress size={24}/>
                            ) : (
                                "Book Training"
                            )}
                        </Button>
                    )}
                </Box>

                {/* Enrollment Count */}
                <Box sx={{mt: 4, textAlign: "center"}}>
                    <Chip
                        icon={<EventIcon/>}
                        label={`${course.enrollments?.length || 0} students enrolled`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>
            </Paper>
        </Box>
    );
}
