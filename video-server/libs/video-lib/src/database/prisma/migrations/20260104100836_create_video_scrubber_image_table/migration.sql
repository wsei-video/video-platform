-- CreateTable
CREATE TABLE "VideoScrubberImage" (
    "videoId" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL,
    "rows" INTEGER NOT NULL,
    "frameDuration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "VideoScrubberImage_pkey" PRIMARY KEY ("videoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoScrubberImage_videoId_key" ON "VideoScrubberImage"("videoId");

-- AddForeignKey
ALTER TABLE "VideoScrubberImage" ADD CONSTRAINT "VideoScrubberImage_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
