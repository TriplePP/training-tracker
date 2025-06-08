/*
  Warnings:

  - Added the required column `icon` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student'
);
INSERT INTO "new_User" ("email", "firstname", "id", "lastname", "password", "role", "username") SELECT "email", "firstname", "id", "lastname", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "icon" TEXT NOT NULL,
    "trainerId" INTEGER NOT NULL,
    CONSTRAINT "Course_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("date", "description", "id", "title", "trainerId", "icon") SELECT "date", "description", "id", "title", "trainerId", 'School' FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
