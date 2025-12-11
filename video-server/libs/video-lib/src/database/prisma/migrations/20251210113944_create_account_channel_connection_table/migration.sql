-- CreateTable
CREATE TABLE "AccountChannelConnection" (
    "accountId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountChannelConnection_pkey" PRIMARY KEY ("accountId","channelId")
);

-- AddForeignKey
ALTER TABLE "AccountChannelConnection" ADD CONSTRAINT "AccountChannelConnection_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountChannelConnection" ADD CONSTRAINT "AccountChannelConnection_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
