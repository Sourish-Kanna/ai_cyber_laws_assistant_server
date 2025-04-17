-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('QUESTION', 'RESPONSE');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "profile_img" TEXT,
    "phone_no" VARCHAR(10),
    "username" TEXT,
    "age" INTEGER,
    "status" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "chat_section" (
    "chat_section_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(50),
    "status" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_section_pkey" PRIMARY KEY ("chat_section_id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "conversation_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(50),
    "status" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("conversation_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "conversation_id" INTEGER,
    "chat_section_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "status" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "ConversationParticipants" (
    "user_id" INTEGER NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "status" BOOLEAN DEFAULT true,

    CONSTRAINT "ConversationParticipants_pkey" PRIMARY KEY ("user_id","conversation_id")
);

-- CreateTable
CREATE TABLE "_ConversationParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConversationParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_profile_img_key" ON "User"("profile_img");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "chat_section_user_id_idx" ON "chat_section"("user_id");

-- CreateIndex
CREATE INDEX "Conversation_user_id_idx" ON "Conversation"("user_id");

-- CreateIndex
CREATE INDEX "Message_conversation_id_sender_id_idx" ON "Message"("conversation_id", "sender_id");

-- CreateIndex
CREATE INDEX "_ConversationParticipants_B_index" ON "_ConversationParticipants"("B");

-- AddForeignKey
ALTER TABLE "chat_section" ADD CONSTRAINT "chat_section_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("conversation_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_section_id_fkey" FOREIGN KEY ("chat_section_id") REFERENCES "chat_section"("chat_section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipants" ADD CONSTRAINT "ConversationParticipants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipants" ADD CONSTRAINT "ConversationParticipants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("conversation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("conversation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
