import Note from "../models/note";
import {RequestHandler} from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import multer from "multer";
import * as fs from "fs";
import * as path from "path";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await Note.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler = async (req, res, next) => {
    const getNoteId = req.params.id;
    try {
        if (!mongoose.isValidObjectId(getNoteId))
            throw createHttpError(400, "Invalid note id");

        const note = await Note.findById(getNoteId).exec();

        if (!note)
            throw createHttpError(404, "Note not found");

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

interface ICreateNoteBody {
    title?: string,
    text?: string
}

export const createNote: RequestHandler<unknown, unknown, ICreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        const createNewNote = await Note.create({
            title: title,
            text: text
        });

        if (!title)
            throw createHttpError(400, "Note must have title.");

        res.status(201).json(createNewNote);
    } catch (error) {
        next(error);
    }
};

interface IUpdateNoteParams {
    id: string,
    text?: string
}

interface IUpdateNoteBody {
    title?: string,
    text?: string
}

export const updateNote: RequestHandler<IUpdateNoteParams, unknown, IUpdateNoteBody, unknown> = async (req, res, next) => {
    const id = req.params.id;
    const newText = req.body.text;
    const newTitle = req.body.title;

    try {
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid note id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Note must have title.");
        }
        const note = await Note.findById(id).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);

    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await Note.findById(id).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        await Note.deleteOne({_id: id}); // 2:37:00
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// image upload
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const upload = multer({storage});

export const uploadImage: RequestHandler = upload.single("image");

export const createImage: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            throw createHttpError(400, "No image provided.");
        }

        // You can access the uploaded file using req.file
        // and perform any additional processing or database operations here

        res.status(201).json({message: "Image uploaded successfully."});
    } catch (error) {
        next(error);
    }
};
