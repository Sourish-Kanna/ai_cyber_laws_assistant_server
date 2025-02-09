/*
  Warnings:

  - Added the required column `chat_section_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chat_section_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_section_id_fkey" FOREIGN KEY ("chat_section_id") REFERENCES "chat_section"("chat_section_id") ON DELETE RESTRICT ON UPDATE CASCADE;
