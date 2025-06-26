import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

// Mock the useAuth hook
jest.mock("@/hooks/useAuth");
jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

describe("Navbar Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login button when user is not authenticated", () => {
    // Mock the useAuth hook to return not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(<Navbar />);

    // Check if the login button is rendered
    const loginButton = screen.getByText("Login");
    expect(loginButton).toBeInTheDocument();

    // Check that authenticated user elements are not rendered
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
  });

  test("renders navigation buttons for authenticated student user", () => {
    // Mock the useAuth hook to return authenticated student
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { role: "student" },
    });

    render(<Navbar />);

    // Check if student navigation buttons are rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("My Training")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  test("renders navigation buttons for authenticated trainer user", () => {
    // Mock the useAuth hook to return authenticated trainer
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { role: "trainer" },
    });

    render(<Navbar />);

    // Check if trainer navigation buttons are rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("My Classes")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  test("calls signOut when sign out button is clicked", () => {
    // Mock the useAuth hook to return authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { role: "student" },
    });

    render(<Navbar />);

    // Click the sign out button
    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    // Check if signOut was called
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
