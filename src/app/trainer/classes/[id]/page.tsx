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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { COLOURS } from "@/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { generateAndSetCsrfToken } from "@/lib/csrf";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    icon: "",
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/courses?id=${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }

        const data = await response.json();
        setCourse(data);

        // Initialize edit form data
        setEditFormData({
          title: data.title,
          description: data.description,
          date: new Date(data.date),
          icon: data.icon,
        });
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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    if (course) {
      setEditFormData({
        title: course.title,
        description: course.description,
        date: new Date(course.date),
        icon: course.icon,
      });
      setEditDialogOpen(true);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditError("");
  };

  const handleEditFormChange = (field: string, value: string | Date | null) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleEditSubmit = async () => {
    if (!course) return;

    setEditLoading(true);
    setEditError("");

    try {
      // Generate a CSRF token
      const csrfToken = generateAndSetCsrfToken();

      // Update the course
      const response = await fetch(`/api/courses?id=${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editFormData,
          csrfToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update course");
      }

      // Get the updated course data
      const updatedCourse = await response.json();

      // Update the course state
      setCourse(updatedCourse);

      // Show success message
      setSnackbarMessage("Course updated successfully");
      setSnackbarOpen(true);

      // Close the dialog
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating course:", err);
      setEditError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the course"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!course) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      // Generate a CSRF token
      const csrfToken = generateAndSetCsrfToken();

      // Delete the course
      const response = await fetch(`/api/courses?id=${course.id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      // Show success message
      setSnackbarMessage("Course deleted successfully");
      setSnackbarOpen(true);

      // Close the dialog
      setDeleteDialogOpen(false);

      // Redirect to classes page after a short delay
      setTimeout(() => {
        router.push("/trainer/classes");
      }, 1500);
    } catch (err) {
      console.error("Error deleting course:", err);
      setDeleteError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the course"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back to Classes
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              color="primary"
              onClick={handleEditClick}
            >
              Edit Class
            </Button>

            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
            >
              Delete Class
            </Button>
          </Box>
        </Box>

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this course? This action cannot be
            undone and will remove all student enrollments.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        aria-labelledby="edit-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">Edit Course</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Course Title"
              fullWidth
              value={editFormData.title}
              onChange={(e) => handleEditFormChange("title", e.target.value)}
              required
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editFormData.description}
              onChange={(e) =>
                handleEditFormChange("description", e.target.value)
              }
              required
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Course Date & Time"
                value={editFormData.date}
                onChange={(newDate) => handleEditFormChange("date", newDate)}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel id="icon-select-label">Course Icon</InputLabel>
              <Select
                labelId="icon-select-label"
                value={editFormData.icon}
                label="Course Icon"
                onChange={(e) => handleEditFormChange("icon", e.target.value)}
              >
                <MenuItem value="School">School</MenuItem>
                <MenuItem value="MenuBook">Book</MenuItem>
                <MenuItem value="Code">Code</MenuItem>
                <MenuItem value="Computer">Computer</MenuItem>
                <MenuItem value="SportsEsports">Gaming</MenuItem>
                <MenuItem value="FitnessCenter">Fitness</MenuItem>
                <MenuItem value="BusinessCenter">Business</MenuItem>
                <MenuItem value="Language">Language</MenuItem>
                <MenuItem value="Psychology">Psychology</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
              </Select>
            </FormControl>

            {editError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {editError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} disabled={editLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
            disabled={editLoading}
            startIcon={
              editLoading ? <CircularProgress size={20} /> : <EditIcon />
            }
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
}
