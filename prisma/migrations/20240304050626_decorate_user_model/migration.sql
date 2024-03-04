/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providers` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL,
ADD COLUMN     "providers" JSONB NOT NULL,
ADD COLUMN     "session" JSONB NOT NULL,
ADD COLUMN     "suspended" BOOLEAN DEFAULT false,
ADD COLUMN     "verified" BOOLEAN DEFAULT false;
