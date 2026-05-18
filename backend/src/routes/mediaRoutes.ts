import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "media"));
router.get("/:id", (req, res) => getEntity(req, res, "media"));
router.post("/", (req, res) => createEntity(req, res, "media"));
router.put("/:id", (req, res) => updateEntity(req, res, "media"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "media"));

export default router;
