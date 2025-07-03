/*
  Warnings:

  - You are about to drop the column `measurements` on the `canonical_listings` table. All the data in the column will be lost.
  - The `condition` column on the `canonical_listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "canonical_listings" DROP COLUMN "measurements",
DROP COLUMN "condition",
ADD COLUMN     "condition" "ListingCondition";
