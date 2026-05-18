import { spaces, type Space, type Review } from "../models/spaceModel.js";

export const getAllSpaces = (): Space[] => {
  return spaces;
};

export const getSpaceById = (id: number): Space | undefined => {
  return spaces.find((space) => space.id === id);
};

export const createSpace = (
  spaceData: Omit<Space, "id" | "reviews">,
): Space => {
  const newSpace: Space = {
    id: spaces.length + 1,
    ...spaceData,
    reviews: [],
  };

  spaces.push(newSpace);

  return newSpace;
};

export const addReviewToSpace = (
  spaceId: number,
  reviewData: Omit<Review, "id">,
): Review | null => {
  const space = spaces.find((s) => s.id === spaceId);

  if (!space) {
    return null;
  }

  const newReview: Review = {
    id: space.reviews.length + 1,
    ...reviewData,
  };

  space.reviews.push(newReview);

  return newReview;
};
