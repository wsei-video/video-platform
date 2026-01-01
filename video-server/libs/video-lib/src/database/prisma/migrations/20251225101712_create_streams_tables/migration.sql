-- CreateTable
CREATE TABLE "AudioStream" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "codecName" TEXT NOT NULL,
    "codecId" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "channels" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,

    CONSTRAINT "AudioStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoStream" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "codecName" TEXT NOT NULL,
    "codecId" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "framerate" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "averageBitrate" INTEGER NOT NULL,
    "peakBitrate" INTEGER NOT NULL,

    CONSTRAINT "VideoStream_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AudioStream" ADD CONSTRAINT "AudioStream_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoStream" ADD CONSTRAINT "VideoStream_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
