import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "user"));
router.get("/:id", (req, res) => getEntity(req, res, "user"));
router.post("/", (req, res) => createEntity(req, res, "user"));
router.put("/:id", (req, res) => updateEntity(req, res, "user"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "user"));

export default router;
