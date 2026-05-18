import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "tag"));
router.get("/:id", (req, res) => getEntity(req, res, "tag"));
router.post("/", (req, res) => createEntity(req, res, "tag"));
router.put("/:id", (req, res) => updateEntity(req, res, "tag"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "tag"));

export default router;
