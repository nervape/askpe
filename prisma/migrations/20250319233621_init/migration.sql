-- CreateTable
CREATE TABLE "SharedResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "responseContent" TEXT NOT NULL,
    "originalContent" TEXT,
    "presetId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "userPrompt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Like_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "SharedResponse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SharedResponse_presetId_idx" ON "SharedResponse"("presetId");

-- CreateIndex
CREATE INDEX "SharedResponse_languageId_idx" ON "SharedResponse"("languageId");

-- CreateIndex
CREATE INDEX "SharedResponse_userId_idx" ON "SharedResponse"("userId");

-- CreateIndex
CREATE INDEX "Like_responseId_idx" ON "Like"("responseId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_responseId_key" ON "Like"("userId", "responseId");
