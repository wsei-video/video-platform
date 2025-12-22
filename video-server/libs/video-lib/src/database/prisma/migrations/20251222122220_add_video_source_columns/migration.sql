-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "sourceName" TEXT,
ADD COLUMN     "sourceSize" INTEGER,
ADD COLUMN     "sourceKey" TEXT,
ADD COLUMN     "sourceUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
