import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

import app from "../../src/app.js";

const mockPlace = {
  id: "place-uuid-1",
  name: "Power Gym",
  location: "Gothenburg",
  description: "24/7 fitness center",
  price: 50,
  userId: "user-uuid-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockReview = {
  id: "review-uuid-1",
  content: "Amazing place",
  rating: 5,
  spaceId: "place-uuid-1",
  userId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("../../src/prismaClient.js", () => ({
  prisma: {
    place: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    review: {
      create: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Places API", () => {
  it("GET /places should return all places", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.place.findMany).mockResolvedValue([mockPlace]);

    const response = await request(app).get("/places");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].name).toBe("Power Gym");
  });

  it("GET /places/:id should return a single place", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.place.findUnique).mockResolvedValue(mockPlace);

    const response = await request(app).get("/places/place-uuid-1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("place-uuid-1");
  });

  it("GET /places/:id should return 404 for unknown place", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.place.findUnique).mockResolvedValue(null);

    const response = await request(app).get("/places/nonexistent-id");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Place not found");
  });

  it("POST /places should create a new place", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.place.create).mockResolvedValue(mockPlace);

    const response = await request(app).post("/places").send({
      name: "Power Gym",
      location: "Gothenburg",
      description: "24/7 fitness center",
      price: 50,
      userId: "user-uuid-1",
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Power Gym");
  });

  it("POST /places/:id/reviews should add a review", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.review.create).mockResolvedValue(mockReview);

    const response = await request(app)
      .post("/places/place-uuid-1/reviews")
      .send({ rating: 5, comment: "Amazing place" });

    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(5);
  });
});
