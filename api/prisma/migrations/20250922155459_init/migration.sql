-- CreateEnum
CREATE TYPE "public"."TRANSACTION_STATUS" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PAYMENT_METHOD" AS ENUM ('TELEBIRR', 'BANK');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Missionary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "phone" TEXT,
    "shortBio" TEXT,
    "fullBio" TEXT,
    "location" TEXT,
    "qualification" TEXT,
    "website" TEXT,
    "experience" TEXT,
    "years" TEXT,
    "mission" TEXT,
    "focus" TEXT,
    "status" TEXT,
    "prayerRequests" TEXT[],
    "recentUpdates" JSONB,
    "supportNeeds" JSONB,
    "type" TEXT,
    "role" TEXT,
    "strategyId" TEXT,
    "livesImpacted" INTEGER,
    "communitiesServed" INTEGER,
    "projectsCompleted" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "staffId" TEXT,
    "parentRc" TEXT,
    "rcAccount" TEXT,
    "designationNumber" TEXT,
    "region" TEXT,

    CONSTRAINT "Missionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "image" BYTEA,
    "category" TEXT,
    "location" TEXT,
    "duration" TEXT,
    "teamSize" TEXT,
    "fundingGoal" TEXT,
    "fundingRaised" TEXT,
    "beneficiaries" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "urgency" TEXT,
    "urgencyFactors" TEXT[],
    "impact" TEXT[],
    "timeLine" JSONB,
    "testimonials" JSONB,
    "strategyId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Strategy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contributor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contribution" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "contributorId" TEXT NOT NULL,
    "projectId" TEXT,
    "missionaryId" TEXT,
    "strategyId" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "status" "public"."TRANSACTION_STATUS" NOT NULL,
    "paymentMethod" "public"."PAYMENT_METHOD" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "public"."session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "public"."account"("userId");

-- CreateIndex
CREATE INDEX "account_providerId_accountId_idx" ON "public"."account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "public"."verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Missionary_userId_key" ON "public"."Missionary"("userId");

-- CreateIndex
CREATE INDEX "Missionary_userId_idx" ON "public"."Missionary"("userId");

-- CreateIndex
CREATE INDEX "Missionary_strategyId_idx" ON "public"."Missionary"("strategyId");

-- CreateIndex
CREATE INDEX "Missionary_staffId_idx" ON "public"."Missionary"("staffId");

-- CreateIndex
CREATE INDEX "Missionary_region_idx" ON "public"."Missionary"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "public"."Projects"("slug");

-- CreateIndex
CREATE INDEX "Projects_slug_idx" ON "public"."Projects"("slug");

-- CreateIndex
CREATE INDEX "Projects_strategyId_idx" ON "public"."Projects"("strategyId");

-- CreateIndex
CREATE INDEX "Strategy_name_idx" ON "public"."Strategy"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_email_key" ON "public"."Contributor"("email");

-- CreateIndex
CREATE INDEX "Contributor_email_idx" ON "public"."Contributor"("email");

-- CreateIndex
CREATE INDEX "Contributor_phone_idx" ON "public"."Contributor"("phone");

-- CreateIndex
CREATE INDEX "Contribution_contributorId_idx" ON "public"."Contribution"("contributorId");

-- CreateIndex
CREATE INDEX "Contribution_projectId_idx" ON "public"."Contribution"("projectId");

-- CreateIndex
CREATE INDEX "Contribution_missionaryId_idx" ON "public"."Contribution"("missionaryId");

-- CreateIndex
CREATE INDEX "Contribution_strategyId_idx" ON "public"."Contribution"("strategyId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_contributionId_key" ON "public"."Transaction"("contributionId");

-- CreateIndex
CREATE INDEX "Transaction_contributionId_idx" ON "public"."Transaction"("contributionId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "public"."Transaction"("status");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Missionary" ADD CONSTRAINT "Missionary_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "public"."Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Missionary" ADD CONSTRAINT "Missionary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "public"."Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_missionaryId_fkey" FOREIGN KEY ("missionaryId") REFERENCES "public"."Missionary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "public"."Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "public"."Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "public"."Contribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
