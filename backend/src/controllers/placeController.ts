import { type Request, type Response } from "express";
import { prisma } from "../prismaClient.js";

export const getPlaces = async (req: Request, res: Response): Promise<void> => {
  const places = await prisma.place.findMany();
  res.status(200).json(places);
};

export const getSinglePlace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid place id" });
    return;
  }

  const place = await prisma.place.findUnique({
    where: { id },
  });

  if (!place) {
    res.status(404).json({ message: "Place not found" });
    return;
  }

  res.status(200).json(place);
};

export const createNewPlace = async (
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

  const newPlace = await prisma.place.create({
    data: {
      name,
      location,
      description,
      price,
      userId,
    },
  });

  res.status(201).json(newPlace);
};

export const updatePlace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  const updates = req.body as Record<string, unknown>;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid place id" });
    return;
  }

  try {
    const updatedPlace = await prisma.place.update({
      where: { id },
      data: updates,
    });
    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(404).json({ message: "Place not found or invalid update data" });
  }
};

export const deletePlace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid place id" });
    return;
  }

  try {
    await prisma.place.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Place not found" });
  }
};

export const createReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { rating, comment, userId } = req.body;
  const spaceId = req.params.id;

  if (!spaceId || Array.isArray(spaceId)) {
    res.status(400).json({ message: "Invalid place id" });
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

    const review = await prisma.review.create({
      data: reviewData as any,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({
      message:
        "Unable to create review. Make sure the place exists and any provided userId is valid.",
    });
  }
};
