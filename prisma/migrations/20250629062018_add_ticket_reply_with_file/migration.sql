-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "file" TEXT,
ADD COLUMN     "reply" TEXT,
ADD COLUMN     "replyFile" TEXT;
