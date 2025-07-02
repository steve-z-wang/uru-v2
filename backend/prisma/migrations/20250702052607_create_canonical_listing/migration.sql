/*
  Warnings:

  - You are about to drop the `PasswordAuth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ListingCondition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "PasswordAuth" DROP CONSTRAINT "PasswordAuth_userId_fkey";

-- DropTable
DROP TABLE "PasswordAuth";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_auths" (
    "id" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "password_auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canonical_listings" (
    "id" TEXT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "imageKeys" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "size" TEXT,
    "condition" TEXT,
    "material" TEXT,
    "gender" TEXT,
    "brand" TEXT,
    "measurements" JSONB,
    "originalPrice" DOUBLE PRECISION,
    "title" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "subcategory" TEXT,
    "color" TEXT,
    "price" DOUBLE PRECISION,

    CONSTRAINT "canonical_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_auths_userId_key" ON "password_auths"("userId");

-- AddForeignKey
ALTER TABLE "password_auths" ADD CONSTRAINT "password_auths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_listings" ADD CONSTRAINT "canonical_listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
