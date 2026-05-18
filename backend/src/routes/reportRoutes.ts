import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "report"));
router.get("/:id", (req, res) => getEntity(req, res, "report"));
router.post("/", (req, res) => createEntity(req, res, "report"));
router.put("/:id", (req, res) => updateEntity(req, res, "report"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "report"));

export default router;
