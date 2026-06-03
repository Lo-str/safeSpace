-- Space: add UI-only fields used by the frontend (image, venue type, tags array)
ALTER TABLE "Space" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Space" ADD COLUMN "venueType" TEXT;
ALTER TABLE "Space" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Review: denormalised author display fields (avatar, pronouns) used by the frontend
ALTER TABLE "Review" ADD COLUMN "author" TEXT;
ALTER TABLE "Review" ADD COLUMN "authorAvatar" TEXT;
ALTER TABLE "Review" ADD COLUMN "authorPronouns" TEXT;
