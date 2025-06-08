"use client";

import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { COLOURS } from "@/constants";
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

interface CourseTileProps {
  course: Course;
}

const CourseTile: React.FC<CourseTileProps> = ({ course }) => {
  const router = useRouter();

  // Truncate description to around 50 characters
  const truncateDescription = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format the date
  const formattedDate = format(new Date(course.date), "MMM d, yyyy");

  // Get the icon component
  const iconComponent = ICON_MAP[course.icon] || (
    <SchoolIcon fontSize="large" />
  );

  return (
    <Card
      sx={{
        width: "100%",
        height: 280, // Increased further to accommodate 2 lines of heading
        textAlign: "left",
        transition: "0.3s",
        borderRadius: 4,
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
          cursor: "pointer",
        },
      }}
      onClick={() => router.push(`/trainer/classes/${course.id}`)}
    >
      <CardActionArea sx={{ height: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2, // Increased margin to give more space
              minHeight: "3rem", // Ensure consistent space for up to 2 lines
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {course.title}
          </Typography>

          <Box sx={{ color: COLOURS.primary, mb: 1 }}>{iconComponent}</Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            By {course.trainer.firstname} {course.trainer.lastname}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {formattedDate}
          </Typography>

          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {truncateDescription(course.description)}
          </Typography>

          {/* Removed underline element */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseTile;
