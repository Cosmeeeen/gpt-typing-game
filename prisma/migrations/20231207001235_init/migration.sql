-- CreateTable
CREATE TABLE "TestResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "finishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prompt" TEXT NOT NULL DEFAULT '',
    "wpm" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "TestResult_finishedAt_idx" ON "TestResult"("finishedAt");
