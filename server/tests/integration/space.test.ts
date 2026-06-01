import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Bypass auth for controller tests
vi.mock("../../src/middleware/authMiddleware", () => ({
  default: (req: any, _res: any, next: () => void) => {
    req.auth = { payload: { sub: "test-user", aud: "test-audience" } };
    next();
  },
}));

import app from "../../src/app.js";

const mockSpace = {
  id: "space-uuid-1",
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
  spaceId: "space-uuid-1",
  userId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("../../src/prismaClient.js", () => ({
  prisma: {
    space: {
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

describe("Spaces API", () => {
  it("GET /spaces should return all spaces", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.space.findMany).mockResolvedValue([mockSpace]);

    const response = await request(app).get("/spaces");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].name).toBe("Power Gym");
  });

  it("GET /spaces/:id should return a single space", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.space.findUnique).mockResolvedValue(mockSpace);

    const response = await request(app).get("/spaces/space-uuid-1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("space-uuid-1");
  });

  it("GET /spaces/:id should return 404 for unknown space", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.space.findUnique).mockResolvedValue(null);

    const response = await request(app).get("/spaces/nonexistent-id");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Space not found");
  });

  it("POST /spaces should create a new space", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.space.create).mockResolvedValue(mockSpace);

    const response = await request(app).post("/spaces").send({
      name: "Power Gym",
      location: "Gothenburg",
      description: "24/7 fitness center",
      price: 50,
      userId: "user-uuid-1",
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Power Gym");
  });

  it("POST /spaces/:id/reviews should add a review", async () => {
    const { prisma } = await import("../../src/prismaClient.js");
    vi.mocked(prisma.review.create).mockResolvedValue(mockReview);

    const response = await request(app)
      .post("/spaces/space-uuid-1/reviews")
      .send({ rating: 5, comment: "Amazing place" });

    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(5);
  });
});
