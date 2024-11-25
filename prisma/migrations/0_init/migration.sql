-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "login" VARCHAR(30) NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" VARCHAR(36),

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "artistId" VARCHAR(36),
    "albumId" VARCHAR(36),
    "duration" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav_albums" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" VARCHAR(36),

    CONSTRAINT "fav_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav_artists" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "fav_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav_tracks" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "artistId" VARCHAR(36),
    "albumId" VARCHAR(36),
    "duration" INTEGER NOT NULL,

    CONSTRAINT "fav_tracks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

