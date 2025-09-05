/*
  Warnings:

  - You are about to drop the column `endDate` on the `AcademicCourse` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `AcademicCourse` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `AcademicCourse` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the column `currentAcademicYear` on the `Term` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `TimerSession` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `TimerSession` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `TimerSession` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `ToDo` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `ToDo` table. All the data in the column will be lost.
  - You are about to drop the `_UserSubjects` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `credits` to the `AcademicCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `degree` to the `AcademicCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AcademicCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxScore` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assessment" DROP CONSTRAINT "Assessment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assessment" DROP CONSTRAINT "Assessment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimerSession" DROP CONSTRAINT "TimerSession_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserSubjects" DROP CONSTRAINT "_UserSubjects_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserSubjects" DROP CONSTRAINT "_UserSubjects_B_fkey";

-- AlterTable
ALTER TABLE "public"."AcademicCourse" DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "title",
ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "degree" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Assessment" DROP COLUMN "grade",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "maxScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Instructor" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "public"."Term" DROP COLUMN "currentAcademicYear",
ADD COLUMN     "academicYear" INTEGER;

-- AlterTable
ALTER TABLE "public"."TimerSession" DROP COLUMN "duration",
DROP COLUMN "notes",
DROP COLUMN "subjectId",
ADD COLUMN     "todoId" TEXT,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ToDo" DROP COLUMN "dueDate",
DROP COLUMN "priority",
ADD COLUMN     "assessmentId" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."_UserSubjects";

-- AddForeignKey
ALTER TABLE "public"."AcademicCourse" ADD CONSTRAINT "AcademicCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToDo" ADD CONSTRAINT "ToDo_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."Assessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimerSession" ADD CONSTRAINT "TimerSession_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "public"."ToDo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
