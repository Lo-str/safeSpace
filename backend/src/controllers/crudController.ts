import { type Request, type Response } from "express";
import { prisma } from "../prismaClient.js";

type ModelName =
  | "user"
  | "review"
  | "rating"
  | "tag"
  | "category"
  | "location"
  | "media"
  | "report"
  | "favorite"
  | "accessibilityInfo";

const getModel = (modelName: ModelName): any => {
  const model = (prisma as any)[modelName];

  if (!model) {
    throw new Error(`Prisma model not found: ${modelName}`);
  }

  return model;
};

export const getEntities = async (
  req: Request,
  res: Response,
  modelName: ModelName,
): Promise<void> => {
  const items = await getModel(modelName).findMany();
  res.status(200).json(items);
};

export const getEntity = async (
  req: Request,
  res: Response,
  modelName: ModelName,
): Promise<void> => {
  const item = await getModel(modelName).findUnique({
    where: { id: req.params.id },
  });

  if (!item) {
    res.status(404).json({ message: `${modelName} not found` });
    return;
  }

  res.status(200).json(item);
};

export const createEntity = async (
  req: Request,
  res: Response,
  modelName: ModelName,
): Promise<void> => {
  try {
    const newItem = await getModel(modelName).create({
      data: req.body as Record<string, unknown>,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      message: `Invalid ${modelName} create payload or missing relation data.`,
    });
  }
};

export const updateEntity = async (
  req: Request,
  res: Response,
  modelName: ModelName,
): Promise<void> => {
  try {
    const updatedItem = await getModel(modelName).update({
      where: { id: req.params.id },
      data: req.body as Record<string, unknown>,
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: `Unable to update ${modelName}. Verify the id and payload.`,
    });
  }
};

export const deleteEntity = async (
  req: Request,
  res: Response,
  modelName: ModelName,
): Promise<void> => {
  try {
    await getModel(modelName).delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: `${modelName} not found` });
  }
};
