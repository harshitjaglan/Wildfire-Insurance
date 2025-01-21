-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_claimId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "claimId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
