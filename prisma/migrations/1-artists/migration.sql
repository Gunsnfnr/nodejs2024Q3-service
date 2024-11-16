-- CreateTable
CREATE TABLE "artists" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

