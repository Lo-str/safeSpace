import express from "express";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getEntities,
  updateEntity,
} from "../controllers/crudController.js";

const router = express.Router();

router.get("/", (req, res) => getEntities(req, res, "favorite"));
router.get("/:id", (req, res) => getEntity(req, res, "favorite"));
router.post("/", (req, res) => createEntity(req, res, "favorite"));
router.put("/:id", (req, res) => updateEntity(req, res, "favorite"));
router.delete("/:id", (req, res) => deleteEntity(req, res, "favorite"));

export default router;
