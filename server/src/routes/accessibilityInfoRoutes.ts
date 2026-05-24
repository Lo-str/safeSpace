import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "accessibilityInfo"));
router.get("/:id", (req, res) => getEntity(req, res, "accessibilityInfo"));
router.post("/", (req, res) => createEntity(req, res, "accessibilityInfo"));
router.put("/:id", (req, res) => updateEntity(req, res, "accessibilityInfo"));
router.delete("/:id", (req, res) =>
  deleteEntity(req, res, "accessibilityInfo"),
);

export default router;
