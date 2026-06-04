import { type Request, type Response } from "express";
import { prisma } from "../prismaClient.js";

export const getSpaces = async (req: Request, res: Response): Promise<void> => {
  const places = await prisma.space.findMany({
    include: { reviews: true },
  });
  res.status(200).json(places);
};

export const getSingleSpace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid space id" });
    return;
  }

  const place = await prisma.space.findUnique({
    where: { id },
    include: { reviews: true },
  });

  if (!place) {
    res.status(404).json({ message: "Space not found" });
    return;
  }

  res.status(200).json(place);
};

export const createNewSpace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, location, description, price, userId } = req.body;

  if (!name || !location || typeof price !== "number" || !userId) {
    res.status(400).json({
      message: "Name, location, price, and userId are required",
    });
    return;
  }

  const newSpace = await prisma.space.create({
    data: {
      name,
      location,
      description,
      price,
      userId,
    },
  });

  res.status(201).json(newSpace);
};

export const updateSpace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  const updates = req.body as Record<string, unknown>;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid space id" });
    return;
  }

  try {
    const updatedSpace = await prisma.space.update({
      where: { id },
      data: updates,
    });
    res.status(200).json(updatedSpace);
  } catch (error) {
    res.status(404).json({ message: "Space not found or invalid update data" });
  }
};

export const deleteSpace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid space id" });
    return;
  }

  try {
    await prisma.space.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Space not found" });
  }
};

export const createReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { rating, comment, userId, author, authorAvatar } = req.body;
  const spaceId = req.params.id;

  if (!spaceId || Array.isArray(spaceId)) {
    res.status(400).json({ message: "Invalid space id" });
    return;
  }

  if (typeof rating !== "number" || !comment) {
    res.status(400).json({ message: "Rating and comment are required" });
    return;
  }

  try {
    const reviewData: Record<string, unknown> = {
      rating,
      content: comment,
      spaceId,
    };

    if (typeof userId === "string" && userId.length > 0) {
      reviewData.userId = userId;
    }
    if (typeof author === "string" && author.length > 0) {
      reviewData.author = author;
    }
    if (typeof authorAvatar === "string" && authorAvatar.length > 0) {
      reviewData.authorAvatar = authorAvatar;
    }

    const review = await prisma.review.create({
      data: reviewData as any,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({
      message:
        "Unable to create review. Make sure the space exists and any provided userId is valid.",
    });
  }
};
