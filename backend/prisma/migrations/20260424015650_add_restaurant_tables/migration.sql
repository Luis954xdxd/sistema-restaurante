-- CreateTable
CREATE TABLE "RestaurantTable" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "qrCodeUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTable_number_key" ON "RestaurantTable"("number");
