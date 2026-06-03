import { PrismaClient } from "@prisma/client";
import { users, spaces, reviews } from "../src/db";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data…");
  await prisma.review.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  const userById = new Map(users.map((u) => [u.id, u]));

  console.log(`Seeding ${users.length} users…`);
  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        password: u.password,
      },
    });
  }

  console.log(`Seeding ${spaces.length} spaces…`);
  for (const s of spaces) {
    await prisma.space.create({
      data: {
        id: s.id,
        name: s.name,
        description: s.description ?? null,
        location: s.location,
        price: s.price,
        userId: s.userId,
        imageUrl: s.imageUrl ?? null,
        venueType: s.venueType ?? null,
        tags: s.tags ?? [],
      },
    });
  }

  console.log(`Seeding ${reviews.length} reviews…`);
  for (const r of reviews) {
    const author = r.userId ? userById.get(r.userId) : undefined;
    await prisma.review.create({
      data: {
        id: r.id,
        content: r.content,
        rating: r.rating,
        userId: r.userId,
        spaceId: r.spaceId,
        author: author?.name ?? null,
        authorAvatar: author?.avatar ?? null,
        authorPronouns: author?.pronouns ?? null,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((e: unknown) => {
    console.error(e);
    throw e;
  })
  .finally(() => prisma.$disconnect());
