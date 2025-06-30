/*
  Warnings:

  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department";

-- CreateTable
CREATE TABLE "_UserDepartments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserDepartments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserDepartments_B_index" ON "_UserDepartments"("B");

-- AddForeignKey
ALTER TABLE "_UserDepartments" ADD CONSTRAINT "_UserDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDepartments" ADD CONSTRAINT "_UserDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
