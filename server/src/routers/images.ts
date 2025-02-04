import { Router, Request, Response } from "express";
import { getUpload, scheduleDelete } from "../utils/storage";
const fs = require("fs");
const path = require("path");

const router = Router();

const UPLOADS_DIR = path.join(__dirname, '..', '..', "uploads");

const saveImage = async (req: Request, res: Response) => {
    if (!req.file || !req.body.expiration) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(UPLOADS_DIR, req.file.filename);
    scheduleDelete(req.body.expiration, filePath)

    console.log("File uploaded successfully")
    res.json({ message: "File uploaded successfully", filePath: `http://localhost:3001/v1/images/${req.file.filename}` });
};

const getImage = async (req: Request, res: Response) => {
    const { imageID } = req.params;
    const filePath = path.join(UPLOADS_DIR, imageID);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Image not found");
    }
};

router.post('/v1/images', getUpload(UPLOADS_DIR).single("file"), saveImage);
router.get('/v1/images/:imageID', getImage);

export default router;