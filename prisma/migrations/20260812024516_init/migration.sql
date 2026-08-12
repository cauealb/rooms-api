-- CreateEnum
CREATE TYPE "ReserveStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- CreateTable
CREATE TABLE "users" (
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id_room" TEXT NOT NULL,
    "name_room" TEXT NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id_room")
);

-- CreateTable
CREATE TABLE "reserves" (
    "id_reserve" TEXT NOT NULL,
    "id_room" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "status" "ReserveStatus" NOT NULL DEFAULT 'PENDING',
    "start_of_reserve" TIMESTAMPTZ(3) NOT NULL,
    "end_of_reserve" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "reserves_pkey" PRIMARY KEY ("id_reserve")
);

-- CreateIndex
CREATE INDEX "reserves_id_room_start_of_reserve_end_of_reserve_idx" ON "reserves"("id_room", "start_of_reserve", "end_of_reserve");

-- CreateIndex
CREATE INDEX "reserves_status_idx" ON "reserves"("status");

-- AddForeignKey
ALTER TABLE "reserves" ADD CONSTRAINT "reserves_id_room_fkey" FOREIGN KEY ("id_room") REFERENCES "rooms"("id_room") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserves" ADD CONSTRAINT "reserves_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
