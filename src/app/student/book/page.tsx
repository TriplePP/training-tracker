"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    CircularProgress,
    Paper,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {COLOURS} from "@/constants";
import CourseTile from "@/components/CourseTile";

interface Course {
    id: number;
    title: string;
    description: string;
    date: string;
    icon: string;
    trainer: {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
    };
}

export default function BookTraining() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleBack = () => {
        router.push("/student");
    };

    // Fetch all courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("/api/courses");
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }

                const data = await response.json();

                // Filter courses to only show those with dates from today onwards
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison

                const upcomingCourses = data.filter((course: Course) => {
                    const courseDate = new Date(course.date);
                    return courseDate >= today;
                });

                // Sort courses by date (ascending)
                const sortedCourses = upcomingCourses.sort((a: Course, b: Course) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });

                setCourses(sortedCourses);
                setFilteredCourses(sortedCourses);
            } catch (err) {
                setError("Error fetching courses. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter courses based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCourses(courses);
            return;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = courses.filter(
            (course) =>
                course.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                course.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                course.trainer.firstname.toLowerCase().includes(lowerCaseSearchTerm) ||
                course.trainer.lastname.toLowerCase().includes(lowerCaseSearchTerm)
        );

        setFilteredCourses(filtered);
    }, [searchTerm, courses]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1200,
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
                    Back to Dashboard
                </Button>

                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <EventIcon fontSize="large" sx={{mb: 2, color: COLOURS.primary}}/>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            color: COLOURS.textSecondary,
                            letterSpacing: "1px",
                            pb: 1,
                            borderBottom: `3px solid ${COLOURS.primary}`,
                            textAlign: "center",
                        }}
                    >
                        Available Training
                    </Typography>
                </Box>

                {/* Search Box */}
                <Box sx={{mb: 4}}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search training by name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "200px",
                        }}
                    >
                        <CircularProgress/>
                    </Box>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "200px",
                        }}
                    >
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}

                {/* Empty State */}
                {!loading && !error && filteredCourses.length === 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "200px",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h6" sx={{mb: 2}}>
                            No training found
                        </Typography>
                        {searchTerm ? (
                            <Typography>
                                No training matches your search. Try different keywords.
                            </Typography>
                        ) : (
                            <Typography>
                                There are no upcoming training sessions available at this time.
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Course Grid */}
                {!loading && !error && filteredCourses.length > 0 && (
                    <Box sx={{display: "flex", flexWrap: "wrap", margin: -1.5}}>
                        {filteredCourses.map((course) => (
                            <Box
                                key={course.id}
                                sx={{
                                    width: {xs: "100%", sm: "50%", md: "33.33%"},
                                    padding: 1.5,
                                }}
                            >
                                <CourseTile course={course} userRole="student"/>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
