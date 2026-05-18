import express from "express";

import {
  getPlaces,
  getSinglePlace,
  createNewPlace,
  updatePlace,
  deletePlace,
  createReview,
} from "../controllers/placeController.js";

const router = express.Router();

router.get("/", getPlaces);
router.get("/:id", getSinglePlace);
router.post("/", createNewPlace);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);
router.post("/:id/reviews", createReview);

export default router;

/*
GET    /places
GET    /places/:id
POST   /places
PUT    /places/:id
DELETE /places/:id
POST   /places/:id/reviews
*/
