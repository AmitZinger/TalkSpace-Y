const multer = require("multer");
const fs = require("fs");
const {unlink} = require('node:fs/promises');
const schedule = require("node-schedule");

export const getUpload = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: dir,
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    });

    return multer({ storage });
}

export const scheduleDelete = (expiration: Date, filePath: string) => {
    schedule.scheduleJob(expiration, async () => {
        try {
            await unlink(filePath);
            console.log(`successfully deleted ${filePath}`);
        } catch (error: any) {
            console.error('there was an error:', error.message);
        }
    });
}