import express from "express";
import {createImage, createNote, deleteNote, getNote, getNotes, updateNote, uploadImage} from "../controllers/notes";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/images", uploadImage, createImage);
export default router;
                                           
