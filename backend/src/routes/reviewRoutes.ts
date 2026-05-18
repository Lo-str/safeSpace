import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "review"));
router.get("/:id", (req, res) => getEntity(req, res, "review"));
router.post("/", (req, res) => createEntity(req, res, "review"));
router.put("/:id", (req, res) => updateEntity(req, res, "review"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "review"));

export default router;
