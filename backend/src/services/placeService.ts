import { places, type Place, type Review } from "../models/placeModel.js";

export const getAllPlaces = (): Place[] => {
  return places;
};

export const getPlaceById = (id: number): Place | undefined => {
  return places.find((place) => place.id === id);
};

export const createPlace = (
  placeData: Omit<Place, "id" | "reviews">,
): Place => {
  const newPlace: Place = {
    id: places.length + 1,
    ...placeData,
    reviews: [],
  };

  places.push(newPlace);

  return newPlace;
};

export const addReviewToPlace = (
  placeId: number,
  reviewData: Omit<Review, "id">,
): Review | null => {
  const place = places.find((p) => p.id === placeId);

  if (!place) {
    return null;
  }

  const newReview: Review = {
    id: place.reviews.length + 1,
    ...reviewData,
  };

  place.reviews.push(newReview);

  return newReview;
};
