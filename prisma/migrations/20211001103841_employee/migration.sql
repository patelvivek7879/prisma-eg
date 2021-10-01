/*
  Warnings:

  - A unique constraint covering the columns `[deptId]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employee_deptId_key" ON "employee"("deptId");
