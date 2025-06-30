-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '5 minutes';
