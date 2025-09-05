/*
  Warnings:

  - The `status` column on the `ToDo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ToDoStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "public"."ToDo" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ToDoStatus" NOT NULL DEFAULT 'PENDING';
