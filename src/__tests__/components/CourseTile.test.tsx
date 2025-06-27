import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseTile from "@/components/CourseTile";
import {useRouter} from "next/navigation";
import {format} from "date-fns";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock date-fns format function
jest.mock("date-fns", () => ({
    format: jest.fn(),
}));

describe("CourseTile Component", () => {
    // Sample course data for testing
    const mockCourse = {
        id: 1,
        title: "Introduction to React",
        description:
            "Learn the basics of React and how to build modern web applications.",
        date: "2025-07-15T10:00:00.000Z",
        icon: "Code",
        trainer: {
            id: 123,
            username: "johndoe",
            firstname: "John",
            lastname: "Doe",
        },
    };

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock the router
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        // Mock the format function
        (format as jest.Mock).mockReturnValue("Jul 15, 2025");
    });

    test("renders course title correctly", () => {
        render(<CourseTile course={mockCourse}/>);
        expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });

    test("renders trainer name correctly", () => {
        render(<CourseTile course={mockCourse}/>);
        expect(screen.getByText("By John Doe")).toBeInTheDocument();
    });

    test("renders formatted date correctly", () => {
        render(<CourseTile course={mockCourse}/>);

        // Check if format was called with the correct arguments
        expect(format).toHaveBeenCalledWith(expect.any(Date), "MMM d, yyyy");

        // Check if the formatted date is displayed
        expect(screen.getByText("Jul 15, 2025")).toBeInTheDocument();
    });

    test("truncates long descriptions", () => {
        const longDescriptionCourse = {
            ...mockCourse,
            description:
                "This is a very long description that should be truncated because it exceeds the maximum length allowed for the course description in the CourseTile component.",
        };

        render(<CourseTile course={longDescriptionCourse}/>);

        // Check if the description is truncated
        expect(
            screen.getByText(/This is a very long description.+\.\.\./)
        ).toBeInTheDocument();
    });

    test("navigates to student booking page when clicked with student role", () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        render(<CourseTile course={mockCourse} userRole="student"/>);

        // Click on the card
        fireEvent.click(screen.getByText("Introduction to React"));

        // Check if router.push was called with the correct path
        expect(mockPush).toHaveBeenCalledWith("/student/book/1");
    });

    test("navigates to trainer class page when clicked with trainer role", () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        render(<CourseTile course={mockCourse} userRole="trainer"/>);

        // Click on the card
        fireEvent.click(screen.getByText("Introduction to React"));

        // Check if router.push was called with the correct path
        expect(mockPush).toHaveBeenCalledWith("/trainer/classes/1");
    });

    test("uses default icon when icon is not found in ICON_MAP", () => {
        const courseWithInvalidIcon = {
            ...mockCourse,
            icon: "InvalidIcon",
        };

        render(<CourseTile course={courseWithInvalidIcon}/>);

        // We can't easily test for the presence of the default icon (SchoolIcon)
        // since it's rendered as an SVG, but we can check that the component renders
        // without errors
        expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
});
