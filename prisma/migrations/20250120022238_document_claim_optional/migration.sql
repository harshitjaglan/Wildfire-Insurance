-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_claimId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "claimId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
