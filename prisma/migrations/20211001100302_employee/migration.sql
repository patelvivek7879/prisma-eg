/*
  Warnings:

  - Added the required column `deptId` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "deptId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
