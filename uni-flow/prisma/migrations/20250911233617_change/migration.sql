/*
  Warnings:

  - Made the column `title` on table `Term` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Term" ALTER COLUMN "title" SET NOT NULL;
