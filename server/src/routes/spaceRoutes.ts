import express from "express";

import {
  getSpaces,
  getSingleSpace,
  createNewSpace,
  updateSpace,
  deleteSpace,
  createReview,
} from "../controllers/spaceController.js";

const router = express.Router();

router.get("/", getSpaces);
router.get("/:id", getSingleSpace);
router.post("/", createNewSpace);
router.put("/:id", updateSpace);
router.delete("/:id", deleteSpace);
router.post("/:id/reviews", createReview);

export default router;

/*
GET    /spaces
GET    /spaces/:id
POST   /spaces
PUT    /spaces/:id
DELETE /spaces/:id
POST   /spaces/:id/reviews
*/
