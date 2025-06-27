-- Insert trainer
INSERT INTO "User" (id, username, firstname, lastname, email, password, role)
VALUES ('clid1', 'trainer1', 'John', 'Smith', 'john.smith@example.com',
        '$2b$10$iBX6dK03wYezCdeNXAAiiOV8OY6hg3f1jfciw25sqjdfUkNPW/OXW', 'trainer');

-- Insert another trainer (Jim)
INSERT INTO "User" (id, username, firstname, lastname, email, password, role)
VALUES ('clid2', 'trainer2', 'Jim', 'Trainer', 'jim.trainer@example.com',
        '$2b$10$iBX6dK03wYezCdeNXAAiiOV8OY6hg3f1jfciw25sqjdfUkNPW/OXW', 'trainer');

-- Insert students
INSERT INTO "User" (id, username, firstname, lastname, email, password, role)
VALUES ('clid3', 'student1', 'Alice', 'Johnson', 'alice.johnson@example.com',
        '$2b$10$iBX6dK03wYezCdeNXAAiiOV8OY6hg3f1jfciw25sqjdfUkNPW/OXW', 'student');

INSERT INTO "User" (id, username, firstname, lastname, email, password, role)
VALUES ('clid4', 'student2', 'Bob', 'Williams', 'bob.williams@example.com',
        '$2b$10$iBX6dK03wYezCdeNXAAiiOV8OY6hg3f1jfciw25sqjdfUkNPW/OXW', 'student');

-- Insert courses for John Smith (trainer1)
INSERT INTO "Course" (title, description, date, icon, "trainerId")
VALUES ('Introduction to JavaScript', 'Learn the fundamentals of JavaScript programming language.',
        '2025-07-15 10:00:00', 'Code', 'clid1');

INSERT INTO "Course" (title, description, date, icon, "trainerId")
VALUES ('Advanced React Development', 'Master React hooks, context API, and state management.', '2025-07-22 10:00:00',
        'Computer', 'clid1');

INSERT INTO "Course" (title, description, date, icon, "trainerId")
VALUES ('Database Design Fundamentals', 'Learn how to design efficient and scalable databases.', '2025-07-29 10:00:00',
        'Storage', 'clid1');

-- Insert courses for Jim Trainer (trainer2)
INSERT INTO "Course" (title, description, date, icon, "trainerId")
VALUES ('Python for Beginners', 'Introduction to Python programming language.', '2025-08-05 10:00:00', 'Code', 'clid2');

INSERT INTO "Course" (title, description, date, icon, "trainerId")
VALUES ('Data Science Fundamentals', 'Learn the basics of data science and analysis.', '2025-08-12 10:00:00', 'Science',
        'clid2');

-- Insert enrollments
-- Student 1 enrolled in courses
INSERT INTO "Enrollment" ("userId", "courseId", status)
VALUES ('clid3', 1, 'booked');

INSERT INTO "Enrollment" ("userId", "courseId", status)
VALUES ('clid3', 2, 'booked');

-- Student 2 enrolled in courses
INSERT INTO "Enrollment" ("userId", "courseId", status)
VALUES ('clid4', 2, 'booked');

INSERT INTO "Enrollment" ("userId", "courseId", status)
VALUES ('clid4', 3, 'booked');
