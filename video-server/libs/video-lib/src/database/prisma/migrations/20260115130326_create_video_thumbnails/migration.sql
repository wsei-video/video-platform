/*
  Warnings:

  - You are about to drop the column `hlsUrl` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "hlsUrl",
DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailId" INTEGER;

-- CreateTable
CREATE TABLE "VideoThumbnail" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "variants" TEXT NOT NULL,

    CONSTRAINT "VideoThumbnail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VideoThumbnail" ADD CONSTRAINT "VideoThumbnail_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "VideoThumbnail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
