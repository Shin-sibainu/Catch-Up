-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'PAST_DUE');

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "externalid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "author" TEXT,
    "publishedat" TIMESTAMPTZ(6) NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "sourceid" TEXT NOT NULL,
    "categoryid" TEXT,
    "translatedtitle" TEXT,
    "bookmarkcount" INTEGER DEFAULT 0,
    "expiresat" TIMESTAMPTZ(6),
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userid" TEXT NOT NULL,
    "articleid" TEXT NOT NULL,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fetchlogs" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "sourceid" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "articlescount" INTEGER DEFAULT 0,
    "startedat" TIMESTAMPTZ(6) NOT NULL,
    "completedat" TIMESTAMPTZ(6),
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fetchlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "apiendpoint" TEXT,
    "enabled" BOOLEAN DEFAULT true,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userid" TEXT NOT NULL,
    "stripecustomerid" TEXT,
    "stripesubscriptionid" TEXT,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "monthlyCredits" INTEGER NOT NULL DEFAULT 5,
    "nextCreditGrantAt" TIMESTAMPTZ(6),
    "expiresat" TIMESTAMPTZ(6),
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userpreferences" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userid" TEXT NOT NULL,
    "articlespersource" INTEGER DEFAULT 5,
    "darkmode" BOOLEAN DEFAULT false,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userpreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clerkid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageurl" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 5,
    "totalCredits" INTEGER NOT NULL DEFAULT 5,
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "lastCreditGrant" TIMESTAMPTZ(6),
    "creditGrantFrequency" TEXT NOT NULL DEFAULT 'MONTHLY',
    "maxCredits" INTEGER NOT NULL DEFAULT 10,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_sourceid_externalid_key" ON "articles"("sourceid", "externalid");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userid_articleid_key" ON "bookmarks"("userid", "articleid");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sources_name_key" ON "sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userid_key" ON "subscriptions"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "userpreferences_userid_key" ON "userpreferences"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkid_key" ON "users"("clerkid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_sourceid_fkey" FOREIGN KEY ("sourceid") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_articleid_fkey" FOREIGN KEY ("articleid") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fetchlogs" ADD CONSTRAINT "fetchlogs_sourceid_fkey" FOREIGN KEY ("sourceid") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userpreferences" ADD CONSTRAINT "userpreferences_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AlterTable
ALTER TABLE "users" 
ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "totalCredits" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "usedCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastCreditGrant" TIMESTAMPTZ,
ADD COLUMN "creditGrantFrequency" TEXT NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN "maxCredits" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "subscriptions"
ADD COLUMN "monthlyCredits" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "nextCreditGrantAt" TIMESTAMPTZ,
ALTER COLUMN "plan" TYPE "SubscriptionPlan" USING 
  CASE 
    WHEN plan = 'free' OR plan IS NULL THEN 'FREE'
    WHEN plan = 'basic' THEN 'BASIC'
    WHEN plan = 'pro' THEN 'PRO'
    WHEN plan = 'enterprise' THEN 'ENTERPRISE'
    ELSE 'FREE'
  END::text::"SubscriptionPlan",
ALTER COLUMN "plan" SET DEFAULT 'FREE',
ALTER COLUMN "plan" SET NOT NULL,
ALTER COLUMN "status" TYPE "SubscriptionStatus" USING 
  CASE 
    WHEN status = 'active' OR status IS NULL THEN 'ACTIVE'
    WHEN status = 'canceled' THEN 'CANCELED'
    WHEN status = 'expired' THEN 'EXPIRED'
    WHEN status = 'past_due' THEN 'PAST_DUE'
    ELSE 'ACTIVE'
  END::text::"SubscriptionStatus",
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "status" SET NOT NULL;
