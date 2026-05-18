import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "category"));
router.get("/:id", (req, res) => getEntity(req, res, "category"));
router.post("/", (req, res) => createEntity(req, res, "category"));
router.put("/:id", (req, res) => updateEntity(req, res, "category"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "category"));

export default router;
