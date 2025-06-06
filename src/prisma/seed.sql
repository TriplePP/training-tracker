-- Insert trainer
INSERT INTO "User" (username, firstname, lastname, email, password, role)
VALUES ('trainer1', 'John', 'Smith', 'john.smith@example.com', '$2b$10$JcmxLTUuXxj5v9DMOvD7NeRpKBmWiHUdHXz3EHaOof8Cl7Qj.Qwz2', 'trainer');

-- Insert students
INSERT INTO "User" (username, firstname, lastname, email, password, role)
VALUES ('student1', 'Alice', 'Johnson', 'alice.johnson@example.com', '$2b$10$JcmxLTUuXxj5v9DMOvD7NeRpKBmWiHUdHXz3EHaOof8Cl7Qj.Qwz2', 'student');

INSERT INTO "User" (username, firstname, lastname, email, password, role)
VALUES ('student2', 'Bob', 'Williams', 'bob.williams@example.com', '$2b$10$JcmxLTUuXxj5v9DMOvD7NeRpKBmWiHUdHXz3EHaOof8Cl7Qj.Qwz2', 'student');

-- Insert courses (assuming trainer ID is 1)
INSERT INTO "Course" (title, description, date, trainerId)
VALUES ('Introduction to JavaScript', 'Learn the fundamentals of JavaScript programming language.', '2025-07-15 10:00:00', 1);

INSERT INTO "Course" (title, description, date, trainerId)
VALUES ('Advanced React Development', 'Master React hooks, context API, and state management.', '2025-07-22 10:00:00', 1);

INSERT INTO "Course" (title, description, date, trainerId)
VALUES ('Database Design Fundamentals', 'Learn how to design efficient and scalable databases.', '2025-07-29 10:00:00', 1);

-- Insert enrollments (assuming student1 ID is 2, student2 ID is 3, and course IDs are 1, 2, 3)
-- Student 1 enrolled in courses 1 and 2
INSERT INTO "Enrollment" (userId, courseId, status)
VALUES (2, 1, 'booked');

INSERT INTO "Enrollment" (userId, courseId, status)
VALUES (2, 2, 'booked');

-- Student 2 enrolled in courses 2 and 3
INSERT INTO "Enrollment" (userId, courseId, status)
VALUES (3, 2, 'booked');

INSERT INTO "Enrollment" (userId, courseId, status)
VALUES (3, 3, 'booked');
