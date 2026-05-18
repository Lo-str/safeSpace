import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "location"));
router.get("/:id", (req, res) => getEntity(req, res, "location"));
router.post("/", (req, res) => createEntity(req, res, "location"));
router.put("/:id", (req, res) => updateEntity(req, res, "location"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "location"));

export default router;
