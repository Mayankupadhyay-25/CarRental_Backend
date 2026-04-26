import multer from "multer";
import path from "path";
import os from "os";

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, os.tmpdir()),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
    })
})

export default upload
